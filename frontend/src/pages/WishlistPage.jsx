import React, { useContext } from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

export default function WishlistPage() {
    const { user } = useContext(AuthContext);
    const { items, loading, loadMore, total } = useWishlist() || { items: [], loading: false };
    return (
        <div style={{ maxWidth: 1000, margin: '30px auto 80px' }}>
            <h2 className="ef-section-title" style={{ margin: '0 0 20px' }}>Wishlist</h2>
            {!user && <div className="card-surface" style={{ padding: 24 }}>Login to view wishlist.</div>}
            {user && !loading && items.length === 0 && <div className="card-surface" style={{ padding: 24 }}>Your wishlist is empty.</div>}
            {user && (
                <>
                    <div className="ef-grid" style={{ marginTop: 20 }}>
                        {items.map(p => <ProductCard key={p.id || p._id} product={{
                            _id: p.id || p._id,
                            title: p.title,
                            price: p.price,
                            images: (p.images && p.images.length) ? p.images : (p.image ? [{ url: p.image, alt: p.title }] : []),
                            description: p.description || '',
                            category: p.category
                        }} />)}
                        {loading && [...Array(4)].map((_, i) => (
                            <div key={'sk' + i} className="ef-product-card" style={{ opacity: .4 }}>
                                <div className="ef-product-media"><div className="skeleton" style={{ height: 160 }} /></div>
                                <div className="ef-product-body">
                                    <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
                                    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 16 }} />
                                    <div className="skeleton" style={{ height: 44 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {items.length < total && !loading && (
                        <div style={{ textAlign: 'center', marginTop: 28 }}>
                            <button className="btn btn-outline" onClick={loadMore}>Load More</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
