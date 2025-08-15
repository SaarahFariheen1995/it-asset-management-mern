const asyncHandler = require('express-async-handler');
const Disposal = require('../models/Disposal');
const Asset = require('../models/Asset');

const updateAssetStatus = async (assetId, status) => {
	await Asset.findByIdAndUpdate(assetId, { status }, { new: true });
};

const getDisposals = asyncHandler(async (req, res) => {
	const disposals = await Disposal.find({})
		.populate('asset', 'name serialNumber')
		.populate('user', 'name email'); 
	res.status(200).json(disposals);
});

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

	await updateAssetStatus(asset, 'Disposed');

	res.status(201).json(disposal);
});

const updateDisposal = asyncHandler(async (req, res) => {
	const { asset, disposalDate, method, reason, notes } = req.body;

	let disposal = await Disposal.findById(req.params.id);
	if (!disposal) {
		res.status(404);
		throw new Error('Disposal record not found');
	}


	disposal = await Disposal.findByIdAndUpdate(
		req.params.id,
		{ asset, disposalDate, method, reason, notes },
		{ new: true, runValidators: true }
	);


	await updateAssetStatus(disposal.asset, 'Disposed');


	res.status(200).json(disposal);
});

const deleteDisposal = asyncHandler(async (req, res) => {
	const disposal = await Disposal.findById(req.params.id);
	if (!disposal) {
		res.status(404);
		throw new Error('Disposal record not found');
	}


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