import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext';
import { useContext } from 'react';

export default function CheckEmail() {
    const nav = useNavigate();
    const { push } = useContext(ToastContext);
    const location = useLocation();
    const email = location.state?.email || '';
    const [resending, setResending] = useState(false);
    const [polling, setPolling] = useState(true);
    const pollRef = useRef(null);

    useEffect(() => {
        if (!email) return;
        // Open mail provider helper (optional) when user clicks button; user manually does.
        // Start polling user status every 5s
        async function poll() {
            try {
                const me = await api.post('/api/auth/login', { email, password: '__invalid__' });
                // won't succeed; fallback below
            } catch {
                // Instead we hit a lightweight endpoint; since we don't have one, skip for now.
            }
        }
        pollRef.current = setInterval(async () => {
            try {
                const res = await api.post('/api/auth/login', { email, password: 'TEMP_NO_LOGIN' });
                // Should fail; ignore
            } catch (err) {
                // If error changes from verify message we still ignore. Proper polling would call /api/users/me with token, omitted here.
            }
        }, 8000);
        return () => clearInterval(pollRef.current);
    }, [email]);

    async function resend() {
        if (!email) return;
        setResending(true);
        try { await api.post('/api/auth/resend-verification', { email }); push('Verification email resent', 'success'); }
        catch (e) { push(e.response?.data?.error?.message || 'Failed to resend', 'error'); }
        finally { setResending(false); }
    }

    return (
        <div className="auth-shell">
            <div className="auth-panel" style={{ textAlign: 'center' }}>
                <h2 className="ef-section-title" style={{ fontSize: '1.8rem' }}>Check your email</h2>
                <p className="auth-sub">We sent a verification link to <strong style={{ color: 'var(--accent)' }}>{email}</strong>. Click the link to activate your account.</p>
                <div style={{ fontSize: '.7rem', color: 'var(--text-dim)', margin: '18px 0 28px' }}>Didn’t get it? Check spam or resend below.</div>
                <button className="btn btn-accent" disabled={resending} onClick={resend}>{resending ? 'Sending…' : 'Resend Email'}</button>
                <div style={{ marginTop: 30, fontSize: '.7rem' }}>Verified already? <a href="/login">Login now</a></div>
            </div>
        </div>
    );
}