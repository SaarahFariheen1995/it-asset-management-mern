import React, { useState, useEffect } from 'react';

const DisposalForm = ({ disposal, assets, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		asset: '',
		disposalDate: '',
		method: 'Recycled',
		reason: '',
		notes: '',
	});

	useEffect(() => {
		if (disposal) {
			setFormData({
				asset: disposal.asset ? disposal.asset._id : '',
				disposalDate: disposal.disposalDate ? new Date(disposal.disposalDate).toISOString().split('T')[0] : '',
				method: disposal.method || 'Recycled',
				reason: disposal.reason || '',
				notes: disposal.notes || '',
			});
		} else {
			setFormData({
				asset: '', disposalDate: '', method: 'Recycled', reason: '', notes: '',
			});
		}
	}, [disposal]);

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
			<div className="card-header">{disposal ? 'Edit Disposal Record' : 'Add New Disposal Record'}</div>
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
						<label htmlFor="disposalDate" className="form-label">Disposal Date</label>
						<input type="date" className="form-control" id="disposalDate" name="disposalDate" value={formData.disposalDate} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="method" className="form-label">Method</label>
						<select className="form-select" id="method" name="method" value={formData.method} onChange={handleChange} required>
							<option value="Recycled">Recycled</option>
							<option value="Donated">Donated</option>
							<option value="Sold">Sold</option>
							<option value="Destroyed">Destroyed</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="reason" className="form-label">Reason</label>
						<textarea className="form-control" id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" required></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="notes" className="form-label">Notes</label>
						<textarea className="form-control" id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
					</div>
					<button type="submit" className="btn btn-success me-2">Save Disposal</button>
					<button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
				</form>
			</div>
		</div>
	);
};

export default DisposalForm;