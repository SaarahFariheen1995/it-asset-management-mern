//frontend/src/services/assetService.js
import axios from '../axiosConfig'; // Your configured axios instance

const API_URL = '/api/assets/';

// Create new asset
const createAsset = async (assetData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.post(API_URL, assetData, config);
	return response.data;
};

// Get all assets
const getAssets = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL, config);
	return response.data;
};

// Get single asset
const getAssetById = async (assetId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + assetId, config);
	return response.data;
};

// Update asset
const updateAsset = async (assetId, assetData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.put(API_URL + assetId, assetData, config);
	return response.data;
};

// Delete asset
const deleteAsset = async (assetId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.delete(API_URL + assetId, config);
	return response.data;
};

const assetService = {
	createAsset,
	getAssets,
	getAssetById,
	updateAsset,
	deleteAsset,
};

export default assetService;