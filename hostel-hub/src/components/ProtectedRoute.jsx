import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requiredRole === 'admin') {
        const adminEmail = localStorage.getItem('adminEmail');
        if (!adminEmail) {
            return <Navigate to="/" state={{ from: location }} replace />;
        }
    }

    if (requiredRole === 'student') {
        const studentData = localStorage.getItem('studentData');
        if (!studentData) {
            return <Navigate to="/" state={{ from: location }} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
