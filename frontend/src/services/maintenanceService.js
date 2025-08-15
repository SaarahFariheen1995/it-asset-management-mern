import axios from '../axiosConfig';

const API_URL = '/api/maintenance/';

const createMaintenance = async (maintenanceData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.post(API_URL, maintenanceData, config);
	return response.data;
};

const getMaintenances = async (token) => { 
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL, config);
	return response.data;
};

const getMaintenanceById = async (maintenanceId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL + maintenanceId, config);
	return response.data;
};

const updateMaintenance = async (maintenanceId, maintenanceData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.put(API_URL + maintenanceId, maintenanceData, config);
	return response.data;
};

const deleteMaintenance = async (maintenanceId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.delete(API_URL + maintenanceId, config);
	return response.data;
};

const maintenanceService = {
	createMaintenance,
	getMaintenances,
	getMaintenanceById,
	updateMaintenance,
	deleteMaintenance,
};

export default maintenanceService;