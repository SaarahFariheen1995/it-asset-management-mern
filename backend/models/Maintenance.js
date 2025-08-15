const mongoose = require('mongoose');

const maintenanceSchema = mongoose.Schema(
	{
		asset: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, 'Please specify the asset for maintenance'],
			ref: 'Asset', 
		},
		maintenanceDate: {
			type: Date,
			default: Date.now,
		},
		type: {
			type: String,
			enum: ['Preventive', 'Repair', 'Upgrade', 'Inspection', 'Other'],
			required: [true, 'Please specify the type of maintenance'],
		},
		description: {
			type: String,
			required: [true, 'Please provide a description of the maintenance'],
			trim: true,
			maxlength: 1000,
		},
		cost: {
			type: Number,
			default: 0,
		},
		performedBy: {
			type: String,
			trim: true,
			default: 'Internal IT',
		},
		status: {
			type: String,
			enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
			default: 'Scheduled',
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 500,
		},
		
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

module.exports = mongoose.model('Maintenance', maintenanceSchema);