import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import assignmentService from '../services/assignmentService';
import assetService from '../services/assetService'; 
import userService from '../services/userService'; 
import AssignmentForm from '../components/AssignmentForm';
import AssignmentList from '../components/AssignmentList';
import { useNavigate } from 'react-router-dom';

const AssignmentsPage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [assignments, setAssignments] = useState([]);
	const [assets, setAssets] = useState([]);
	const [users, setUsers] = useState([]); 
	const [editingAssignment, setEditingAssignment] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAssignments = useCallback(async () => {
		try {
			setLoading(true);
			const data = await assignmentService.getAssignments(user.token);
			setAssignments(data);
			setError(null);
		} catch (err) {
			console.error('Failed to fetch assignment records:', err);
			setError('Failed to load assignment records. Please try again.');
		} finally {
			setLoading(false);
		}
	},[user.token]);

	const fetchAssetsForDropdown = useCallback(async () => {
		try {
			const allAssets = await assetService.getAssets(user.token);
			setAssets(allAssets);
		} catch (err) {
			console.error('Failed to fetch assets for assignment dropdown:', err);
		}
	},[user.token]);

	const fetchUsersForDropdown = useCallback(async () => {
		try {
			const allUsers = await userService.getAllUsers(user.token);
			setUsers(allUsers);
		} catch (err) {
			console.error('Failed to fetch users for assignment dropdown:', err);
		}
	},[user.token]);

	useEffect(() => {
		if (!user) {
			navigate('/login');
			return;
		}
		fetchAssignments();
		fetchAssetsForDropdown();
		fetchUsersForDropdown();
}, [user, navigate, fetchAssignments, fetchAssetsForDropdown, fetchUsersForDropdown]);

	const handleAddAssignment = () => {
		setEditingAssignment(null);
		setShowForm(true);
	};

	const handleEditAssignment = (assignment) => {
		setEditingAssignment(assignment);
		setShowForm(true);
	};

	const handleDeleteAssignment = async (id) => {
		if (window.confirm('Are you sure you want to delete this assignment record?')) {
			try {
				await assignmentService.deleteAssignment(id, user.token);
				fetchAssignments();
			} catch (err) {
				console.error('Failed to delete assignment record:', err);
				setError('Failed to delete assignment record. Please try again.');
			}
		}
	};

	const handleFormSubmit = async (assignmentData) => {
		try {
			if (editingAssignment) {
				await assignmentService.updateAssignment(editingAssignment._id, assignmentData, user.token);
			} else {
				await assignmentService.createAssignment(assignmentData, user.token);
			}
			setShowForm(false);
			setEditingAssignment(null);
			fetchAssignments();
		} catch (err) {
			console.error('Failed to save assignment record:', err);
			setError(`Failed to save assignment record: ${err.response?.data?.message || err.message}`);
		}
	};

	if (loading) return <p>Loading assignment records...</p>;
	if (error) return <p className="error-message">{error}</p>;

	return (
		<div className="container">
			<h1>Asset Assignments</h1>
			<button onClick={handleAddAssignment} className="btn btn-primary mb-3">
				Create New Assignment
			</button>

			{showForm && (
				<AssignmentForm
					assignment={editingAssignment}
					assets={assets}m
					users={users}  
					onSubmit={handleFormSubmit}
					onCancel={() => setShowForm(false)}
				/>
			)}

			{!showForm && assignments.length === 0 && <p>No assignment records found. Create one!</p>}
			{!showForm && assignments.length > 0 && (
				<AssignmentList assignments={assignments} onEdit={handleEditAssignment} onDelete={handleDeleteAssignment} />
			)}
		</div>
	);
};

export default AssignmentsPage;