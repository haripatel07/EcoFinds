import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RequireAuth({ children }) {
    const { user } = useContext(AuthContext);
    const loc = useLocation();
    if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
    return children;
}
