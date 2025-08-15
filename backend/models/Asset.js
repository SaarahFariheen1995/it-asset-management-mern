//backend/models/Asset.js
const mongoose = require('mongoose');

const assetSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add an asset name'],
			trim: true,
		},
		type: {
			type: String,
			required: [true, 'Please specify the asset type (e.g., Laptop, Monitor, Server)'],
			trim: true,
		},
		serialNumber: {
			type: String,
			required: [true, 'Please add a serial number'],
			unique: true,
			trim: true,
		},
		purchaseDate: {
			type: Date,
			default: Date.now,
		},
		warrantyEndDate: {
			type: Date,
			required: false, // Not all assets have warranties
		},
		status: {
			type: String,
			enum: ['In Use', 'Available', 'Under Maintenance', 'Disposed', 'Retired'],
			default: 'Available',
		},
		location: {
			type: String,
			trim: true,
			default: 'Storage',
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User', // References the User model
			default: null, // Asset might not be assigned
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		// Who created this asset record
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields
	}
);

module.exports = mongoose.model('Asset', assetSchema);