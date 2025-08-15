import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = async (email, password) => { 
		try {
			const response = await axios.post('/api/users/login', { email, password });
			const userData = response.data;
			localStorage.setItem('user', JSON.stringify(userData));
			setUser(userData);
			return userData;
		} catch (error) {
			console.error('Login failed:', error.response?.data?.message || error.message);
			throw error; 
		}
	};

	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};

	const register = async (name, email, password) => {
		console.log('AuthContext: register function called.');
		try {
			console.log('AuthContext: Making axios POST request to /api/users/register');
			const response = await axios.post('/api/users/register', {name, email, password});
			console.log('AuthContext: Registration successful, response:', response.data);
			const userData = response.data;
			localStorage.setItem('user', JSON.stringify(userData));
			setUser(userData);
			return userData;
		} catch (error) {
			console.error('Registration failed:', error.response?.data?.message || error.message);
			throw error;
		}
	};


	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout  }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);