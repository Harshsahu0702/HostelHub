const Admin = require("../models/Admin");

// Create basic hostel setup (currently saves Admin user)
exports.createHostelSetup = async (req, res) => {
  const { hostelName, adminName, adminEmail, adminPassword } = req.body;

  if (!hostelName || !adminEmail || !adminPassword) {
    return res.status(400).json({ message: "hostelName, adminEmail and adminPassword are required" });
  }

  try {
    const existing = await Admin.findOne({ email: adminEmail });
    if (existing) {
      return res.status(409).json({ message: "An admin with that email already exists" });
    }

    const admin = new Admin({ email: adminEmail, password: adminPassword });
    await admin.save();

    // For now, we only persist admin credentials. In future we can persist full hostel config.
    res.status(201).json({ message: "Hostel setup completed", admin: { email: admin.email } });
  } catch (err) {
    console.error("Error creating hostel setup:", err);
    res.status(500).json({ message: "Server error" });
  }
};
