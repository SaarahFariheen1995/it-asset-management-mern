import React from 'react';

const DisposalList = ({ disposals, onEdit, onDelete }) => {
	return (
		<div className="table-responsive">
			<table className="table table-striped table-hover">
				<thead>
				<tr>
					<th>Asset Name</th>
					<th>Serial No.</th>
					<th>Disposal Date</th>
					<th>Method</th>
					<th>Reason</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{disposals.map((disposal) => (
					<tr key={disposal._id}>
						<td>{disposal.asset ? disposal.asset.name : 'N/A'}</td>
						<td>{disposal.asset ? disposal.asset.serialNumber : 'N/A'}</td>
						<td>{new Date(disposal.disposalDate).toLocaleDateString('en-GB')}</td>
						<td>{disposal.method}</td>
						<td>{disposal.reason}</td>
						<td>
							<button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(disposal)}>
								Edit
							</button>
							<button className="btn btn-sm btn-danger" onClick={() => onDelete(disposal._id)}>
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

export default DisposalList;