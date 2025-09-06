const User = require('../models/User');
const Product = require('../models/Product');

function safeWishlist(wishlist) {
    return wishlist.map(p => (p && p._id ? { id: p._id, title: p.title, price: p.price } : p));
}

async function getWishlist(req, res, next) {
    try {
        const wantFull = req.query.full === '1' || req.query.full === 'true';
        await req.user.populate('wishlist', wantFull ? 'title price images category seller createdAt description' : 'title price');
        if (!wantFull) {
            // Apply pagination on ids list
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit) || 50, 100);
            const start = (page - 1) * limit;
            const slice = req.user.wishlist.slice(start, start + limit);
            return res.json({ items: safeWishlist(slice), page, limit, total: req.user.wishlist.length });
        }
        // Return richer product objects (limited fields) with pagination
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 24, 100);
        const start = (page - 1) * limit;
        const all = req.user.wishlist;
        const subset = all.slice(start, start + limit);
        const items = subset.map(p => ({
            id: p._id,
            title: p.title,
            price: p.price,
            images: p.images || [],
            description: p.description || '',
            category: p.category,
            seller: p.seller,
            createdAt: p.createdAt
        }));
        res.json({ items, page, limit, total: all.length });
    } catch (err) { next(err); }
}

async function toggleWishlist(req, res, next) {
    try {
        const productId = req.params.productId;
        if (!productId) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'productId required' } });
        const exists = await Product.exists({ _id: productId });
        if (!exists) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
        const idx = req.user.wishlist.findIndex(id => id.toString() === productId);
        if (idx >= 0) req.user.wishlist.splice(idx, 1); else req.user.wishlist.push(productId);
        await req.user.save();
        res.json({ success: true, inWishlist: idx < 0 });
    } catch (err) { next(err); }
}

module.exports = { getWishlist, toggleWishlist };
