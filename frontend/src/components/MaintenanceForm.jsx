import React, { useState, useEffect } from 'react';

const MaintenanceForm = ({ maintenance, assets, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		asset: '',
		maintenanceDate: '',
		type: 'Repair',
		description: '',
		cost: 0,
		performedBy: 'Internal IT',
		status: 'Scheduled',
		notes: '',
	});

	useEffect(() => {
		if (maintenance) {
			setFormData({
				asset: maintenance.asset ? maintenance.asset._id : '',
				maintenanceDate: maintenance.maintenanceDate ? new Date(maintenance.maintenanceDate).toISOString().split('T')[0] : '',
				type: maintenance.type || 'Repair',
				description: maintenance.description || '',
				cost: maintenance.cost || 0,
				performedBy: maintenance.performedBy || 'Internal IT',
				status: maintenance.status || 'Scheduled',
				notes: maintenance.notes || '',
			});
		} else {
			
			setFormData({
				asset: '', maintenanceDate: '', type: 'Repair', description: '', cost: 0,
				performedBy: 'Internal IT', status: 'Scheduled', notes: '',
			});
		}
	}, [maintenance]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<div className="card mb-4">
			<div className="card-header">{maintenance ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}</div>
			<div className="card-body">
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="asset" className="form-label">Asset</label>
						<select className="form-select" id="asset" name="asset" value={formData.asset} onChange={handleChange} required>
							<option value="">-- Select Asset --</option>
							{assets && assets.map((a) => (
								<option key={a._id} value={a._id}>
									{a.name} ({a.serialNumber})
								</option>
							))}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="maintenanceDate" className="form-label">Maintenance Date</label>
						<input type="date" className="form-control" id="maintenanceDate" name="maintenanceDate" value={formData.maintenanceDate} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="type" className="form-label">Type</label>
						<select className="form-select" id="type" name="type" value={formData.type} onChange={handleChange} required>
							<option value="Preventive">Preventive</option>
							<option value="Repair">Repair</option>
							<option value="Upgrade">Upgrade</option>
							<option value="Inspection">Inspection</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label">Description</label>
						<textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="cost" className="form-label">Cost (AUD)</label>
						<input type="number" className="form-control" id="cost" name="cost" value={formData.cost} onChange={handleChange} min="0" step="0.01" />
					</div>
					<div className="mb-3">
						<label htmlFor="performedBy" className="form-label">Performed By</label>
						<input type="text" className="form-control" id="performedBy" name="performedBy" value={formData.performedBy} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="status" className="form-label">Status</label>
						<select className="form-select" id="status" name="status" value={formData.status} onChange={handleChange} required>
							<option value="Scheduled">Scheduled</option>
							<option value="In Progress">In Progress</option>
							<option value="Completed">Completed</option>
							<option value="Cancelled">Cancelled</option>
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="notes" className="form-label">Notes</label>
						<textarea className="form-control" id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
					</div>
					<button type="submit" className="btn btn-success me-2">Save Maintenance</button>
					<button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
				</form>
			</div>
		</div>
	);
};

export default MaintenanceForm;