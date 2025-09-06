// Centralized API helpers mapping backend endpoints.
import api from './api';

// Auth
export async function loginApi(email, password) { return (await api.post('/api/auth/login', { email, password })).data; }
export async function registerApi(username, email, password) { return (await api.post('/api/auth/register', { username, email, password })).data; }
// Placeholder for refresh token flow (backend does not yet expose) so UI can integrate later.
export async function refreshSession() { return Promise.resolve(null); }

// User
export async function getMe() { return (await api.get('/api/users/me')).data; }
export async function updateMe(patch) { return (await api.put('/api/users/me', patch)).data; }

// Products
export async function listProducts(params) { return (await api.get('/api/products', { params })).data; }
export async function getProduct(id) { return (await api.get(`/api/products/${id}`)).data; }
export async function createProduct(data) { return (await api.post('/api/products', data)).data; }
export async function updateProduct(id, data) { return (await api.put(`/api/products/${id}`, data)).data; }
export async function deleteProduct(id) { return (await api.delete(`/api/products/${id}`)).data; }

// Categories
export async function listCategories() { return (await api.get('/api/categories')).data; }

// Reviews
export async function listReviews(productId) { return (await api.get(`/api/products/${productId}/reviews`)).data; }
export async function createReview(productId, payload) { return (await api.post(`/api/products/${productId}/reviews`, payload)).data; }

// Flags
export async function flagProduct(productId, reason) { return (await api.post(`/api/flags/${productId}/flag`, { reason })).data; }
export async function listFlags() { return (await api.get('/api/flags')).data; }

// Orders
export async function listOrders() { return (await api.get('/api/orders')).data; }
export async function getOrder(id) { return (await api.get(`/api/orders/${id}`)).data; }

// Cart moved remains in cart.js for compatibility; could unify later.
