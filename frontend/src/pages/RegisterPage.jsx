import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const { push } = useContext(ToastContext);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register(username, email, password);
            push('Account created. Verification email sent.', 'success', 6000);
            navigate('/check-email', { replace: true, state: { email } });
        } catch (err) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Registration failed');
        } finally { setLoading(false); }
    }

    return (
        <div className="auth-shell">
            <div className="auth-panel">
                <h2 className="ef-section-title" style={{ fontSize: '1.8rem' }}>Create account</h2>
                <p className="auth-sub">Join the circular economy. List, discover and reuse products sustainably.</p>
                <form onSubmit={submit} noValidate>
                    <label>Username<input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /></label>
                    <label>Email<input autoComplete="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
                    <label>Password<input autoComplete="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></label>
                    <label>Confirm Password<input autoComplete="new-password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} /></label>
                    {error && <div className="field-error">{error}</div>}
                    <button className="btn btn-accent" disabled={loading} type="submit">{loading ? 'Creating...' : 'Create Account'}</button>
                </form>
                <div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div>
            </div>
        </div>
    );
}
