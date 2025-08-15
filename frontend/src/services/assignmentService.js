//frontend/src/services/assignmentService.js
import axios from '../axiosConfig';

const API_URL = '/api/assignments/';

const createAssignment = async (assignmentData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.post(API_URL, assignmentData, config);
	return response.data;
};

const getAssignments = async (token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL, config);
	return response.data;
};

const getAssignmentById = async (assignmentId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL + assignmentId, config);
	return response.data;
};

const updateAssignment = async (assignmentId, assignmentData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.put(API_URL + assignmentId, assignmentData, config);
	return response.data;
};

const deleteAssignment = async (assignmentId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.delete(API_URL + assignmentId, config);
	return response.data;
};

const assignmentService = {
	createAssignment,
	getAssignments,
	getAssignmentById,
	updateAssignment,
	deleteAssignment,
};

export default assignmentService;