const express = require('express');
const router = express.Router();
const adminAllotController = require('../controllers/adminAllotController');

router.get('/rooms', adminAllotController.getAllRooms);
router.get('/available-rooms', adminAllotController.getAvailableRooms);
router.post('/auto-allot', adminAllotController.autoAllot);
router.post('/manual-allot', adminAllotController.manualAllot);
router.post('/remove-all-allotments', adminAllotController.removeAllAllotments);

router.post('/auto-allot-by-type', adminAllotController.autoAllotByType);

router.get('/students', async (req, res) => {
	try {
		const StudentRegistration = require('../models/StudentRegistration');
		const { roomType } = req.query;
		const q = {};
		if (roomType && roomType !== 'All') q.preferredRoomType = { $regex: roomType, $options: 'i' };
		const students = await StudentRegistration.find(q);
		res.json({ success: true, data: students });
	} catch (err) {
		console.error('admin students route error', err);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

module.exports = router;
