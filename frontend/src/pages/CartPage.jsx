import React, { useEffect, useState, useContext } from 'react';
import { getCart, removeFromCart, updateCart, checkout } from '../services/cart';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

export default function CartPage() {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        getCart().then(d => setCart(d)).catch(e => setError(e.message || 'Failed')).finally(() => setLoading(false));
    }, [user]);

    if (!user) return <div className="card-surface" style={{ maxWidth: 760, margin: '24px auto', padding: 28 }}>Please login to view your cart.</div>;
    if (loading) return <div className="card-surface" style={{ maxWidth: 760, margin: '24px auto', padding: 28 }}>Loading cart...</div>;
    if (error) return <div className="card-surface" style={{ maxWidth: 760, margin: '24px auto', padding: 28, borderColor: 'var(--danger)', color: 'var(--danger)' }}>{error}</div>;

    const { push } = useContext(ToastContext);
    async function doRemove(id) {
        await removeFromCart(id);
        const d = await getCart();
        setCart(d);
        push('Removed from cart');
    }

    async function doCheckout() {
        try {
            setLoading(true);
            const res = await checkout();
            push(`Order completed (${res.orderId}) - total ${res.totalAmount}`, 'success');
            const d = await getCart();
            setCart(d);
        } catch (err) {
            push(err.response?.data?.error?.message || err.message || 'Checkout failed', 'error');
        } finally { setLoading(false); }
    }

    const subtotal = cart.items.reduce((s, it) => s + (it.priceAtAdd || 0) * (it.qty || it.quantity || 1), 0);

    return (
        <div style={{ maxWidth: 1040, margin: '28px auto 80px' }}>
            <h2 className="ef-section-title" style={{ margin: '0 0 20px' }}>Your Cart</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
                <div className="card-surface" style={{ padding: 0 }}>
                    {cart.items.length === 0 ? <div style={{ padding: 28 }}>No items in cart</div> : (
                        <div>
                            {cart.items.map(it => (
                                <div key={it.product._id || it.product} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid #1f2a30', alignItems: 'stretch' }}>
                                    <div style={{ width: 96, height: 76, background: '#101416', borderRadius: 8, overflow: 'hidden' }}>
                                        {it.product?.images?.[0] ? <img src={it.product.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="skeleton" style={{ height: '100%' }} />}
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ fontWeight: 600 }}>{it.product?.title || it.product?.name}</div>
                                        <div style={{ fontSize: '.7rem', color: 'var(--text-dim)' }}>Qty: {it.qty || it.quantity}</div>
                                        <div style={{ fontSize: '.8rem', color: 'var(--accent)', fontWeight: 600 }}>${it.priceAtAdd?.toFixed ? it.priceAtAdd.toFixed(2) : it.priceAtAdd}</div>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline" onClick={() => doRemove(it.product._id || it.product)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="card-surface" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <h3 style={{ margin: 0 }}>Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                            <span className="muted">Items</span>
                            <span>{cart.items.length}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                            <span className="muted">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ height: 1, background: '#1f2a30', margin: '6px 0 4px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-accent" disabled={cart.items.length === 0} onClick={doCheckout}>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
