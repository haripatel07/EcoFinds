import api from './api';

export async function getCart() {
    const res = await api.get('/api/cart');
    return res.data;
}

export async function addToCart(productId, quantity = 1) {
    // backend validators expect `quantity` and controller expects `qty` — include both for compatibility
    const payload = { productId, quantity, qty: quantity };
    const res = await api.post('/api/cart', payload);
    return res.data;
}

export async function removeFromCart(productId) {
    const res = await api.delete(`/api/cart/${productId}`);
    return res.data;
}

export async function updateCart(items) {
    // items: [{ product: id, qty }]
    const res = await api.put('/api/cart', { items });
    return res.data;
}

export async function checkout() {
    const res = await api.post('/api/cart/checkout', {});
    return res.data;
}
