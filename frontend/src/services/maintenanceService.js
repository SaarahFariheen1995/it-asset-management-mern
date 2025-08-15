//frontend/src/services/maintenanceService.js
import axios from '../axiosConfig';

const API_URL = '/api/maintenance/';

// Function to create a new maintenance record
const createMaintenance = async (maintenanceData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.post(API_URL, maintenanceData, config);
	return response.data;
};

// Function to get all maintenance records
const getMaintenances = async (token) => { // <-- This function must be defined correctly
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL, config);
	return response.data;
};

// Function to get a single maintenance record by ID
const getMaintenanceById = async (maintenanceId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL + maintenanceId, config);
	return response.data;
};

// Function to update a maintenance record
const updateMaintenance = async (maintenanceId, maintenanceData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.put(API_URL + maintenanceId, maintenanceData, config);
	return response.data;
};

// Function to delete a maintenance record
const deleteMaintenance = async (maintenanceId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.delete(API_URL + maintenanceId, config);
	return response.data;
};

// Export all functions as part of a single object
const maintenanceService = {
	createMaintenance,
	getMaintenances, // <-- CRITICAL: This function must be included in the export object
	getMaintenanceById,
	updateMaintenance,
	deleteMaintenance,
};

export default maintenanceService;