// frontend/src/pages/DisposalsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import disposalService from '../services/disposalService';
import assetService from '../services/assetService'; // To get list of assets for dropdown
import DisposalForm from '../components/DisposalForm';
import DisposalList from '../components/DisposalList';
import { useNavigate } from 'react-router-dom';

const DisposalsPage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [disposals, setDisposals] = useState([]);
	const [assets, setAssets] = useState([]); // For asset selection in form
	const [editingDisposal, setEditingDisposal] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}
		fetchDisposals();
		fetchAssetsForDropdown();
	}, [user, navigate]);

	const fetchDisposals = async () => {
		try {
			setLoading(true);
			const data = await disposalService.getDisposals(user.token);
			setDisposals(data);
			setError(null);
		} catch (err) {
			console.error('Failed to fetch disposal records:', err);
			setError('Failed to load disposal records. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const fetchAssetsForDropdown = async () => {
		try {
			// Fetch all assets, then filter out those already disposed if needed, or allow re-disposal records.
			// For simplicity, we'll fetch all and let the user select.
			const allAssets = await assetService.getAssets(user.token);
			setAssets(allAssets);
		} catch (err) {
			console.error('Failed to fetch assets for disposal dropdown:', err);
			// Not critical to stop page load, but log the error
		}
	};

	const handleAddDisposal = () => {
		setEditingDisposal(null);
		setShowForm(true);
	};

	const handleEditDisposal = (disposal) => {
		setEditingDisposal(disposal);
		setShowForm(true);
	};

	const handleDeleteDisposal = async (id) => {
		if (window.confirm('Are you sure you want to delete this disposal record?')) {
			try {
				await disposalService.deleteDisposal(id, user.token);
				fetchDisposals(); // Refresh list
			} catch (err) {
				console.error('Failed to delete disposal record:', err);
				setError('Failed to delete disposal record. Please try again.');
			}
		}
	};

	const handleFormSubmit = async (disposalData) => {
		try {
			if (editingDisposal) {
				await disposalService.updateDisposal(editingDisposal._id, disposalData, user.token);
			} else {
				await disposalService.createDisposal(disposalData, user.token);
			}
			setShowForm(false);
			setEditingDisposal(null);
			fetchDisposals(); // Refresh list
		} catch (err) {
			console.error('Failed to save disposal record:', err);
			setError(`Failed to save disposal record: ${err.response?.data?.message || err.message}`);
		}
	};

	if (loading) return <p>Loading disposal records...</p>;
	if (error) return <p className="error-message">{error}</p>;

	return (
		<div className="container">
			<h1>Asset Disposal Records</h1>
			<button onClick={handleAddDisposal} className="btn btn-primary mb-3">
				Record New Disposal
			</button>

			{showForm && (
				<DisposalForm
					disposal={editingDisposal}
					assets={assets} // Pass assets to the form
					onSubmit={handleFormSubmit}
					onCancel={() => setShowForm(false)}
				/>
			)}

			{!showForm && disposals.length === 0 && <p>No disposal records found. Add one!</p>}
			{!showForm && disposals.length > 0 && (
				<DisposalList disposals={disposals} onEdit={handleEditDisposal} onDelete={handleDeleteDisposal} />
			)}
		</div>
	);
};

export default DisposalsPage;