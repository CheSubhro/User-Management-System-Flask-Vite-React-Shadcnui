import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

// Protected Route Logic:
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
	return (
		<>
			<Router>
				<Toaster richColors position="top-right" />
				<Routes>
					{/* Public Routes */}
					<Route path="/login" element={<LoginPage />} />
                	<Route path="/signup" element={<SignupPage />} />

					{/* Protected Routes */}
					<Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                	} />

					<Route path="/" element={<Navigate to="/login" />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
        	</Router>
		</>
	)
}

export default App
