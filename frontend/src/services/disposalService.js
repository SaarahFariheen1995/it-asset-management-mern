//frontend/src/services/disposalService.js
import axios from '../axiosConfig';

const API_URL = '/api/disposals/';

const createDisposal = async (disposalData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.post(API_URL, disposalData, config);
	return response.data;
};

const getDisposals = async (token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL, config);
	return response.data;
};

const getDisposalById = async (disposalId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.get(API_URL + disposalId, config);
	return response.data;
};

const updateDisposal = async (disposalId, disposalData, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.put(API_URL + disposalId, disposalData, config);
	return response.data;
};

const deleteDisposal = async (disposalId, token) => {
	const config = { headers: { Authorization: `Bearer ${token}` } };
	const response = await axios.delete(API_URL + disposalId, config);
	return response.data;
};

const disposalService = {
	createDisposal,
	getDisposals,
	getDisposalById,
	updateDisposal,
	deleteDisposal,
};

export default disposalService;