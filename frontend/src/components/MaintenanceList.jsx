// frontend/src/components/MaintenanceList.jsx
import React from 'react';

const MaintenanceList = ({ maintenances, onEdit, onDelete }) => {
	return (
		<div className="table-responsive">
			<table className="table table-striped table-hover">
				<thead>
				<tr>
					<th>Asset Name</th>
					<th>Serial No.</th>
					<th>Date</th>
					<th>Type</th>
					<th>Description</th>
					<th>Status</th>
					<th>Cost</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{maintenances.map((maintenance) => (
					<tr key={maintenance._id}>
						<td>{maintenance.asset ? maintenance.asset.name : 'N/A'}</td>
						<td>{maintenance.asset ? maintenance.asset.serialNumber : 'N/A'}</td>
						<td>{new Date(maintenance.maintenanceDate).toLocaleDateString('en-GB')}</td>
						<td>{maintenance.type}</td>
						<td>{maintenance.description}</td>
						<td>{maintenance.status}</td>
						<td>AUD {maintenance.cost.toFixed(2)}</td>
						<td>
							<button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(maintenance)}>
								Edit
							</button>
							<button className="btn btn-sm btn-danger" onClick={() => onDelete(maintenance._id)}>
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

export default MaintenanceList;