import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const onLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">IT Asset Manager</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				{/* <div className="collapse navbar-collapse" id="navbarNav"> */}
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{user ? (
							<>
								{/* Links for authenticated users */}
								<li className="nav-item">
									<Link className="nav-link" to="/assets">Assets</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/assignments">Assignments</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/maintenance">Maintenance</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to="/disposals">Disposals</Link>
								</li>
							</>
						) : (
							<>
								{/* No public links needed here usually, or add a Home link if desired */}
							</>
						)}
					</ul>

				{/* </div> */}
				<ul className="navbar-nav ms-auto">
					{user ? (
						<>
							{/* User profile and logout when logged in */}
							<li className="nav-item">
								<Link className="nav-link" to="/profile">Welcome, {user.name}</Link>
							</li>
							<li className="nav-item">
								<button className="btn btn-outline-light" onClick={onLogout}>Logout</button>
							</li>
						</>
					) : (
						<>
							{/* Login and Register links when not logged in */}
							<li className="nav-item">
								<Link className="nav-link" to="/login">Login</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to="/register">Register</Link>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;