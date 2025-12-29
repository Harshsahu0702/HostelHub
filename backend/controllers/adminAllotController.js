const mongoose = require("mongoose");
const HostelSetup = require("../models/HostelSetup");
const StudentRegistration = require("../models/StudentRegistration");

const toObjectId = (value) => {
  try {
    return new mongoose.Types.ObjectId(value);
  } catch (_) {
    return null;
  }
};

const getRoomIndexById = (setup, roomId) => {
  if (!setup?.generatedRooms || !roomId) return -1;
  const rid = toObjectId(roomId);
  if (!rid) return -1;
  return setup.generatedRooms.findIndex((r) => r?._id && r._id.equals(rid));
};

const getRoomIndexByNumber = (setup, roomNumber) => {
  if (!setup?.generatedRooms || !roomNumber) return -1;
  return setup.generatedRooms.findIndex((r) => r?.roomNumber === roomNumber);
};

// ================= GET ALL ROOMS =================
exports.getAllRooms = async (req, res) => {
  try {
    const setup = await HostelSetup.findOne({
      _id: req.user.hostelId,
      status: "COMPLETED",
    }).select("generatedRooms");

    if (!setup) {
      return res.status(404).json({
        success: false,
        message: "Hostel setup not found",
      });
    }

    res.json({ success: true, data: setup.generatedRooms });
  } catch (err) {
    console.error("getAllRooms error", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= GET AVAILABLE ROOMS =================
exports.getAvailableRooms = async (req, res) => {
  try {
    const { type } = req.query;

    const setup = await HostelSetup.findOne({
      _id: req.user.hostelId,
      status: "COMPLETED",
    }).select("generatedRooms");

    if (!setup) {
      return res.status(404).json({
        success: false,
        message: "Hostel setup not found",
      });
    }

    const rooms = setup.generatedRooms.filter((r) => r.active === true);

    const filtered = rooms.filter((r) => {
      const occ = Number(r.occupiedCount || 0);
      const cap = Number(r.capacity || 1);
      if (occ >= cap) return false;
      if (r.occupied === true) return false;

      if (!type) return true;
      return r.type === type;
    });

    res.json({ success: true, data: filtered });
  } catch (err) {
    console.error("getAvailableRooms error", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= AUTO ALLOT =================
exports.autoAllot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const setup = await HostelSetup.findOne({
      _id: req.user.hostelId,
      status: "COMPLETED",
    }).session(session);

    if (!setup) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Hostel setup not found" });
    }

    const students = await StudentRegistration.find({
      hostelId: req.user.hostelId,
      $or: [
        { allotmentStatus: "PENDING" },
        { allotmentStatus: { $exists: false } },
        { allotmentStatus: null },
      ],
    }).session(session);

    let allotted = 0;
    let failed = 0;
    const details = [];

    for (const student of students) {
      if (!student.preferredRoomType) {
        failed++;
        details.push({ studentId: student._id, result: "missing-preference" });
        continue;
      }

      if (student.allotmentStatus === "ALLOTTED" || student.roomId) {
        failed++;
        details.push({ studentId: student._id, result: "already-allotted" });
        continue;
      }

      const room = setup.generatedRooms.find((r) => {
        const occ = Number(r.occupiedCount || 0);
        const cap = Number(r.capacity || 1);
        return (
          r.type === student.preferredRoomType &&
          r.active === true &&
          r.occupied === false &&
          occ < cap
        );
      });

      if (!room) {
        failed++;
        details.push({
          studentId: student._id,
          preferredRoomType: student.preferredRoomType,
          result: "no-room",
        });
        continue;
      }

      room.occupiedCount = Number(room.occupiedCount || 0) + 1;
      room.occupied = room.occupiedCount >= Number(room.capacity || 1);

      student.roomId = room._id;
      student.roomAllocated = room.roomNumber;
      student.allotmentStatus = "ALLOTTED";
      await student.save({ session });

      allotted++;
      details.push({
        studentId: student._id,
        room: room.roomNumber,
        result: "allotted",
      });
    }

    await setup.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, summary: { allotted, failed }, details });
  } catch (err) {
    console.error("autoAllot error", err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= MANUAL ALLOT =================
exports.manualAllot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, roomNumber, roomId } = req.body;

    if (!studentId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "studentId is required" });
    }

    if (!roomNumber && !roomId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "roomNumber or roomId is required" });
    }

    const setup = await HostelSetup.findOne({
      _id: req.user.hostelId,
      status: "COMPLETED",
    }).session(session);

    if (!setup) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Hostel setup not found" });
    }

    const student = await StudentRegistration.findOne({
      _id: studentId,
      hostelId: req.user.hostelId,
    }).session(session);

    if (!student) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // If student already has a room, release it first (supports re-assignment)
    if (student.roomId) {
      const prevIdx = getRoomIndexById(setup, student.roomId);
      if (prevIdx >= 0) {
        const prevRoom = setup.generatedRooms[prevIdx];
        const prevOcc = Math.max(0, Number(prevRoom.occupiedCount || 0) - 1);
        prevRoom.occupiedCount = prevOcc;
        prevRoom.occupied = prevOcc >= Number(prevRoom.capacity || 1);
      }
    }

    if (!student.preferredRoomType) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Student preferredRoomType missing" });
    }

    const roomObjectId = roomId ? toObjectId(roomId) : null;
    const targetIdx = roomNumber
      ? getRoomIndexByNumber(setup, roomNumber)
      : (roomObjectId ? setup.generatedRooms.findIndex((r) => r?._id && r._id.equals(roomObjectId)) : -1);

    const room = targetIdx >= 0 ? setup.generatedRooms[targetIdx] : null;

    if (!room) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    if (room.active !== true) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Room is not active" });
    }

    if (room.type !== student.preferredRoomType) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Room type does not match student preference",
      });
    }

    if (room.occupied === true) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Room is full" });
    }

    if (Number(room.occupiedCount || 0) >= Number(room.capacity || 1)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Room is full" });
    }

    room.occupiedCount = Number(room.occupiedCount || 0) + 1;
    room.occupied = room.occupiedCount >= Number(room.capacity || 1);

    student.roomId = room._id;
    student.roomAllocated = room.roomNumber;
    student.allotmentStatus = "ALLOTTED";

    await student.save({ session });
    await setup.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Room allotted successfully" });
  } catch (err) {
    console.error("manualAllot error", err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= REMOVE ALLOTMENT =================
exports.removeAllotment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId } = req.body;

    if (!studentId) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "studentId is required" });
    }

    const setup = await HostelSetup.findOne({
      _id: req.user.hostelId,
      status: "COMPLETED",
    }).session(session);

    if (!setup) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Hostel setup not found" });
    }

    const student = await StudentRegistration.findOne({
      _id: studentId,
      hostelId: req.user.hostelId,
    }).session(session);

    if (!student) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.roomId) {
      const prevIdx = getRoomIndexById(setup, student.roomId);
      if (prevIdx >= 0) {
        const prevRoom = setup.generatedRooms[prevIdx];
        const prevOcc = Math.max(0, Number(prevRoom.occupiedCount || 0) - 1);
        prevRoom.occupiedCount = prevOcc;
        prevRoom.occupied = prevOcc >= Number(prevRoom.capacity || 1);
      }
    }

    student.roomId = null;
    student.roomAllocated = null;
    student.allotmentStatus = "PENDING";

    await student.save({ session });
    await setup.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Allotment removed successfully" });
  } catch (err) {
    console.error("removeAllotment error", err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
