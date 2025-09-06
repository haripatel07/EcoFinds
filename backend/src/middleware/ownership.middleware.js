const Product = require('../models/Product');

async function checkProductOwner(req, res, next) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
    }

    if (!product.seller.equals(req.user._id) && req.user.role !== 'admin') {
        return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
    }

    req.product = product;
    next();
}

module.exports = { checkProductOwner };
