//backend/models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema(
	{
		asset: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, 'Please specify the asset being assigned'],
			ref: 'Asset', // References the Asset model
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, 'Please specify the user to whom the asset is assigned'],
			ref: 'User', // References the User model
		},
		assignmentDate: {
			type: Date,
			default: Date.now,
		},
		returnDate: {
			type: Date,
			default: null, // Null if not yet returned
		},
		status: {
			type: String,
			enum: ['Assigned', 'Returned', 'Lost', 'Damaged'],
			default: 'Assigned',
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		// Who recorded this assignment
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

module.exports = mongoose.model('Assignment', assignmentSchema);