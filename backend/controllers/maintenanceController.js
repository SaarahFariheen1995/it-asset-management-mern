const asyncHandler = require('express-async-handler');
const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset');

const getMaintenances = asyncHandler(async (req, res) => {
	const maintenances = await Maintenance.find({})
		.populate('asset', 'name serialNumber')
		.populate('user', 'name email');
	res.status(200).json(maintenances);
});

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

	if (status === 'In Progress') {
		await Asset.findByIdAndUpdate(asset, { status: 'Under Maintenance' });
	} else if (status === 'Completed' && existingAsset.status === 'Under Maintenance') {
		
		await Asset.findByIdAndUpdate(asset, { status: 'Available' });
	}

	res.status(201).json(maintenance);
});

const updateMaintenance = asyncHandler(async (req, res) => {
	const { asset, maintenanceDate, type, description, cost, performedBy, status, notes } = req.body;

	let maintenance = await Maintenance.findById(req.params.id);
	if (!maintenance) {
		res.status(404);
		throw new Error('Maintenance record not found');
	}

	const originalStatus = maintenance.status; 

	maintenance = await Maintenance.findByIdAndUpdate(
		req.params.id,
		{ asset, maintenanceDate, type, description, cost, performedBy, status, notes },
		{ new: true, runValidators: true }
	);

	if (status === 'In Progress' && originalStatus !== 'In Progress') {
		await Asset.findByIdAndUpdate(maintenance.asset, { status: 'Under Maintenance' });
	} else if (status === 'Completed' && originalStatus !== 'Completed') {
		
		const currentAsset = await Asset.findById(maintenance.asset);
		if (currentAsset && currentAsset.status === 'Under Maintenance') {
			await Asset.findByIdAndUpdate(maintenance.asset, { status: 'Available' });
		}
	}

	res.status(200).json(maintenance);
});

const deleteMaintenance = asyncHandler(async (req, res) => {
	const maintenance = await Maintenance.findById(req.params.id);
	if (!maintenance) {
		res.status(404);
		throw new Error('Maintenance record not found');
	}


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