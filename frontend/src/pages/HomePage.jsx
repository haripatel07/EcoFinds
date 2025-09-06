import React, { useEffect, useState, useRef, useContext } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import './home.css';

export default function HomePage() {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [cats, setCats] = useState([]);
    const debounceRef = useRef(null);

    function load(reset = false) {
        setLoading(true);
        const nextPage = reset ? 1 : page;
        // If not logged in: just fetch first few products once (limit 4) ignoring search/category
        const params = user ? {
            q: search || undefined,
            category: category || undefined,
            page: nextPage,
            limit: 12
        } : { page: 1, limit: 4 };
        api.get('/api/products', { params })
            .then(res => {
                const data = res.data;
                const arr = Array.isArray(data) ? data : (data.items || data.products || []);
                setProducts(reset ? arr : [...products, ...arr]);
                setTotal(data.total || arr.length);
                if (reset) setPage(1);
            })
            .catch(err => setError(err.response?.data?.error?.message || err.message || 'Failed to load'))
            .finally(() => setLoading(false));
    }

    useEffect(() => { api.get('/api/categories').then(r => setCats(r.data)).catch(() => { }); }, []);

    useEffect(() => { // initial + when auth state changes
        load(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => { // search/category debounced (only when logged in)
        if (!user) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => { load(true); }, 450);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category, user]);

    function loadMore() {
        setPage(p => p + 1);
    }

    useEffect(() => { if (page > 1) load(); /* eslint-disable-next-line */ }, [page]);

    if (loading) return <div className="ef-loading">Loading products...</div>;
    if (error) return <div className="ef-error">{error}</div>;

    // Group products by category (only after login)
    const productsByCategory = {};
    if (user) {
        products.forEach(p => {
            const key = (p.category && (p.category.name || p.category)) || 'Other';
            if (!productsByCategory[key]) productsByCategory[key] = [];
            productsByCategory[key].push(p);
        });
    }

    return (
        <div className="ef-home">
            {!user && (
                <div className="ef-hero">
                    <div className="ef-hero-inner">
                        <h1>Discover Sustainable Second-Life Goods</h1>
                        <p>Join EcoFinds to trade, reuse and reduce waste. Sign up to explore products by category and make an impact.</p>
                        <a href="/register" className="ef-cta">Get Started</a>
                    </div>
                </div>
            )}
            {user && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                    <input style={{ flex: '1 1 260px' }} placeholder="Search products" value={search} onChange={e => setSearch(e.target.value)} />
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {cats.map(c => <option key={c._id || c.key} value={c.name || c.key}>{c.name}</option>)}
                    </select>
                </div>
            )}
            {!user && (
                <>
                    <h2 className="ef-section-title" style={{ marginTop: 32 }}>Trending Items</h2>
                    <div className="ef-grid">
                        {products.map(p => <ProductCard key={p._id || p.id} product={p} />)}
                    </div>
                </>
            )}
            {user && (
                Object.keys(productsByCategory).length === 0 ? (
                    <p style={{ marginTop: 20 }}>No products found.</p>
                ) : (
                    Object.keys(productsByCategory).map(cat => (
                        <div key={cat} className="ef-cat-section">
                            <div className="ef-cat-header">
                                <h3 className="ef-section-title" style={{ fontSize: '1.2rem' }}>{cat}</h3>
                            </div>
                            <div className="ef-grid">
                                {productsByCategory[cat].map(p => <ProductCard key={p._id || p.id} product={p} />)}
                            </div>
                        </div>
                    ))
                )
            )}
            {user && products.length < total && (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                    <button onClick={loadMore} disabled={loading}>Load More</button>
                </div>
            )}
        </div>
    );
}
