// frontend/src/components/AssetForm.jsx
import React, { useState, useEffect } from 'react';

const AssetForm = ({ asset, users, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		name: '',
		type: '',
		serialNumber: '',
		purchaseDate: '',
		warrantyEndDate: '',
		status: 'Available',
		location: '',
		assignedTo: '', // User ID
		notes: '',
	});

	useEffect(() => {
		if (asset) {
			setFormData({
				name: asset.name || '',
				type: asset.type || '',
				serialNumber: asset.serialNumber || '',
				purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : '',
				warrantyEndDate: asset.warrantyEndDate ? new Date(asset.warrantyEndDate).toISOString().split('T')[0] : '',
				status: asset.status || 'Available',
				location: asset.location || '',
				assignedTo: asset.assignedTo ? asset.assignedTo._id : '', // Pre-select if assigned
				notes: asset.notes || '',
			});
		} else {
			// Reset form for new asset
			setFormData({
				name: '', type: '', serialNumber: '', purchaseDate: '', warrantyEndDate: '',
				status: 'Available', location: '', assignedTo: '', notes: '',
			});
		}
	}, [asset]);

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
			<div className="card-header">{asset ? 'Edit Asset' : 'Add New Asset'}</div>
			<div className="card-body">
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">Asset Name</label>
						<input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
					</div>
					<div className="mb-3">
						<label htmlFor="type" className="form-label">Type</label>
						<input type="text" className="form-control" id="type" name="type" value={formData.type} onChange={handleChange} required />
					</div>
					<div className="mb-3">
						<label htmlFor="serialNumber" className="form-label">Serial Number</label>
						<input type="text" className="form-control" id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required />
					</div>
					<div className="mb-3">
						<label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
						<input type="date" className="form-control" id="purchaseDate" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="warrantyEndDate" className="form-label">Warranty End Date</label>
						<input type="date" className="form-control" id="warrantyEndDate" name="warrantyEndDate" value={formData.warrantyEndDate} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="status" className="form-label">Status</label>
						<select className="form-select" id="status" name="status" value={formData.status} onChange={handleChange}>
							<option value="Available">Available</option>
							<option value="In Use">In Use</option>
							<option value="Under Maintenance">Under Maintenance</option>
							<option value="Disposed">Disposed</option>
							<option value="Retired">Retired</option>
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="location" className="form-label">Location</label>
						<input type="text" className="form-control" id="location" name="location" value={formData.location} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="assignedTo" className="form-label">Assigned To</label>
						<select className="form-select" id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
							<option value="">-- Select User --</option>
							{users && users.map((u) => (
								<option key={u._id} value={u._id}>
									{u.name} ({u.email})
								</option>
							))}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="notes" className="form-label">Notes</label>
						<textarea className="form-control" id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
					</div>
					<button type="submit" className="btn btn-success me-2">Save Asset</button>
					<button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
				</form>
			</div>
		</div>
	);
};

export default AssetForm;