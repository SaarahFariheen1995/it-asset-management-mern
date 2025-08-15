import axios from '../axiosConfig';

const API_URL = '/api/assets/';

const createAsset = async (assetData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.post(API_URL, assetData, config);
	return response.data;
};

const getAssets = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL, config);
	return response.data;
};

const getAssetById = async (assetId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + assetId, config);
	return response.data;
};

const updateAsset = async (assetId, assetData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.put(API_URL + assetId, assetData, config);
	return response.data;
};

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