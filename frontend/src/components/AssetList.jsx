import React from 'react';

const AssetList = ({ assets, onEdit, onDelete }) => {
	return (
		<div className="table-responsive">
			<table className="table table-striped table-hover">
				<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Serial No.</th>
					<th>Status</th>
					<th>Assigned To</th>
					<th>Location</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{assets.map((asset) => (
					<tr key={asset._id}>
						<td>{asset.name}</td>
						<td>{asset.type}</td>
						<td>{asset.serialNumber}</td>
						<td>{asset.status}</td>
						<td>{asset.assignedTo ? asset.assignedTo.name : 'N/A'}</td>
						<td>{asset.location}</td>
						<td>
							<button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(asset)}>
								Edit
							</button>
							<button className="btn btn-sm btn-danger" onClick={() => onDelete(asset._id)}>
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

export default AssetList;