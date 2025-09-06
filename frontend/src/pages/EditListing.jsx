import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm';
import api from '../services/api';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';

export default function EditListing() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [busy, setBusy] = useState(true);
    const { push } = useContext(ToastContext);
    const { user } = useContext(AuthContext);
    const nav = useNavigate();

    useEffect(() => {
        api.get(`/api/products/${id}`).then(r => { setItem(r.data); }).catch(() => push('Failed to load', 'error')).finally(() => setBusy(false));
    }, [id]);

    async function handle(values) {
        try {
            setBusy(true);
            await api.put(`/api/products/${id}`, values);
            push('Listing updated', 'success');
            nav(`/products/${id}`);
        } catch (e) { push(e.response?.data?.error?.message || 'Update failed', 'error'); }
        finally { setBusy(false); }
    }

    if (!user) return <div className="card-surface" style={{ padding: 28, maxWidth: 760, margin: '32px auto' }}>Login required.</div>;
    if (busy && !item) return <div className="card-surface" style={{ padding: 28, maxWidth: 760, margin: '32px auto' }}>Loading...</div>;
    if (!item) return <div className="card-surface" style={{ padding: 28, maxWidth: 760, margin: '32px auto' }}>Not found</div>;

    return <div style={{ maxWidth: 900, margin: '30px auto 80px' }}>
        <h2 className="ef-section-title" style={{ margin: '0 0 24px' }}>Edit Listing</h2>
        <div className="card-surface" style={{ padding: 28 }}>
            <ListingForm initial={item} onSubmit={handle} busy={busy} />
        </div>
    </div>;
}
