import React, { createContext, useState } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    function push(message, type = 'info', ttl = 3600) {
        const id = Date.now() + Math.random();
        setToasts(t => [...t, { id, message, type }]);
        if (ttl) setTimeout(() => { setToasts(t => t.filter(x => x.id !== id)); }, ttl);
    }

    function remove(id) { setToasts(t => t.filter(x => x.id !== id)); }

    return (
        <ToastContext.Provider value={{ push, remove }}>
            {children}
            <div id="toast-root">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`}
                        onClick={() => remove(t.id)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ flex: 1 }}>{t.message}</span>
                        <span style={{ fontSize: '.65rem', opacity: .6 }}>Close</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
