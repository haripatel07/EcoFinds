import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { WishlistProvider, useWishlist } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

vi.mock('../services/api', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: { items: [{ id: 'p1', title: 'Bike', price: 100, images: [] }], page: 1, total: 1 } })),
        post: vi.fn(() => Promise.resolve({ data: { inWishlist: true } }))
    }
}));

function Wrapper({ children }) {
    return (
        <AuthContext.Provider value={{ user: { id: 'u1' } }}>
            <WishlistProvider>{children}</WishlistProvider>
        </AuthContext.Provider>
    );
}

function HookReader() {
    const { items, has, toggle } = useWishlist();
    return <div data-items={items.length} data-has={has('p1')} onClick={() => toggle('p2')}>test</div>;
}

describe('WishlistContext', () => {
    beforeEach(() => { api.get.mockClear(); api.post.mockClear(); });
    it('loads initial items', async () => {
        const { getByText, getByRole } = render(<Wrapper><HookReader /></Wrapper>);
        await waitFor(() => {
            expect(api.get).toHaveBeenCalled();
        });
    });
});
