import React, { createContext, useState, useCallback, useContext } from 'react';

export const UIContext = createContext(null);

export function UIProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const startLoading = useCallback(() => setLoading(true), []);
    const stopLoading = useCallback(() => setLoading(false), []);
    const raiseError = useCallback(err => setError(typeof err === 'string' ? err : (err?.message || 'Unexpected error')), []);
    const clearError = useCallback(() => setError(null), []);

    return (
        <UIContext.Provider value={{ loading, error, startLoading, stopLoading, raiseError, clearError }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--accent),#fff2)', zIndex: 9998, animation: 'ef-bar 1s linear infinite' }} />
            )}
            {error && (
                <div style={{ position: 'fixed', top: 16, right: 16, background: '#b00020', color: '#fff', padding: '10px 14px', borderRadius: 8, zIndex: 9999, maxWidth: 300 }}>
                    <div style={{ fontSize: '.8rem', lineHeight: 1.3 }}>{error}</div>
                    <button style={{ marginTop: 6, fontSize: '.65rem' }} onClick={clearError}>Close</button>
                </div>
            )}
        </UIContext.Provider>
    );
}

export function useUI() { return useContext(UIContext); }
