import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ef_user')) || null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('ef_token') || null);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('ef_token', token);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('ef_token');
        }
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem('ef_user', JSON.stringify(user));
        else localStorage.removeItem('ef_user');
    }, [user]);

    async function login(email, password) {
        const res = await api.post('/api/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        setToken(t);
        setUser(u);
        return res.data;
    }

    async function register(username, email, password) {
        const res = await api.post('/api/auth/register', { username, email, password });
        const { token: t, user: u } = res.data;
        setToken(t);
        setUser(u);
        return res.data;
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
