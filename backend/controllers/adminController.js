const Admin = require("../models/Admin");
const HostelSetup = require("../models/HostelSetup");

exports.createAdmin = async (req, res) => {
    try {
        const { hostelId, email, password, name, phone, role, authorisation } = req.body;

        const exisitingAdmin = await Admin.findOne({ email });

        if (exisitingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists."
            });
        }

        //creating a new admin
        const newAdmin = new Admin({
            name,
            email,
            password,
            hostelId: hostelId,
            role: 'super-admin',
            phone: "N/A",          // REQUIRED by schema
            authorisation: {}      // REQUIRED by schema
        });


        await newAdmin.save();

        const adminData = newAdmin.toObject();
        delete adminData.password;

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: adminData
        });

    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.createSuperAdmin = async (req, res) => {
    try {
        const { name, email, password, hostelId } = req.body;

        if (!hostelId) {
            return res.status(400).json({ success: false, message: "Hostel ID is required." });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin with this email already exists." });
        }

        const newAdmin = new Admin({
            name,
            email,
            password,
            hostelid: hostelId,
            role: 'super-admin'
        });

        await newAdmin.save();

        // Update HostelSetup step
        await HostelSetup.findByIdAndUpdate(hostelId, { currentStep: 2 });

        res.status(201).json({
            success: true,
            message: "Super Admin created successfully",
            data: { id: newAdmin._id, email: newAdmin.email }
        });

    } catch (error) {
        console.error("Error creating super admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get admin profile by email (public endpoint for admin UI)
exports.getAdminByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const admin = await Admin.findOne({ email }).select('-password').populate('hostelId', 'hostelName');

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.json({ success: true, data: admin });
    } catch (error) {
        console.error('Error fetching admin by email:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
