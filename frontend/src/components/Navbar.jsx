import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './navbar.css';

export default function Navbar() {
    const { user, logout, login } = useContext(AuthContext);

    const navigate = useNavigate();

    async function demoLogin() {
        try {
            await login('demo1@example.com', 'password');
            navigate('/dashboard');
        } catch (e) { console.error(e); }
    }

    return (
        <nav className="ef-nav">
            <div className="ef-nav-left">
                <Link to="/" className="logo">EcoFinds</Link>
                <Link to="/products">Products</Link>
            </div>
            <div className="ef-nav-right">
                <Link to="/cart">Cart</Link>
                {user ? (
                    <>
                        <Link to="/create-listing">Create</Link>
                        <Link to="/wishlist">Wishlist</Link>
                        <Link to="/my-listings">My Listings</Link>
                        <span className="ef-user">{user.username}</span>
                        <button className="ef-logout" onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={demoLogin} style={{ marginRight: 8, background: '#0b3d2e', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: 4 }}>Demo</button>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
