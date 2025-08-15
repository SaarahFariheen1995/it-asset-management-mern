import axios from '../axiosConfig';

const API_URL = '/api/users/'; 

const getAllUsers = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + 'all', config);
	return response.data;
};

const userService = {
	getAllUsers,
};

export default userService;