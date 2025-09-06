import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        api.get('/api/orders').then(r => setOrders(r.data)).catch(() => { }).finally(() => setLoading(false));
    }, [user]);

    if (!user) return <div className="card-surface" style={{ padding: 28, maxWidth: 760, margin: '32px auto' }}>Please login to view orders.</div>;

    return (
        <div style={{ maxWidth: 1100, margin: '30px auto 80px' }}>
            <h2 className="ef-section-title" style={{ margin: '0 0 24px' }}>Orders</h2>
            {loading && <div className="card-surface" style={{ padding: 24, marginBottom: 24 }}>Loading...</div>}
            {!loading && orders.length === 0 && <div className="card-surface" style={{ padding: 24 }}>No orders yet.</div>}
            <div style={{ display: 'grid', gap: 18 }}>
                {orders.map(o => (
                    <div key={o._id} className="card-surface" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text-dim)' }}>
                            <span>Order ID</span><span>{o._id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: 'var(--text-dim)' }}>
                            <span>Items</span><span>{o.items?.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: 4 }}>
                            <span>Total</span><span>${o.totalAmount}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
