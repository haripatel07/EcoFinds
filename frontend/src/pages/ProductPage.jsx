import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { addToCart } from '../services/cart';
import { ToastContext } from '../context/ToastContext';

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [revForm, setRevForm] = useState({ rating: 5, comment: '' });
    const [flagOpen, setFlagOpen] = useState(false);
    const [flagReason, setFlagReason] = useState('');

    useEffect(() => {
        let mounted = true;
        api.get(`/api/products/${id}`).then(r => { if (mounted) setProduct(r.data); }).catch(() => { }).finally(() => { if (mounted) setLoading(false); });
        api.get(`/api/products/${id}/reviews`).then(r => { if (mounted) setReviews(r.data); }).catch(() => { });
        return () => { mounted = false };
    }, [id]);

    const avgRating = useMemo(() => {
        if (!reviews || reviews.length === 0) return null;
        const s = reviews.reduce((a, r) => a + (r.rating || 0), 0);
        return (s / reviews.length).toFixed(1);
    }, [reviews]);

    if (loading) return <div className="card-surface" style={{ padding: 24, margin: '20px auto', maxWidth: 960 }}>Loading...</div>;
    if (!product) return <div className="card-surface" style={{ padding: 24, margin: '20px auto', maxWidth: 960 }}>Product not found</div>;

    const { push } = useContext(ToastContext);
    async function onAdd() {
        if (!user) return navigate('/login');
        try {
            await addToCart(product._id, Number(qty || 1));
            push('Added to cart', 'success');
        } catch (err) {
            push(err.response?.data?.error?.message || err.message || 'Failed', 'error');
        }
    }

    async function submitReview() {
        if (!user) return navigate('/login');
        try {
            const res = await api.post(`/api/products/${id}/reviews`, revForm);
            setReviews([res.data, ...reviews]);
            setRevForm({ rating: 5, comment: '' });
            push('Review added', 'success');
        } catch (e) { push(e.response?.data?.error?.message || 'Failed', 'error'); }
    }

    async function submitFlag() {
        if (!user) return navigate('/login');
        try {
            await api.post(`/api/flags/${id}/flag`, { reason: flagReason });
            setFlagReason(''); setFlagOpen(false); push('Flag submitted', 'success');
        } catch (e) { push(e.response?.data?.error?.message || 'Failed', 'error'); }
    }

    return (
        <div style={{ maxWidth: 1040, margin: '24px auto 60px' }}>
            <div className="card-surface" style={{ padding: 28, marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                    <div style={{ flex: '0 0 340px' }}>
                        {product.images?.[0] ? <img src={(product.images[0].url || product.images[0])} style={{ width: '100%', borderRadius: 12, background: '#101416', objectFit: 'cover' }} alt={product.images[0].alt || product.title} /> : <div className="skeleton" style={{ height: 260 }} />}
                    </div>
                    <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <h2 className="ef-section-title" style={{ margin: 0, fontSize: '1.9rem', letterSpacing: '.5px' }}>{product.title}</h2>
                            {avgRating && <span className="ef-sustain" style={{ background: 'var(--accent)', color: '#05241a' }}>{avgRating}★</span>}
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent)' }}>${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</div>
                        <p style={{ margin: '4px 0 12px', color: 'var(--text-dim)', lineHeight: 1.55 }}>{product.description}</p>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} style={{ width: 100 }} />
                            <button className="btn btn-accent" onClick={onAdd}>Add to cart</button>
                            <button className="btn btn-outline" onClick={() => setFlagOpen(o => !o)}>Flag</button>
                        </div>
                        {flagOpen && (
                            <div style={{ width: '100%' }}>
                                <textarea value={flagReason} onChange={e => setFlagReason(e.target.value)} placeholder="Reason" rows={3} />
                                <div style={{ marginTop: 8 }}>
                                    <button className="btn btn-danger" disabled={!flagReason} onClick={submitFlag}>Submit Flag</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-surface" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 className="ef-section-title" style={{ margin: 0, fontSize: '1.25rem' }}>Reviews</h3>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-dim)' }}>{reviews.length} total</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                    <select style={{ flex: '0 0 80px' }} value={revForm.rating} onChange={e => setRevForm({ ...revForm, rating: Number(e.target.value) })}>
                        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input style={{ flex: '1 1 320px' }} placeholder="Share your experience" value={revForm.comment} onChange={e => setRevForm({ ...revForm, comment: e.target.value })} />
                    <button className="btn btn-accent" onClick={submitReview}>Post</button>
                </div>
                {reviews.length === 0 ? <div className="muted">No reviews yet.</div> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {reviews.map(rv => (
                            <div key={rv._id} className="card-surface" style={{ padding: 14, background: 'var(--bg-alt2)', borderColor: '#253037' }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <strong style={{ color: 'var(--accent)' }}>{rv.rating}★</strong>
                                    <span style={{ fontSize: '.75rem', color: 'var(--text-dim)' }}>by {rv.buyer?.username || 'user'}</span>
                                </div>
                                <div style={{ fontSize: '.85rem', marginTop: 4, lineHeight: 1.45 }}>{rv.comment}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
