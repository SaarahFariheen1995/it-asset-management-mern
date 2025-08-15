const express = require('express');
const router = express.Router();
const {
	getDisposals,
	getDisposalById,
	createDisposal,
	updateDisposal,
	deleteDisposal,
} = require('../controllers/disposalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDisposals).post(protect, createDisposal);
router.route('/:id').get(protect, getDisposalById).put(protect, updateDisposal).delete(protect, deleteDisposal);

module.exports = router;