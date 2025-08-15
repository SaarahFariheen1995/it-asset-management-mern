//backend/controllers/assetController.js
const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');
const User = require('../models/User'); // Needed to check if assignedTo user exists

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
const getAssets = asyncHandler(async (req, res) => {
	// We might want to filter assets by the user who created them,
	// or allow admins to see all. For now, let's fetch all assets
	// and populate assignedTo user details.
	const assets = await Asset.find({})
		.populate('assignedTo', 'name email') // Populate user details for assignedTo
		.populate('user', 'name email'); // Populate user details for the creator

	res.status(200).json(assets);
});

// @desc    Get a single asset by ID
// @route   GET /api/assets/:id
// @access  Private
const getAssetById = asyncHandler(async (req, res) => {
	const asset = await Asset.findById(req.params.id)
		.populate('assignedTo', 'name email')
		.populate('user', 'name email');

	if (!asset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	res.status(200).json(asset);
});

// @desc    Create a new asset
// @route   POST /api/assets
// @access  Private
const createAsset = asyncHandler(async (req, res) => {
	const { name, type, serialNumber, purchaseDate, warrantyEndDate, status, location, assignedTo, notes } = req.body;

	if (!name || !type || !serialNumber) {
		res.status(400);
		throw new Error('Please fill in all required fields: name, type, serial number');
	}

	// Check if serial number already exists
	const assetExists = await Asset.findOne({ serialNumber });
	if (assetExists) {
		res.status(400);
		throw new Error('Asset with this serial number already exists');
	}

	// If assignedTo is provided, ensure the user exists
	let assignedUser = null;
	if (assignedTo) {
		assignedUser = await User.findById(assignedTo);
		if (!assignedUser) {
			res.status(400);
			throw new Error('Assigned user not found');
		}
	}

	const asset = await Asset.create({
		name,
		type,
		serialNumber,
		purchaseDate,
		warrantyEndDate,
		status,
		location,
		assignedTo: assignedUser ? assignedUser._id : null,
		notes,
		user: req.user.id, // The user making the request is the creator
	});

	res.status(201).json(asset);
});

// @desc    Update an asset
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = asyncHandler(async (req, res) => {
	const { name, type, serialNumber, purchaseDate, warrantyEndDate, status, location, assignedTo, notes } = req.body;

	let asset = await Asset.findById(req.params.id);

	if (!asset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	// Check for user (creator of the asset record)
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	// Ensure the serial number is unique if it's being changed
	if (serialNumber && serialNumber !== asset.serialNumber) {
		const existingAssetWithSerial = await Asset.findOne({ serialNumber });
		if (existingAssetWithSerial && existingAssetWithSerial._id.toString() !== asset._id.toString()) {
			res.status(400);
			throw new Error('Another asset with this serial number already exists');
		}
	}

	// If assignedTo is provided, ensure the user exists
	let assignedUser = null;
	if (assignedTo) {
		assignedUser = await User.findById(assignedTo);
		if (!assignedUser) {
			res.status(400);
			throw new Error('Assigned user not found');
		}
	}

	asset = await Asset.findByIdAndUpdate(
		req.params.id,
		{
			name,
			type,
			serialNumber,
			purchaseDate,
			warrantyEndDate,
			status,
			location,
			assignedTo: assignedUser ? assignedUser._id : null,
			notes,
		},
		{
			new: true, // Return the updated document
			runValidators: true, // Run schema validators
		}
	);

	res.status(200).json(asset);
});

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = asyncHandler(async (req, res) => {
	const asset = await Asset.findById(req.params.id);

	if (!asset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	// Optional: Only allow the creator or an admin to delete
	// if (asset.user.toString() !== req.user.id && !req.user.isAdmin) {
	//   res.status(401);
	//   throw new Error('User not authorised to delete this asset');
	// }

	await Asset.deleteOne({ _id: req.params.id }); // Use deleteOne for clarity

	res.status(200).json({ message: 'Asset removed successfully', id: req.params.id });
});

module.exports = {
	getAssets,
	getAssetById,
	createAsset,
	updateAsset,
	deleteAsset,
};