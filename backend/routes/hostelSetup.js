const express = require("express");
const router = express.Router();
const HostelSetup = require("../models/HostelSetup");

// SAVE / UPDATE DRAFT
router.post("/save-draft", async (req, res) => {
  try {
    const { step, data, hostelId } = req.body;

    let setup = hostelId ? await HostelSetup.findById(hostelId) : null;

    if (!setup) setup = new HostelSetup();

    Object.assign(setup, data);
    setup.currentStep = step;
    setup.status = "DRAFT";

    await setup.save();

    res.json({ success: true, hostelId: setup._id, message: "Draft saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET DRAFT (resume setup)
router.get("/draft/:hostelId", async (req, res) => {
  try {
    const { hostelId } = req.params;
    const setup = await HostelSetup.findById(hostelId);
    res.json(setup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FINAL SUBMIT
router.post("/complete", async (req, res) => {
  try {
    const { hostelId } = req.body;

    if (!hostelId) {
      return res.status(400).json({ message: "hostelId is required" });
    }

    const setup = await HostelSetup.findById(hostelId);

    if (!setup) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    setup.status = "COMPLETED";
    await setup.save();

    res.json({
      success: true,
      message: "Hostel setup completed",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;