const HostelSetup = require("../models/HostelSetup");

exports.getRoomStats = async (req, res) => {
  try {
    // ✅ Filter by hostelId from JWT
    const setup = await HostelSetup.findOne({
      _id: req.user.hostelId,
      status: "COMPLETED",
    }).select("generatedRooms");

    if (!setup || !setup.generatedRooms) {
      return res.json({
        totalRooms: 0,
        occupiedRooms: 0,
      });
    }

    const totalRooms = setup.generatedRooms.length;
    const occupiedRooms = setup.generatedRooms.filter(
      (room) => room.occupied
    ).length;

    res.json({
      totalRooms,
      occupiedRooms,
    });
  } catch (error) {
    console.error("Error fetching room stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch room statistics",
    });
  }
};
