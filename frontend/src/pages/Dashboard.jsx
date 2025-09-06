import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    return (
        <div style={{ maxWidth: 1200, margin: '30px auto 80px' }}>
            <h2 className="ef-section-title" style={{ marginBottom: 34 }}>Dashboard</h2>
            {user && <div style={{ margin: '0 0 28px', fontSize: '1.05rem', color: 'var(--text-dim)' }}>Hello <span style={{ color: 'var(--accent)' }}>{user.username}</span>, manage your marketplace activity.</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
                <Link to="/profile" className="card-surface" style={{ textDecoration: 'none', color: 'var(--text)', padding: 28 }}>
                    <h3 style={{ margin: '0 0 8px' }}>Profile</h3>
                    <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-dim)' }}>View & update your details</p>
                </Link>
                <Link to="/orders" className="card-surface" style={{ textDecoration: 'none', color: 'var(--text)', padding: 28 }}>
                    <h3 style={{ margin: '0 0 8px' }}>Orders</h3>
                    <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-dim)' }}>Purchase history</p>
                </Link>
                <Link to="/my-listings" className="card-surface" style={{ textDecoration: 'none', color: 'var(--text)', padding: 28 }}>
                    <h3 style={{ margin: '0 0 8px' }}>My Listings</h3>
                    <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-dim)' }}>Manage items you sell</p>
                </Link>
                <Link to="/cart" className="card-surface" style={{ textDecoration: 'none', color: 'var(--text)', padding: 28 }}>
                    <h3 style={{ margin: '0 0 8px' }}>Cart</h3>
                    <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--text-dim)' }}>Checkout items</p>
                </Link>
            </div>
        </div>
    );
}
