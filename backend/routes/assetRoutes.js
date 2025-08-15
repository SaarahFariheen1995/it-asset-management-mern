const express = require('express');
const router = express.Router();
const {
	getAssets,
	getAssetById,
	createAsset,
	updateAsset,
	deleteAsset,
} = require('../controllers/assetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAssets).post(protect, createAsset);
router.route('/:id').get(protect, getAssetById).put(protect, updateAsset).delete(protect, deleteAsset);

module.exports = router;