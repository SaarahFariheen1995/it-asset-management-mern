//backend/controllers/disposalController.js
const asyncHandler = require('express-async-handler');
const Disposal = require('../models/Disposal');
const Asset = require('../models/Asset'); // To update asset status

// Helper function to update asset status
const updateAssetStatus = async (assetId, status) => {
	await Asset.findByIdAndUpdate(assetId, { status }, { new: true });
};

// @desc    Get all disposal records
// @route   GET /api/disposals
// @access  Private
const getDisposals = asyncHandler(async (req, res) => {
	const disposals = await Disposal.find({})
		.populate('asset', 'name serialNumber') // Populate asset details
		.populate('user', 'name email'); // Populate creator details
	res.status(200).json(disposals);
});

// @desc    Get a single disposal record by ID
// @route   GET /api/disposals/:id
// @access  Private
const getDisposalById = asyncHandler(async (req, res) => {
	const disposal = await Disposal.findById(req.params.id)
		.populate('asset', 'name serialNumber')
		.populate('user', 'name email');
	if (!disposal) {
		res.status(404);
		throw new Error('Disposal record not found');
	}
	res.status(200).json(disposal);
});

// @desc    Create a new disposal record
// @route   POST /api/disposals
// @access  Private
const createDisposal = asyncHandler(async (req, res) => {
	const { asset, disposalDate, method, reason, notes } = req.body;

	if (!asset || !method || !reason) {
		res.status(400);
		throw new Error('Please fill in all required fields: asset, method, reason');
	}

	const existingAsset = await Asset.findById(asset);
	if (!existingAsset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	const disposal = await Disposal.create({
		asset,
		disposalDate,
		method,
		reason,
		notes,
		user: req.user.id,
	});

	// Update asset status to 'Disposed' or 'Retired'
	await updateAssetStatus(asset, 'Disposed');

	res.status(201).json(disposal);
});

// @desc    Update a disposal record
// @route   PUT /api/disposals/:id
// @access  Private
const updateDisposal = asyncHandler(async (req, res) => {
	const { asset, disposalDate, method, reason, notes } = req.body;

	let disposal = await Disposal.findById(req.params.id);
	if (!disposal) {
		res.status(404);
		throw new Error('Disposal record not found');
	}

	// If the asset being disposed changes, we might need to revert the old asset's status
	// and update the new asset's status. This is complex, so for simplicity,
	// we'll assume asset ID doesn't change after creation for disposal records.
	// If it does, you'd need more robust logic here.

	disposal = await Disposal.findByIdAndUpdate(
		req.params.id,
		{ asset, disposalDate, method, reason, notes },
		{ new: true, runValidators: true }
	);

	// If the asset was changed, update its status.
	// For now, we assume the asset ID remains the same.
	// If the asset ID is changed in the update, you'd need to handle status updates for both old and new assets.
	await updateAssetStatus(disposal.asset, 'Disposed');


	res.status(200).json(disposal);
});

// @desc    Delete a disposal record
// @route   DELETE /api/disposals/:id
// @access  Private
const deleteDisposal = asyncHandler(async (req, res) => {
	const disposal = await Disposal.findById(req.params.id);
	if (!disposal) {
		res.status(404);
		throw new Error('Disposal record not found');
	}

	// Optional: Revert asset status if disposal is deleted?
	// This depends on business logic. For now, we won't automatically revert.
	// If you delete a disposal, the asset might still be considered disposed.

	await Disposal.deleteOne({ _id: req.params.id });
	res.status(200).json({ message: 'Disposal record removed successfully', id: req.params.id });
});

module.exports = {
	getDisposals,
	getDisposalById,
	createDisposal,
	updateDisposal,
	deleteDisposal,
};