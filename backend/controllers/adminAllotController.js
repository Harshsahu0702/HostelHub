const mongoose = require('mongoose');
const HostelSetup = require('../models/HostelSetup');
const StudentRegistration = require('../models/StudentRegistration');

// GET /api/admin/rooms - fetch all rooms (from completed hostel setup)
exports.getAllRooms = async (req, res) => {
  try {
    const setup = await HostelSetup.findOne({ status: 'COMPLETED' }).select('generatedRooms');
    if (!setup) return res.status(404).json({ success: false, message: 'Hostel setup not found' });
    res.json({ success: true, data: setup.generatedRooms });
  } catch (err) {
    console.error('getAllRooms error', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/admin/available-rooms?type=Single AC
exports.getAvailableRooms = async (req, res) => {
  try {
    const { type } = req.query;
    const setup = await HostelSetup.findOne({ status: 'COMPLETED' }).select('generatedRooms');
    if (!setup) return res.status(404).json({ success: false, message: 'Hostel setup not found' });
    const rooms = setup.generatedRooms.filter(r => r.active !== false);

    const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    const prefNorm = normalize(type);

    const filtered = rooms.filter(r => {
      const occ = (typeof r.occupiedCount === 'number') ? r.occupiedCount : (r.occupiedCount ? Number(r.occupiedCount) : 0);
      const cap = (typeof r.capacity === 'number') ? r.capacity : (r.capacity ? Number(r.capacity) : 1);
      const hasSpace = cap > occ;

      if (!hasSpace) return false;

      if (!type) return true;

      const roomNorm = normalize(r.type);
      // flexible matching: exact or contains
      return roomNorm === prefNorm || roomNorm.includes(prefNorm) || prefNorm.includes(roomNorm);
    });

    res.json({ success: true, data: filtered });
  } catch (err) {
    console.error('getAvailableRooms error', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/admin/auto-allot
// Performs allocation transactionally
exports.autoAllot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const setup = await HostelSetup.findOne({ status: 'COMPLETED' }).session(session);
    if (!setup) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Hostel setup not found' });
    }

    const rooms = setup.generatedRooms;
    if (!rooms || rooms.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'No rooms configured' });
    }

    const students = await StudentRegistration.find({ status: { $regex: '^pending$', $options: 'i' } }).session(session);

    let allotted = 0;
    let failed = 0;
    const roomMap = rooms.map(r => ({ ...(r && typeof r.toObject === 'function' ? r.toObject() : r) }));
    const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

    const details = [];
    for (const student of students) {
      const pref = student.preferredRoomType;
      // find room index with matching type and available capacity
      const prefNorm = normalize(pref);
      let idx = roomMap.findIndex(r => {
        const occ = (typeof r.occupiedCount === 'number') ? r.occupiedCount : (r.occupiedCount ? Number(r.occupiedCount) : 0);
        const cap = (typeof r.capacity === 'number') ? r.capacity : (r.capacity ? Number(r.capacity) : 1);
        if (!(cap > occ)) return false;
        if (r.active === false) return false;
        const roomNorm = normalize(r.type);
        if (!prefNorm) return true;
        return roomNorm === prefNorm || roomNorm.includes(prefNorm) || prefNorm.includes(roomNorm);
      });

      if (idx === -1) {
        // fallback: allocate any room with available space (ignore preference)
        const fallbackIdx = roomMap.findIndex(r => {
          const occ = (typeof r.occupiedCount === 'number') ? r.occupiedCount : (r.occupiedCount ? Number(r.occupiedCount) : 0);
          const cap = (typeof r.capacity === 'number') ? r.capacity : (r.capacity ? Number(r.capacity) : 1);
          return (cap > occ) && (r.active !== false);
        });
        if (fallbackIdx === -1) {
          failed++;
          details.push({ studentId: student._id, pref, result: 'no-room' });
          continue;
        }
        // prefer the preferred room, but if not available allocate fallback
        // set idx to fallback
        idx = fallbackIdx;
      }

      // allocate
      const room = roomMap[idx];
      const occBefore = (typeof room.occupiedCount === 'number') ? room.occupiedCount : (room.occupiedCount ? Number(room.occupiedCount) : 0);
      const capBefore = (typeof room.capacity === 'number') ? room.capacity : (room.capacity ? Number(room.capacity) : 1);
      room.occupiedCount = occBefore + 1;
      if (room.occupiedCount >= capBefore) room.occupied = true;

      // reflect change in setup.generatedRooms
      const realIdx = setup.generatedRooms.findIndex(rr => rr.roomNumber === room.roomNumber);
      if (realIdx !== -1) {
        setup.generatedRooms[realIdx].occupiedCount = room.occupiedCount;
        setup.generatedRooms[realIdx].occupied = room.occupied;
      }

      // update student
      student.roomAllocated = room.roomNumber;
      student.status = 'Allotted';
      await student.save({ session });
      allotted++;
      details.push({ studentId: student._id, pref, room: room.roomNumber, result: 'allotted' });
    }

    // save setup
    await setup.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, summary: { allotted, failed }, details });
  } catch (err) {
    console.error('autoAllot error', err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/admin/remove-all-allotments
// Removes all room allotments and resets room occupancy
exports.removeAllAllotments = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Reset all student room allocations
    await StudentRegistration.updateMany(
      { roomAllocated: { $exists: true, $ne: null } },
      { $unset: { roomAllocated: "", status: "" } },
      { session }
    );

    // Reset all room occupancy counts
    const setup = await HostelSetup.findOne({ status: 'COMPLETED' }).session(session);
    if (!setup) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Hostel setup not found' });
    }

    setup.generatedRooms = setup.generatedRooms.map(room => ({
      ...room.toObject(),
      occupiedCount: 0,
      occupied: false
    }));

    await setup.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: 'All room allotments have been removed successfully' });
  } catch (err) {
    console.error('Error in removeAllAllotments:', err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: 'Failed to remove all allotments' });
  }
};

// POST /api/admin/manual-allot
// body: { studentId, roomNumber }
exports.manualAllot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { studentId, roomNumber } = req.body;
    if (!studentId || !roomNumber) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'studentId and roomNumber are required' });
    }

    const setup = await HostelSetup.findOne({ status: 'COMPLETED' }).session(session);
    if (!setup) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Hostel setup not found' });
    }

    const roomIdx = setup.generatedRooms.findIndex(r => r.roomNumber === roomNumber);
    if (roomIdx === -1) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const room = setup.generatedRooms[roomIdx];
    const occ = (typeof room.occupiedCount === 'number') ? room.occupiedCount : (room.occupiedCount ? Number(room.occupiedCount) : 0);
    const cap = (typeof room.capacity === 'number') ? room.capacity : (room.capacity ? Number(room.capacity) : 1);
    if (occ >= cap) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Room is full' });
    }

    const student = await StudentRegistration.findById(studentId).session(session);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // assign
    student.roomAllocated = room.roomNumber;
    student.status = 'Allotted';
    await student.save({ session });

    setup.generatedRooms[roomIdx].occupiedCount = occ + 1;
    if (setup.generatedRooms[roomIdx].occupiedCount >= cap) setup.generatedRooms[roomIdx].occupied = true;

    await setup.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: 'Room allotted successfully' });
  } catch (err) {
    console.error('manualAllot error', err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/admin/auto-allot-by-type
// body: { roomType: 'Single' | 'Double' | 'Coed' | undefined }
exports.autoAllotByType = async (req, res) => {
  const { roomType } = req.body || {};
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const setup = await HostelSetup.findOne({ status: 'COMPLETED' }).session(session);
    if (!setup) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Hostel setup not found' });
    }

    const rooms = setup.generatedRooms;
    if (!rooms || rooms.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'No rooms configured' });
    }

    // prepare student query
    const q = { status: { $regex: '^pending$', $options: 'i' } };
    if (roomType && roomType !== 'All') {
      q.preferredRoomType = { $regex: roomType, $options: 'i' };
    }

    const students = await StudentRegistration.find(q).session(session);

    // roomMap as mutable objects
    const roomMap = rooms.map(r => ({ ...(r && typeof r.toObject === 'function' ? r.toObject() : r) }));
    const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

    let allotted = 0;
    let failed = 0;
    const details = [];

    // group students by preference for deterministic allotting
    let targetStudents = students.slice();

    if (roomType && roomType !== 'All') {
      // only those already selected by query
    }

    // Helper to find rooms matching a normalized type keyword
    const matchesType = (room, typeKeyword) => {
      if (!typeKeyword) return true;
      const roomNorm = normalize(room.type);
      const key = normalize(typeKeyword);
      return roomNorm === key || roomNorm.includes(key) || key.includes(roomNorm);
    };

    // Auto-allot logic differs by requested roomType
    if (!roomType || roomType === 'All') {
      // fallback to existing behavior: try to match each student's pref then any room
      for (const student of targetStudents) {
        const pref = student.preferredRoomType;
        const prefNorm = normalize(pref);

        let idx = roomMap.findIndex(r => {
          const occ = (typeof r.occupiedCount === 'number') ? r.occupiedCount : (r.occupiedCount ? Number(r.occupiedCount) : 0);
          const cap = (typeof r.capacity === 'number') ? r.capacity : (r.capacity ? Number(r.capacity) : 1);
          if (!(cap > occ)) return false;
          if (r.active === false) return false;
          const roomNorm = normalize(r.type);
          if (!prefNorm) return true;
          return roomNorm === prefNorm || roomNorm.includes(prefNorm) || prefNorm.includes(roomNorm);
        });

        if (idx === -1) {
          idx = roomMap.findIndex(r => {
            const occ = (typeof r.occupiedCount === 'number') ? r.occupiedCount : (r.occupiedCount ? Number(r.occupiedCount) : 0);
            const cap = (typeof r.capacity === 'number') ? r.capacity : (r.capacity ? Number(r.capacity) : 1);
            return (cap > occ) && (r.active !== false);
          });
        }

        if (idx === -1) { failed++; details.push({ studentId: student._id, pref, result: 'no-room' }); continue; }

        const room = roomMap[idx];
        const occBefore = (typeof room.occupiedCount === 'number') ? room.occupiedCount : (room.occupiedCount ? Number(room.occupiedCount) : 0);
        const capBefore = (typeof room.capacity === 'number') ? room.capacity : (room.capacity ? Number(room.capacity) : 1);
        room.occupiedCount = occBefore + 1;
        if (room.occupiedCount >= capBefore) room.occupied = true;

        const realIdx = setup.generatedRooms.findIndex(rr => rr.roomNumber === room.roomNumber);
        if (realIdx !== -1) {
          setup.generatedRooms[realIdx].occupiedCount = room.occupiedCount;
          setup.generatedRooms[realIdx].occupied = room.occupied;
        }

        student.roomAllocated = room.roomNumber;
        student.status = 'Allotted';
        await student.save({ session });
        allotted++;
        details.push({ studentId: student._id, pref, room: room.roomNumber, result: 'allotted' });
      }
    } else if (roomType.toLowerCase().includes('single')) {
      // allocate one room per student where room.type matches single
      const candidateRooms = roomMap.filter(r => matchesType(r, 'single') && ((r.capacity || 1) > (r.occupiedCount || 0)) && (r.active !== false));
      let roomPtr = 0;
      for (const student of targetStudents) {
        while (roomPtr < candidateRooms.length) {
          const room = candidateRooms[roomPtr];
          const occ = (typeof room.occupiedCount === 'number') ? room.occupiedCount : (room.occupiedCount ? Number(room.occupiedCount) : 0);
          const cap = (typeof room.capacity === 'number') ? room.capacity : (room.capacity ? Number(room.capacity) : 1);
          if (occ < cap) {
            // assign
            room.occupiedCount = occ + 1;
            if (room.occupiedCount >= cap) room.occupied = true;
            const realIdx = setup.generatedRooms.findIndex(rr => rr.roomNumber === room.roomNumber);
            if (realIdx !== -1) {
              setup.generatedRooms[realIdx].occupiedCount = room.occupiedCount;
              setup.generatedRooms[realIdx].occupied = room.occupied;
            }
            student.roomAllocated = room.roomNumber;
            student.status = 'Allotted';
            await student.save({ session });
            allotted++; details.push({ studentId: student._id, room: room.roomNumber, result: 'allotted' });
            break;
          } else {
            roomPtr++;
          }
        }
        if (roomPtr >= candidateRooms.length) { failed++; details.push({ studentId: student._id, result: 'no-room' }); }
      }
    } else if (roomType.toLowerCase().includes('double')) {
      // allocate rooms to pairs of students; capacity determines pairing (usually 2)
      const candidateRooms = roomMap.filter(r => matchesType(r, 'double') && ((r.capacity || 2) > (r.occupiedCount || 0)) && (r.active !== false));
      // fill each room sequentially
      let sIndex = 0;
      for (let rIdx = 0; rIdx < candidateRooms.length && sIndex < targetStudents.length; rIdx++) {
        const room = candidateRooms[rIdx];
        const cap = (typeof room.capacity === 'number') ? room.capacity : (room.capacity ? Number(room.capacity) : 2);
        while ((room.occupiedCount || 0) < cap && sIndex < targetStudents.length) {
          const student = targetStudents[sIndex++];
          const occBefore = (typeof room.occupiedCount === 'number') ? room.occupiedCount : (room.occupiedCount ? Number(room.occupiedCount) : 0);
          room.occupiedCount = occBefore + 1;
          if (room.occupiedCount >= cap) room.occupied = true;
          const realIdx = setup.generatedRooms.findIndex(rr => rr.roomNumber === room.roomNumber);
          if (realIdx !== -1) {
            setup.generatedRooms[realIdx].occupiedCount = room.occupiedCount;
            setup.generatedRooms[realIdx].occupied = room.occupied;
          }
          student.roomAllocated = room.roomNumber;
          student.status = 'Allotted';
          await student.save({ session });
          allotted++; details.push({ studentId: student._id, room: room.roomNumber, result: 'allotted' });
        }
      }
      // remaining students are failed
      if (sIndex < targetStudents.length) {
        const remaining = targetStudents.length - sIndex;
        failed += remaining;
        for (let i = sIndex; i < targetStudents.length; i++) details.push({ studentId: targetStudents[i]._id, result: 'no-room' });
      }
    } else if (roomType.toLowerCase().includes('coed')) {
      // capacity-based allotment similar to above, allow mixed genders
      const candidateRooms = roomMap.filter(r => matchesType(r, 'coed') && ((r.capacity || 2) > (r.occupiedCount || 0)) && (r.active !== false));
      let sIndex = 0;
      for (let rIdx = 0; rIdx < candidateRooms.length && sIndex < targetStudents.length; rIdx++) {
        const room = candidateRooms[rIdx];
        const cap = (typeof room.capacity === 'number') ? room.capacity : (room.capacity ? Number(room.capacity) : 2);
        while ((room.occupiedCount || 0) < cap && sIndex < targetStudents.length) {
          const student = targetStudents[sIndex++];
          const occBefore = (typeof room.occupiedCount === 'number') ? room.occupiedCount : (room.occupiedCount ? Number(room.occupiedCount) : 0);
          room.occupiedCount = occBefore + 1;
          if (room.occupiedCount >= cap) room.occupied = true;
          const realIdx = setup.generatedRooms.findIndex(rr => rr.roomNumber === room.roomNumber);
          if (realIdx !== -1) {
            setup.generatedRooms[realIdx].occupiedCount = room.occupiedCount;
            setup.generatedRooms[realIdx].occupied = room.occupied;
          }
          student.roomAllocated = room.roomNumber;
          student.status = 'Allotted';
          await student.save({ session });
          allotted++; details.push({ studentId: student._id, room: room.roomNumber, result: 'allotted' });
        }
      }
      if (sIndex < targetStudents.length) {
        const remaining = targetStudents.length - sIndex;
        failed += remaining;
        for (let i = sIndex; i < targetStudents.length; i++) details.push({ studentId: targetStudents[i]._id, result: 'no-room' });
      }
    } else {
      // unknown type: return error
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Unknown roomType' });
    }

    await setup.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, summary: { allotted, failed }, details });
  } catch (err) {
    console.error('autoAllotByType error', err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
