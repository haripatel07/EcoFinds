import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './productcard.css';
import { AuthContext } from '../context/AuthContext';
import { useFeature } from '../hooks/useFeature';
import { addToCart } from '../services/cart';
import { useWishlist } from '../context/WishlistContext';
import { ToastContext } from '../context/ToastContext';

export default function ProductCard({ product }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const firstImage = product.images && product.images.length > 0 && product.images[0];
    const img = (firstImage && (firstImage.url || firstImage)) || product.imageUrl || null;
    const alt = (firstImage && (firstImage.alt || firstImage.title)) || product.title || product.name || 'product';
    const title = product.title || product.name;

    const { push } = useContext(ToastContext);
    async function handleAdd() {
        if (!user) return navigate('/login');
        try {
            await addToCart(product._id || product.id, Number(qty || 1));
            push('Added to cart', 'success');
        } catch (err) {
            push(err.response?.data?.error?.message || err.message || 'Failed to add to cart', 'error');
        }
    }

    // Simple sustainability heuristic: assume buying used saves 70% of manufacturing emissions.
    // We'll estimate base CO2 = price * 0.2 (arbitrary) then savings = base * 0.7.
    const estimatedCO2Saved = product.price ? Math.round(product.price * 0.2 * 0.7) : null;

    const wishlistEnabled = useFeature('wishlist');
    const { items: wishlistItems, toggle: toggleWishlist, has } = useWishlist() || { items: [], toggle: () => { }, has: () => false };
    const [wish, setWish] = useState(false);

    // Sync local state when wishlist or product changes
    useEffect(() => {
        if (!wishlistEnabled || !user) { setWish(false); return; }
        const pid = product._id || product.id;
        setWish(has(pid));
    }, [wishlistEnabled, user, product, has]);

    function onToggleWish() {
        if (!user) return navigate('/login');
        const pid = product._id || product.id;
        // optimistic update
        setWish(w => !w);
        toggleWishlist(pid).then(inWishlist => {
            setWish(inWishlist);
        });
    }

    const condition = product.condition || product.state || null;
    return (
        <div className="ef-product-card">
            <div className="ef-product-media">
                {condition && <span className="ef-cond-badge" title="Condition">{condition}</span>}
                {wishlistEnabled && user && (
                    <button className={`ef-wish-btn ${wish ? 'active' : ''}`} title={wish ? 'Remove from wishlist' : 'Add to wishlist'} onClick={onToggleWish}>
                        {wish ? '❤' : '♡'}
                    </button>
                )}
                {img ? <img loading="lazy" src={img} alt={title} /> : <div className="skeleton" />}
            </div>
            <div className="ef-product-body">
                <h3 title={title}>{title.length > 60 ? title.substring(0, 57) + '…' : title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="ef-price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                    {estimatedCO2Saved !== null && <span className="ef-sustain" title="Estimated CO₂ saved">{estimatedCO2Saved}g</span>}
                </div>
                <p className="ef-desc" style={{ fontSize: '.72rem', lineHeight: 1.4, color: 'var(--text-dim)', minHeight: 34 }}>{product.description?.substring(0, 82)}</p>
                <div className="ef-product-actions" style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 'auto' }}>
                    <Link style={{ fontSize: '.8rem', color: 'var(--accent)' }} to={`/products/${product._id || product.id}`}>Details</Link>
                    {user ? (
                        <>
                            <input aria-label="quantity" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} style={{ width: 55 }} />
                            <button onClick={handleAdd}>Add</button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')} style={{ fontSize: '.7rem' }}>Sign in to add</button>
                    )}
                </div>
            </div>
        </div>
    );
}
