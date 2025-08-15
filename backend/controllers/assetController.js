const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');
const User = require('../models/User');

const getAssets = asyncHandler(async (req, res) => {
	const assets = await Asset.find({})
		.populate('assignedTo', 'name email')
		.populate('user', 'name email');

	res.status(200).json(assets);
});

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

const createAsset = asyncHandler(async (req, res) => {
	const { name, type, serialNumber, purchaseDate, warrantyEndDate, status, location, assignedTo, notes } = req.body;

	if (!name || !type || !serialNumber) {
		res.status(400);
		throw new Error('Please fill in all required fields: name, type, serial number');
	}

	const assetExists = await Asset.findOne({ serialNumber });
	if (assetExists) {
		res.status(400);
		throw new Error('Asset with this serial number already exists');
	}

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
		user: req.user.id, 
	});

	res.status(201).json(asset);
});

const updateAsset = asyncHandler(async (req, res) => {
	const { name, type, serialNumber, purchaseDate, warrantyEndDate, status, location, assignedTo, notes } = req.body;

	let asset = await Asset.findById(req.params.id);

	if (!asset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}

	if (serialNumber && serialNumber !== asset.serialNumber) {
		const existingAssetWithSerial = await Asset.findOne({ serialNumber });
		if (existingAssetWithSerial && existingAssetWithSerial._id.toString() !== asset._id.toString()) {
			res.status(400);
			throw new Error('Another asset with this serial number already exists');
		}
	}

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
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json(asset);
});

const deleteAsset = asyncHandler(async (req, res) => {
	const asset = await Asset.findById(req.params.id);

	if (!asset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	if (!req.user) {
		res.status(401);
		throw new Error('User not found');
	}


	await Asset.deleteOne({ _id: req.params.id });

	res.status(200).json({ message: 'Asset removed successfully', id: req.params.id });
});

module.exports = {
	getAssets,
	getAssetById,
	createAsset,
	updateAsset,
	deleteAsset,
};