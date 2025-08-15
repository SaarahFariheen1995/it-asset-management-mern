const express = require('express');
const router = express.Router();
const {
	getMaintenances,
	getMaintenanceById,
	createMaintenance,
	updateMaintenance,
	deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMaintenances).post(protect, createMaintenance);
router.route('/:id').get(protect, getMaintenanceById).put(protect, updateMaintenance).delete(protect, deleteMaintenance);

module.exports = router;