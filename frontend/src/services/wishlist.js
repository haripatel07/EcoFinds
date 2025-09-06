import api from './api';

export async function fetchWishlist() {
    const res = await api.get('/api/wishlist');
    return res.data?.items || [];
}

export async function toggleWishlist(productId) {
    const res = await api.post(`/api/wishlist/${productId}`);
    return !!res.data?.inWishlist;
}
