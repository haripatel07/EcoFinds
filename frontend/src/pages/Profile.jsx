import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ToastContext } from '../context/ToastContext';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const { push } = useContext(ToastContext);
    const [profile, setProfile] = useState(user || null);
    const [form, setForm] = useState({ username: '', avatarUrl: '', phone: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        if (!user) return;
        api.get('/api/users/me').then(r => { if (mounted) { setProfile(r.data); setForm({ username: r.data.username || '', avatarUrl: r.data.avatarUrl || '', phone: r.data.phone || '' }); } }).catch(() => { });
        return () => mounted = false;
    }, [user]);

    if (!user) return <div className="card-surface" style={{ padding: 28, maxWidth: 720, margin: '32px auto' }}>Please login to view profile.</div>;

    return (
        <div style={{ maxWidth: 960, margin: '32px auto 80px' }}>
            <h2 className="ef-section-title" style={{ margin: '0 0 24px', letterSpacing: '.5px' }}>Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, flexWrap: 'wrap' }}>
                <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label>Username<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
                    <label>Avatar URL<input value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} /></label>
                    <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
                    <div style={{ marginTop: 4 }}>
                        <button className="btn btn-accent" disabled={saving} onClick={async () => {
                            try { setSaving(true); const res = await api.put('/api/users/me', form); setProfile(res.data); push('Profile updated', 'success'); }
                            catch (e) { push(e.response?.data?.error?.message || 'Update failed', 'error'); }
                            finally { setSaving(false); }
                        }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </div>
                <div className="card-surface" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
                    {form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--accent)', boxShadow: '0 0 0 6px rgba(45,223,145,.15)' }} /> : <div className="skeleton" style={{ width: 180, height: 180, borderRadius: '50%' }} />}
                    <div style={{ fontSize: '.75rem', color: 'var(--text-dim)' }}>PNG/JPG URL • Square recommended</div>
                </div>
            </div>
            <div className="card-surface" style={{ marginTop: 36, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
                <div>
                    <div className="muted" style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.7px' }}>Email</div>
                    <div style={{ fontSize: '.85rem' }}>{profile?.email}</div>
                </div>
                <div>
                    <div className="muted" style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.7px' }}>Role</div>
                    <div style={{ fontSize: '.85rem' }}>{profile?.role}</div>
                </div>
                <div>
                    <div className="muted" style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.7px' }}>Email Verified</div>
                    <div style={{ fontSize: '.85rem' }}>{profile?.isEmailVerified ? 'Yes' : 'No'}</div>
                </div>
            </div>
        </div>
    );
}
