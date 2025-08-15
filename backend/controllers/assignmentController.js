//backend/controllers/assignmentController.js
const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset'); // To update asset status
const User = require('../models/User'); // To validate assignedTo user

// @desc    Get all assignment records
// @route   GET /api/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
	const assignments = await Assignment.find({})
		.populate('asset', 'name serialNumber')
		.populate('assignedTo', 'name email')
		.populate('user', 'name email');
	res.status(200).json(assignments);
});

// @desc    Get a single assignment record by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = asyncHandler(async (req, res) => {
	const assignment = await Assignment.findById(req.params.id)
		.populate('asset', 'name serialNumber')
		.populate('assignedTo', 'name email')
		.populate('user', 'name email');
	if (!assignment) {
		res.status(404);
		throw new Error('Assignment record not found');
	}
	res.status(200).json(assignment);
});

// @desc    Create a new assignment record
// @route   POST /api/assignments
// @access  Private
const createAssignment = asyncHandler(async (req, res) => {
	const { asset, assignedTo, assignmentDate, returnDate, status, notes } = req.body;

	if (!asset || !assignedTo) {
		res.status(400);
		throw new Error('Please fill in all required fields: asset, assignedTo');
	}

	const existingAsset = await Asset.findById(asset);
	if (!existingAsset) {
		res.status(404);
		throw new Error('Asset not found');
	}

	const existingUser = await User.findById(assignedTo);
	if (!existingUser) {
		res.status(404);
		throw new Error('User to assign to not found');
	}

	// Check if the asset is already assigned and not returned
	const activeAssignment = await Assignment.findOne({asset, status: 'Assigned'});
	if (activeAssignment) {
		res.status(400);
		throw new Error('Asset is already assigned to ${activeAssignment.assignedTo.name}');
	}

	const assignment = await Assignment.create({
		asset,
		assignedTo,
		assignmentDate,
		returnDate,
		status,
		notes,
		user: req.user.id,
	});

	// Update asset status and assignedTo field in the Asset model
	await Asset.findByIdAndUpdate(asset, { status: 'In Use', assignedTo: assignedTo });

	res.status(201).json(assignment);
});

// @desc    Update an assignment record
// @route   PUT /api/assignments/:id
// @access  Private
const updateAssignment = asyncHandler(async (req, res) => {
	const { asset, assignedTo, assignmentDate, returnDate, status, notes } = req.body;

	let assignment = await Assignment.findById(req.params.id);
	if (!assignment) {
		res.status(404);
		throw new Error('Assignment record not found');
	}

	const originalStatus = assignment.status;
	const originalAssetId = assignment.asset;

	// Validate asset and user if they are being updated
	if (asset && asset.toString() !== originalAssetId.toString()) {
		const newAsset = await Asset.findById(asset);
		if (!newAsset) {
			res.status(404);
			throw new Error('New asset not found');
		}
		// Check if the new asset is already assigned
		const activeAssignmentForNewAsset = await Assignment.findOne({ asset, status: 'Assigned' });
		if (activeAssignmentForNewAsset && activeAssignmentForNewAsset._id.toString() !== assignment._id.toString()) {
			res.status(400);
			throw new Error('New asset is already assigned to ${activeAssignmentForNewAsset.assignedTo.name}');
		}
	}
	if (assignedTo) {
		const newUser = await User.findById(assignedTo);
		if (!newUser) {
			res.status(404);
			throw new Error('New user to assign to not found');
		}
	}

	assignment = await Assignment.findByIdAndUpdate(
		req.params.id,
		{ asset, assignedTo, assignmentDate, returnDate, status, notes },
		{ new: true, runValidators: true }
	);

	// Update asset status based on assignment status change
	if (status === 'Assigned' && originalStatus !== 'Assigned') {
		await Asset.findByIdAndUpdate(assignment.asset, { status: 'In Use', assignedTo: assignment.assignedTo });
	} else if (status === 'Returned' && originalStatus !== 'Returned') {
		// When an asset is returned, update its status to 'Available' and clear assignedTo
		await Asset.findByIdAndUpdate(assignment.asset, { status: 'Available', assignedTo: null });
	}

	// If the asset itself was changed in the assignment, update statuses for both old and new assets
	if (asset && asset.toString() !== originalAssetId.toString()) {
		// Revert old asset status
		await Asset.findByIdAndUpdate(originalAssetId, { status: 'Available', assignedTo: null });
		// Update new asset status
		if (assignment.status === 'Assigned') {
			await Asset.findByIdAndUpdate(assignment.asset, { status: 'In Use', assignedTo: assignment.assignedTo });
		}
	}

	res.status(200).json(assignment);
});

// @desc    Delete an assignment record
// @route   DELETE /api/assignments/:id
// @access  Private
const deleteAssignment = asyncHandler(async (req, res) => {
	const assignment = await Assignment.findById(req.params.id);
	if (!assignment) {
		res.status(404);
		throw new Error('Assignment record not found');
	}

	// When an assignment is deleted, if it was active, revert the asset status
	if (assignment.status === 'Assigned') {
		await Asset.findByIdAndUpdate(assignment.asset, { status: 'Available', assignedTo: null });
	}

	await Assignment.deleteOne({ _id: req.params.id });
	res.status(200).json({ message: 'Assignment record removed successfully', id: req.params.id });
});

module.exports = {
	getAssignments,
	getAssignmentById,
	createAssignment,
	updateAssignment,
	deleteAssignment,
};