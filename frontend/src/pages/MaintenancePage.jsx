import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import maintenanceService from '../services/maintenanceService';
import assetService from '../services/assetService';
import MaintenanceForm from '../components/MaintenanceForm';
import MaintenanceList from '../components/MaintenanceList';
import { useNavigate } from 'react-router-dom';

const MaintenancePage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [maintenances, setMaintenances] = useState([]);
	const [assets, setAssets] = useState([]);
	const [editingMaintenance, setEditingMaintenance] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);


	const fetchMaintenances = useCallback(async () => {
		try {
			setLoading(true);
			const data = await maintenanceService.getMaintenances(user.token);
			setMaintenances(data);
			setError(null);
		} catch (err) {
			console.error('Failed to fetch maintenance records:', err);
			setError('Failed to load maintenance records. Please try again.');
		} finally {
			setLoading(false);
		}
	},[user.token]);

	const fetchAssetsForDropdown = useCallback(async () => {
		try {
			const allAssets = await assetService.getAssets(user.token);
			setAssets(allAssets);
		} catch (err) {
			console.error('Failed to fetch assets for maintenance dropdown:', err);
		}
	},[user.token]);

useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}
		fetchMaintenances();
		fetchAssetsForDropdown();
	}, [user, navigate, fetchAssetsForDropdown, fetchMaintenances]);

	const handleAddMaintenance = () => {
		setEditingMaintenance(null);
		setShowForm(true);
	};

	const handleEditMaintenance = (maintenance) => {
		setEditingMaintenance(maintenance);
		setShowForm(true);
	};

	const handleDeleteMaintenance = async (id) => {
		if (window.confirm('Are you sure you want to delete this maintenance record?')) {
			try {
				await maintenanceService.deleteMaintenance(id, user.token);
				fetchMaintenances();
			} catch (err) {
				console.error('Failed to delete maintenance record:', err);
				setError('Failed to delete maintenance record. Please try again.');
			}
		}
	};

	const handleFormSubmit = async (maintenanceData) => {
		try {
			if (editingMaintenance) {
				await maintenanceService.updateMaintenance(editingMaintenance._id, maintenanceData, user.token);
			} else {
				await maintenanceService.createMaintenance(maintenanceData, user.token);
			}
			setShowForm(false);
			setEditingMaintenance(null);
			fetchMaintenances(); 
		} catch (err) {
			console.error('Failed to save maintenance record:', err);
			setError(`Failed to save maintenance record: ${err.response?.data?.message || err.message}`);
		}
	};

	if (loading) return <p>Loading maintenance records...</p>;
	if (error) return <p className="error-message">{error}</p>;

	return (
		<div className="container">
			<h1>Asset Maintenance Tracking</h1>
			<button onClick={handleAddMaintenance} className="btn btn-primary mb-3">
				Add New Maintenance Record
			</button>

			{showForm && (
				<MaintenanceForm
					maintenance={editingMaintenance}
					assets={assets}
					onSubmit={handleFormSubmit}
					onCancel={() => setShowForm(false)}
				/>
			)}

			{!showForm && maintenances.length === 0 && <p>No maintenance records found. Add one!</p>}
			{!showForm && maintenances.length > 0 && (
				<MaintenanceList maintenances={maintenances} onEdit={handleEditMaintenance} onDelete={handleDeleteMaintenance} />
			)}
		</div>
	);
};

export default MaintenancePage;