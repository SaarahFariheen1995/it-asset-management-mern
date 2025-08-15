// frontend/src/pages/AssetsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import assetService from '../services/assetService';
import userService from '../services/userService'; // Assuming you have a userService to get all users
import AssetForm from '../components/AssetForm'; // We'll create this
import AssetList from '../components/AssetList'; // We'll create this
import { useNavigate } from 'react-router-dom';

const AssetsPage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [assets, setAssets] = useState([]);
	const [users, setUsers] = useState([]); // For assigning assets
	const [editingAsset, setEditingAsset] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}
		fetchAssets();
		fetchUsers();
	}, [user, navigate]);

	const fetchAssets = async () => {
		try {
			setLoading(true);
			const data = await assetService.getAssets(user.token);
			setAssets(data);
			setError(null);
		} catch (err) {
			console.error('Failed to fetch assets:', err);
			setError('Failed to load assets. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const fetchUsers = async () => {
		try {
			// You might need to create a userService.js and a backend route for getting all users
			// For now, let's assume a simple endpoint or mock data
			// If your backend doesn't have a /api/users endpoint for all users, you'll need to add one.
			// Example: const allUsers = await userService.getAllUsers(user.token);
			// For simplicity, if you don't have a userService, you can mock it or fetch only assigned users.
			// For now, we'll assume a basic userService exists or you'll implement it.
			// If not, you can skip populating the dropdown for assignedTo or fetch users on demand.
			const allUsers = await userService.getAllUsers(user.token); // This service needs to be created
			setUsers(allUsers);
		} catch (err) {
			console.error('Failed to fetch users:', err);
			// Not critical to stop asset display, but log the error
		}
	};

	const handleAddAsset = () => {
		setEditingAsset(null);
		setShowForm(true);
	};

	const handleEditAsset = (asset) => {
		setEditingAsset(asset);
		setShowForm(true);
	};

	const handleDeleteAsset = async (id) => {
		if (window.confirm('Are you sure you want to delete this asset?')) {
			try {
				await assetService.deleteAsset(id, user.token);
				fetchAssets(); // Refresh list
			} catch (err) {
				console.error('Failed to delete asset:', err);
				setError('Failed to delete asset. It might be linked to other records.');
			}
		}
	};

	const handleFormSubmit = async (assetData) => {
		try {
			if (editingAsset) {
				await assetService.updateAsset(editingAsset._id, assetData, user.token);
			} else {
				await assetService.createAsset(assetData, user.token);
			}
			setShowForm(false);
			setEditingAsset(null);
			fetchAssets(); // Refresh list
		} catch (err) {
			console.error('Failed to save asset:', err);
			setError(`Failed to save asset: ${err.response?.data?.message || err.message}`);
		}
	};

	if (loading) return <p>Loading assets...</p>;
	if (error) return <p className="error-message">{error}</p>;

	return (
		<div className="container">
			<h1>IT Assets Management</h1>
			<button onClick={handleAddAsset} className="btn btn-primary mb-3">
				Add New Asset
			</button>

			{showForm && (
				<AssetForm
					asset={editingAsset}
					users={users} // Pass users to the form for assignment dropdown
					onSubmit={handleFormSubmit}
					onCancel={() => setShowForm(false)}
				/>
			)}

			{!showForm && assets.length === 0 && <p>No assets found. Add one!</p>}
			{!showForm && assets.length > 0 && (
				<AssetList assets={assets} onEdit={handleEditAsset} onDelete={handleDeleteAsset} />
			)}
		</div>
	);
};

export default AssetsPage;