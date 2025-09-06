import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { user } = useContext(AuthContext);
    if (!user) return <div className="card-surface" style={{ padding: 24, margin: '32px auto', maxWidth: 720 }}>Login required.</div>;
    if (user.role !== 'admin') return <div className="card-surface" style={{ padding: 24, margin: '32px auto', maxWidth: 720 }}>Access denied (admin only).</div>;
    return children;
}
