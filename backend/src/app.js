const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./utils/logger');
const rateLimit = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');
const path = require('path');
const fs = require('fs');

// routes
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');
const categoriesRoutes = require('./routes/categories.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const flagsRoutes = require('./routes/flags.routes');
const wishlistRoutes = require('./routes/wishlist.routes');

// init
const app = express();
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": ["'self'", "cdn.jsdelivr.net", "'unsafe-inline'"],
            },
        },
    })
);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);

// alias checkout per API.md
const { checkout } = require('./controllers/cart.controller');
const validate = require('./middleware/validate.middleware');
const { checkout: checkoutRules } = require('./utils/validators');
app.post('/api/checkout', require('./middleware/auth.middleware'), checkoutRules, validate, checkout);

app.use('/api/orders', ordersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products/:id/reviews', reviewsRoutes);
app.use('/api/flags', flagsRoutes);
app.use('/api/wishlist', wishlistRoutes);

// docs
app.use('/docs', express.static(path.join(__dirname, 'public', 'docs')));

// API endpoints text
app.get('/api/endpoints', (req, res) => {
    const file = path.join(__dirname, '..', 'api.txt');
    if (!fs.existsSync(file)) return res.json({ text: '' });
    const text = fs.readFileSync(file, 'utf8');
    res.json({ text });
});

// API endpoints text - return the docs/api.txt content (serve from public/docs)
app.get('/api/endpoints', (req, res) => {
    // use the same folder used by the static docs: backend/public/docs/api.txt
    const file = path.join(__dirname, 'public', 'docs', 'api.txt');

    if (!fs.existsSync(file)) return res.status(404).json({ text: '', message: 'api.txt not found' });

    try {
        const text = fs.readFileSync(file, 'utf8');
        return res.json({ text });
    } catch (err) {
        logger.error('Failed to read api.txt', err);
        return res.status(500).json({ text: '', message: 'failed to read api.txt' });
    }
});

// ensure /docs loads index.html explicitly (helps browser & proxies)
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs', 'index.html'));
});


app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
