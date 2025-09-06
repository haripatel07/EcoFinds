const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const pino = require('./utils/logger');
const rateLimit = require('./middleware/rateLimit.middleware');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');
const categoriesRoutes = require('./routes/categories.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const flagsRoutes = require('./routes/flags.routes');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit);

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
// alias checkout endpoint required by API.md
const { checkout } = require('./controllers/cart.controller');
const validate = require('./middleware/validate.middleware');
const { checkout: checkoutRules } = require('./utils/validators');
app.post('/api/checkout', require('./middleware/auth.middleware'), checkoutRules, validate, checkout);
app.use('/api/orders', ordersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products/:id/reviews', reviewsRoutes);
app.use('/api/flags', flagsRoutes);

// Serve docs static UI
app.use('/docs', express.static(path.join(__dirname, 'public', 'docs')));

// endpoint to return api.txt contents used by the docs UI
app.get('/api/endpoints', (req, res) => {
    const file = path.join(__dirname, '..', 'api.txt');
    if (!fs.existsSync(file)) return res.json({ text: '' });
    const text = fs.readFileSync(file, 'utf8');
    res.json({ text });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
