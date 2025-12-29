const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Route to create a new admin
router.post("/create", adminController.createAdmin);
// Get admin profile by email
router.get("/:email", adminController.getAdminByEmail);

module.exports = router;