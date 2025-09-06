import React, { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext';

export default function MyListings() {
    const { user } = useContext(AuthContext);
    const { push } = useContext(ToastContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    useEffect(() => {
        if (!user) return;
        let mounted = true;
        api.get('/api/products').then(r => {
            if (!mounted) return;
            const data = r.data.items || r.data.products || r.data;
            setItems(Array.isArray(data) ? data.filter(p => (p.seller === user.id) || (p.seller?._id === user.id)) : []);
        }).finally(() => setLoading(false));
        return () => mounted = false;
    }, [user]);

    async function del(id) {
        if (!confirm('Delete listing?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            setItems(items.filter(i => i._id !== id));
            push('Deleted', 'success');
        } catch (e) { push(e.response?.data?.error?.message || 'Delete failed', 'error'); }
    }

    if (!user) return <div className="card-surface" style={{ padding: 28, maxWidth: 760, margin: '32px auto' }}>Login required.</div>;
    if (loading) return <div className="card-surface" style={{ padding: 28, maxWidth: 760, margin: '32px auto' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: 1200, margin: '30px auto 80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="ef-section-title" style={{ margin: 0 }}>My Listings</h2>
                <button className="btn btn-accent" onClick={() => nav('/create-listing')}>+ New</button>
            </div>
            {items.length === 0 ? <div className="card-surface" style={{ padding: 28 }}>No listings yet.</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 22 }}>
                    {items.map(p => (
                        <div key={p._id} className="card-surface" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ height: 160, background: '#101416', borderRadius: 10, overflow: 'hidden' }}>{p.images?.[0] ? <img src={p.images[0].url || p.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="skeleton" style={{ height: '100%' }} />}</div>
                            <strong style={{ fontSize: '.9rem' }}>{p.title}</strong>
                            <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '.8rem' }}>${p.price}</span>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Link style={{ fontSize: '.7rem', color: 'var(--accent)' }} to={`/products/${p._id}`}>View</Link>
                                <button className="btn btn-outline" style={{ fontSize: '.7rem', padding: '6px 10px' }} onClick={() => nav(`/edit-listing/${p._id}`)}>Edit</button>
                                <button className="btn btn-danger" style={{ fontSize: '.7rem', padding: '6px 10px' }} onClick={() => del(p._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
