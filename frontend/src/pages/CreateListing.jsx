import React, { useState, useContext } from 'react';
import ListingForm from '../components/ListingForm';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext';

export default function CreateListing() {
    const [busy, setBusy] = useState(false);
    const nav = useNavigate();
    const { push } = useContext(ToastContext);
    async function handle(values) {
        try {
            setBusy(true);
            const res = await api.post('/api/products', values);
            push('Listing created', 'success');
            nav(`/products/${res.data._id}`);
        } catch (e) {
            push(e.response?.data?.error?.message || 'Failed', 'error');
        } finally { setBusy(false); }
    }
    return <div style={{ maxWidth: 900, margin: '30px auto 80px' }}>
        <h2 className="ef-section-title" style={{ margin: '0 0 24px' }}>Create Listing</h2>
        <div className="card-surface" style={{ padding: 28 }}>
            <ListingForm onSubmit={handle} busy={busy} />
        </div>
    </div>;
}
