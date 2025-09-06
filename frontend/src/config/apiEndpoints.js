// Single source for backend endpoint paths (helps consistency & future versioning)
export const API = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        me: '/api/users/me'
    },
    products: '/api/products',
    product: (id) => `/api/products/${id}`,
    categories: '/api/categories',
    cart: '/api/cart',
    cartItem: (id) => `/api/cart/${id}`,
    checkout: '/api/cart/checkout',
    reviews: (productId) => `/api/products/${productId}/reviews`,
    flags: (productId) => `/api/flags/${productId}/flag`,
    orders: '/api/orders'
};
