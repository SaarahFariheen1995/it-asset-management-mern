import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
	});
	const [message, setMessage] = useState('');
	const { name, email, password, password2 } = formData;


	const { user, register, logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		if (password !== password2) {
			setMessage('Passwords do not match');
			return;
		}

		try {
			await register(name, email, password);
			logout();
			setMessage('Registration successful! Redirecting to login...');
			setTimeout(() => {
				navigate('/login');
			}, 1500);
		} catch (error) {
			console.error('RegisterForm: Error caught from register function:', error);
			setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-5">
					<div className="card shadow-sm">
						<div className="card-body p-4">
							<h2 className="card-title text-center mb-4">Register</h2>
							{message && (
								<div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
									{message}
								</div>
							)}
							<form onSubmit={onSubmit}>
								<div className="mb-3">
									<label htmlFor="name" className="form-label">Name</label>
									<input
										type="text"
										className="form-control"
										id="name"
										name="name"
										value={name}
										onChange={onChange}
										placeholder="Enter your name"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="email" className="form-label">Email address</label>
									<input
										type="email"
										className="form-control"
										id="email"
										name="email"
										value={email}
										onChange={onChange}
										placeholder="Enter your email"
										required
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="password" className="form-label">Password</label>
									<input
										type="password"
										className="form-control"
										id="password"
										name="password"
										value={password}
										onChange={onChange}
										placeholder="Enter password"
										required
									/>
								</div>
								<div className="mb-4">
									<label htmlFor="password2" className="form-label">Confirm Password</label>
									<input
										type="password"
										className="form-control"
										id="password2"
										name="password2"
										value={password2}
										onChange={onChange}
										placeholder="Confirm password"
										required
									/>
								</div>
								<div className="d-grid">
									<button type="submit" className="btn btn-primary btn-lg">
										Register
									</button>
								</div>
							</form>
							<p className="text-center mt-3">
								Already have an account? <a href="/login">Login here</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;