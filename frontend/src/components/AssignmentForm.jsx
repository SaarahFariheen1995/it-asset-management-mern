// frontend/src/components/AssignmentForm.jsx
import React, { useState, useEffect } from 'react';

const AssignmentForm = ({ assignment, assets, users, onSubmit, onCancel }) => {
	const [formData, setFormData] = useState({
		asset: '',
		assignedTo: '',
		assignmentDate: '',
		returnDate: '',
		status: 'Assigned',
		notes: '',
	});

	useEffect(() => {
		if (assignment) {
			setFormData({
				asset: assignment.asset ? assignment.asset._id : '',
				assignedTo: assignment.assignedTo ? assignment.assignedTo._id : '',
				assignmentDate: assignment.assignmentDate ? new Date(assignment.assignmentDate).toISOString().split('T')[0] : '',
				returnDate: assignment.returnDate ? new Date(assignment.returnDate).toISOString().split('T')[0] : '',
				status: assignment.status || 'Assigned',
				notes: assignment.notes || '',
			});
		} else {
			// Reset form for new assignment
			setFormData({
				asset: '', assignedTo: '', assignmentDate: '', returnDate: '',
				status: 'Assigned', notes: '',
			});
		}
	}, [assignment]);

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
			<div className="card-header">{assignment ? 'Edit Assignment Record' : 'Create New Assignment'}</div>
			<div className="card-body">
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="asset" className="form-label">Asset</label>
						<select className="form-select" id="asset" name="asset" value={formData.asset} onChange={handleChange} required>
							<option value="">-- Select Asset --</option>
							{assets && assets.map((a) => (
								<option key={a._id} value={a._id}>
									{a.name} ({a.serialNumber}) - {a.status}
								</option>
							))}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="assignedTo" className="form-label">Assigned To</label>
						<select className="form-select" id="assignedTo" name="assignedTo" value={formData.assignedTo} onChange={handleChange} required>
							<option value="">-- Select User --</option>
							{users && users.map((u) => (
								<option key={u._id} value={u._id}>
									{u.name} ({u.email})
								</option>
							))}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="assignmentDate" className="form-label">Assignment Date</label>
						<input type="date" className="form-control" id="assignmentDate" name="assignmentDate" value={formData.assignmentDate} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="returnDate" className="form-label">Return Date</label>
						<input type="date" className="form-control" id="returnDate" name="returnDate" value={formData.returnDate} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label htmlFor="status" className="form-label">Status</label>
						<select className="form-select" id="status" name="status" value={formData.status} onChange={handleChange} required>
							<option value="Assigned">Assigned</option>
							<option value="Returned">Returned</option>
							<option value="Lost">Lost</option>
							<option value="Damaged">Damaged</option>
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="notes" className="form-label">Notes</label>
						<textarea className="form-control" id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
					</div>
					<button type="submit" className="btn btn-success me-2">Save Assignment</button>
					<button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
				</form>
			</div>
		</div>
	);
};

export default AssignmentForm;