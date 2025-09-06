import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

// Admin moderation page for product flags
export default function FlagsModeration() {
    const { user } = useContext(AuthContext);
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        api.get('/api/flags')
            .then(res => setFlags(res.data))
            .catch(e => setError(e.response?.data?.error?.message || e.message || 'Failed to load flags'))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null; // wrapped by AdminRoute already

    return (
        <div style={{ maxWidth: 1100, margin: '32px auto 80px' }}>
            <h2 className="ef-section-title" style={{ margin: '0 0 24px' }}>Flagged Listings</h2>
            {loading && <div className="card-surface" style={{ padding: 24, marginBottom: 20 }}>Loading flags...</div>}
            {error && <div className="card-surface" style={{ padding: 24, marginBottom: 20, borderColor: 'var(--danger)', color: 'var(--danger)' }}>{error}</div>}
            {!loading && flags.length === 0 && !error && (
                <div className="card-surface" style={{ padding: 24 }}>No active flags.</div>
            )}
            {!loading && flags.length > 0 && (
                <div className="card-surface" style={{ padding: 0, overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.75rem' }}>
                        <thead style={{ background: '#132025', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '10px 12px' }}>Product</th>
                                <th style={{ padding: '10px 12px' }}>Reason</th>
                                <th style={{ padding: '10px 12px' }}>Reporter</th>
                                <th style={{ padding: '10px 12px' }}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flags.map(f => (
                                <tr key={f._id} style={{ borderTop: '1px solid #1e2b31' }}>
                                    <td style={{ padding: '10px 12px' }}>{f.product?.title || f.product}</td>
                                    <td style={{ padding: '10px 12px', maxWidth: 320 }}>{f.reason}</td>
                                    <td style={{ padding: '10px 12px' }}>{f.reporter?.email || f.reporter}</td>
                                    <td style={{ padding: '10px 12px' }}>{new Date(f.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
