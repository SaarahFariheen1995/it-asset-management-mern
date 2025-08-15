import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';

import AssetsPage from './pages/AssetsPage';
import DisposalsPage from './pages/DisposalsPage';
import MaintenancePage from './pages/MaintenancePage';
import AssignmentsPage from './pages/AssignmentsPage';

function App() {
	return (
		<Router>
			<AuthProvider>
				<Navbar />
				<div className="container mt-4">
					<Routes>
						{/* Public Routes - accessible without login */}
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} /> {/* <-- THIS IS THE KEY ROUTE */}

						{/* Protected Routes - require login */}
						<Route path="/" element={<PrivateRoute />}>
							<Route index element={<AssetsPage />} /> {/* Default landing page after login, using 'index' */}
							<Route path="/profile" element={<ProfilePage />} />

							{/* New IT Asset Management Routes */}
							<Route path="/assets" element={<AssetsPage />} />
							<Route path="/disposals" element={<DisposalsPage />} />
							<Route path="/maintenance" element={<MaintenancePage />} />
							<Route path="/assignments" element={<AssignmentsPage />} />
						</Route>
					</Routes>
				</div>
			</AuthProvider>
		</Router>
	);
}

export default App;