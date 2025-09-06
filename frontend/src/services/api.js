import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' }
});

// Request timing + auth header fallback (in case context not yet set)
api.interceptors.request.use(cfg => {
    cfg.metadata = { start: performance.now() };
    if (!cfg.headers.Authorization) {
        const token = localStorage.getItem('ef_token');
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
});

let refreshing = false;
let queue = [];

function processQueue(err, token) {
    queue.forEach(p => err ? p.reject(err) : p.resolve(token));
    queue = [];
}

// Response timing + basic error normalization (non-breaking) + refresh handling placeholder
api.interceptors.response.use(res => {
    if (res.config?.metadata?.start) {
        const ms = performance.now() - res.config.metadata.start;
        if (ms > 800) console.warn('[api] slow request', res.config.method?.toUpperCase(), res.config.url, `${ms.toFixed(0)}ms`);
    }
    return res;
}, err => {
    const original = err;
    const message = err?.response?.data?.error?.message || err.message || 'Request failed';
    const code = err?.response?.data?.error?.code || err.code || 'REQUEST_ERROR';
    err.normalized = { message, code, status: err.response?.status };

    // Attempt silent refresh on 401 once (placeholder - backend refresh endpoint not implemented yet)
    if (err.response?.status === 401 && !original.config.__retry) {
        original.config.__retry = true;
        if (refreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject });
            }).then(token => {
                if (token) original.config.headers.Authorization = `Bearer ${token}`;
                return api(original.config);
            });
        }
        refreshing = true;
        // Placeholder: would call /api/auth/refresh here
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                refreshing = false;
                processQueue(null, null); // no new token
                reject(original); // propagate original error (no refresh flow yet)
            }, 150);
        });
    }
    return Promise.reject(original);
});

export default api;
