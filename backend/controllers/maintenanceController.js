// backend/controllers/maintenanceController.js
const asyncHandler = require('express-async-handler');
const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset'); // To update asset status

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
const getMaintenances = asyncHandler(async (req, res) => {
	const maintenances = await Maintenance.find({})
		.populate('asset', 'name serialNumber')
		.populate('user', 'name email');
	res.status(200).json(maintenances);
});

// @desc    Get a single maintenance record by ID
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceById = asyncHandler(async (req, res) => {
	const maintenance = await Maintenance.findById(req.params.id)
		.populate('asset', 'name serialNumber')
		.populate('user', 'name email');
	if (!maintenance) {
		res.status(404);
		throw new Error('Maintenance record not found');
	}
	res.status(200).json(maintenance);
});

// @desc    Create a new maintenance record
// @route   POST /api/maintenance
// @access  Private
const createMaintenance = asyncHandler(async (req, res) => {
	const { asset, maintenanceDate, type, description, cost, performedBy, status, notes } = req.body;

	if (!asset || !type || !description) {
		res.status(400);
		throw new Error('Please fill in all required fields: asset, type, description');
	}

	const existingAsset = await Asset.findById(asset);
	if (!existingAsset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	const maintenance = await Maintenance.create({
		asset,
		maintenanceDate,
		type,
		description,
		cost,
		performedBy,
		status,
		notes,
		user: req.user.id,
	});

	// Update asset status if maintenance is 'In Progress'
	if (status === 'In Progress') {
		await Asset.findByIdAndUpdate(asset, { status: 'Under Maintenance' });
	} else if (status === 'Completed' && existingAsset.status === 'Under Maintenance') {
		// If maintenance is completed and asset was under maintenance, set it to 'Available' or 'In Use'
		// This logic can be more complex based on your needs.
		await Asset.findByIdAndUpdate(asset, { status: 'Available' });
	}

	res.status(201).json(maintenance);
});

// @desc    Update a maintenance record
// @route   PUT /api/maintenance/:id
// @access  Private
const updateMaintenance = asyncHandler(async (req, res) => {
	const { asset, maintenanceDate, type, description, cost, performedBy, status, notes } = req.body;

	let maintenance = await Maintenance.findById(req.params.id);
	if (!maintenance) {
		res.status(404);
		throw new Error('Maintenance record not found');
	}

	const originalStatus = maintenance.status; // Store original status for comparison

	maintenance = await Maintenance.findByIdAndUpdate(
		req.params.id,
		{ asset, maintenanceDate, type, description, cost, performedBy, status, notes },
		{ new: true, runValidators: true }
	);

	// Update asset status based on maintenance status change
	if (status === 'In Progress' && originalStatus !== 'In Progress') {
		await Asset.findByIdAndUpdate(maintenance.asset, { status: 'Under Maintenance' });
	} else if (status === 'Completed' && originalStatus !== 'Completed') {
		// If maintenance is completed, and asset was under maintenance, set it to 'Available'
		const currentAsset = await Asset.findById(maintenance.asset);
		if (currentAsset && currentAsset.status === 'Under Maintenance') {
			await Asset.findByIdAndUpdate(maintenance.asset, { status: 'Available' });
		}
	}

	res.status(200).json(maintenance);
});

// @desc    Delete a maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private
const deleteMaintenance = asyncHandler(async (req, res) => {
	const maintenance = await Maintenance.findById(req.params.id);
	if (!maintenance) {
		res.status(404);
		throw new Error('Maintenance record not found');
	}

	// If a maintenance record is deleted, consider if the asset status needs to be reverted.
	// For simplicity, we won't automatically revert asset status here.

	await Maintenance.deleteOne({ _id: req.params.id });
	res.status(200).json({ message: 'Maintenance record removed successfully', id: req.params.id });
});

module.exports = {
	getMaintenances,
	getMaintenanceById,
	createMaintenance,
	updateMaintenance,
	deleteMaintenance,
};