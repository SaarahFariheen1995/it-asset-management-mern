//backend/models/Disposal.js
const mongoose = require('mongoose');

const disposalSchema = mongoose.Schema(
	{
		asset: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, 'Please specify the asset being disposed'],
			ref: 'Asset', // References the Asset model
		},
		disposalDate: {
			type: Date,
			default: Date.now,
		},
		method: {
			type: String,
			enum: ['Recycled', 'Donated', 'Sold', 'Destroyed', 'Other'],
			required: [true, 'Please specify the disposal method'],
		},
		reason: {
			type: String,
			required: [true, 'Please provide a reason for disposal'],
			trim: true,
			maxlength: 500,
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		// Who recorded this disposal
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Disposal', disposalSchema);