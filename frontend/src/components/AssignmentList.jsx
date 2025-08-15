import React from 'react';

const AssignmentList = ({ assignments, onEdit, onDelete }) => {
	return (
		<div className="table-responsive">
			<table className="table table-striped table-hover">
				<thead>
				<tr>
					<th>Asset Name</th>
					<th>Serial No.</th>
					<th>Assigned To</th>
					<th>Assignment Date</th>
					<th>Return Date</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{assignments.map((assignment) => (
					<tr key={assignment._id}>
						<td>{assignment.asset ? assignment.asset.name : 'N/A'}</td>
						<td>{assignment.asset ? assignment.asset.serialNumber : 'N/A'}</td>
						<td>{assignment.assignedTo ? assignment.assignedTo.name : 'N/A'}</td>
						<td>{new Date(assignment.assignmentDate).toLocaleDateString('en-GB')}</td>
						<td>{assignment.returnDate ? new Date(assignment.returnDate).toLocaleDateString('en-GB') : 'N/A'}</td>
						<td>{assignment.status}</td>
						<td>
							<button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(assignment)}>
								Edit
							</button>
							<button className="btn btn-sm btn-danger" onClick={() => onDelete(assignment._id)}>
								Delete
							</button>
						</td>
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};

export default AssignmentList;