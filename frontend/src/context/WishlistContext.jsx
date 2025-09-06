import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { ToastContext } from './ToastContext';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const { user } = useContext(AuthContext);
    const { push } = useContext(ToastContext);
    const [items, setItems] = useState([]); // product objects
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(24);

    useEffect(() => {
        if (!user) { setItems([]); return; }
        setLoading(true);
        api.get(`/api/wishlist?full=1&page=1&limit=${limit}`)
            .then(res => {
                const arr = res.data?.items || [];
                setItems(arr);
                setPage(res.data.page || 1);
                setTotal(res.data.total || arr.length);
            })
            .catch(() => { /* silent */ })
            .finally(() => setLoading(false));
    }, [user]);

    const toggle = useCallback(async (productId) => {
        if (!user) return false;
        try {
            const res = await api.post(`/api/wishlist/${productId}`);
            const inWishlist = !!res.data?.inWishlist;
            setItems(prev => {
                if (inWishlist) {
                    // If we only have ids (edge), push id; else refetch full list lazily
                    if (prev.length === 0 || typeof prev[0] === 'string') return [...prev, productId];
                    return prev;
                } else {
                    return prev.filter(p => (p.id || p) !== productId);
                }
            });
            push(inWishlist ? 'Added to wishlist' : 'Removed from wishlist', 'info');
            return inWishlist;
        } catch (err) {
            push(err.response?.data?.error?.message || err.message || 'Wishlist action failed', 'error');
            return false;
        }
    }, [user, push]);

    const loadMore = useCallback(async () => {
        if (loading) return; // avoid overlap
        if (items.length >= total) return;
        const nextPage = page + 1;
        setLoading(true);
        try {
            const res = await api.get(`/api/wishlist?full=1&page=${nextPage}&limit=${limit}`);
            const arr = res.data?.items || [];
            setItems(prev => [...prev, ...arr]);
            setPage(res.data.page || nextPage);
            setTotal(res.data.total || total);
        } finally { setLoading(false); }
    }, [page, limit, loading, items.length, total]);

    const value = { items, toggle, loading, has: (id) => items.some(p => (p.id || p) === id), loadMore, page, total, limit };
    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() { return useContext(WishlistContext); }
