//frontend/src/services/userService.js
import axios from '../axiosConfig';

const API_URL = '/api/users/'; // Assuming your auth routes are under /api/users

// Get all users (requires admin privileges or specific route)
const getAllUsers = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	// You might need a specific backend route like /api/users/all or /api/users/list
	// For now, let's assume /api/users/all exists and returns all users
	const response = await axios.get(API_URL + 'all', config);
	return response.data;
};

const userService = {
	getAllUsers,
	// ... other user-related services like getUserProfile etc.
};

export default userService;