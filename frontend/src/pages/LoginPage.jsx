import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);
    const { login } = useContext(AuthContext);
    const { push } = useContext(ToastContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (cooldown > 0) return;
        try {
            const res = await login(email, password);
            push(`Hi ${res.user.username}! Welcome back.`, 'success');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Login failed';
            if (msg.toLowerCase().includes('verify')) {
                setError('Please verify your email. Check your inbox for the link.');
            } else setError(msg);
            setAttempts(a => {
                const na = a + 1;
                if (na >= 5) {
                    setCooldown(30);
                }
                return na;
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (cooldown <= 0) return;
        cooldownRef.current = setInterval(() => {
            setCooldown(c => {
                if (c <= 1) { clearInterval(cooldownRef.current); return 0; }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(cooldownRef.current);
    }, [cooldown]);

    async function resend() {
        try {
            await fetch(import.meta.env.VITE_API_URL + '/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            push('Verification email resent', 'success');
        } catch {
            push('Failed to resend email', 'error');
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-panel">
                <h2 className="ef-section-title" style={{ fontSize: '1.8rem' }}>Welcome back</h2>
                <p className="auth-sub">Access your account to trade and discover sustainable items.</p>
                <form onSubmit={submit} noValidate>
                    <label>Email<input autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
                    <label>Password<input autoComplete="current-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
                    {error && <div className="field-error">{error}</div>}
                    <button className="btn btn-accent" disabled={loading || cooldown > 0} type="submit">{cooldown > 0 ? `Wait ${cooldown}s` : (loading ? 'Signing in...' : 'Sign In')}</button>
                    {error && error.toLowerCase().includes('verify') && email && (
                        <button type="button" style={{ marginTop: 12 }} className="btn btn-outline" onClick={resend}>Resend verification email</button>
                    )}
                </form>
                {attempts > 0 && !error?.toLowerCase().includes('verify') && (
                    <div style={{ marginTop: 12, fontSize: '.6rem', color: 'var(--text-dim)' }}>Attempts: {attempts}{cooldown > 0 && ` • Locked for ${cooldown}s`}</div>
                )}
                <div className="auth-switch">No account? <Link to="/register">Create one</Link></div>
            </div>
        </div>
    );
}
