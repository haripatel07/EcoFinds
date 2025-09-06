const db = require('../services/db.service');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Flag = require('../models/Flag');
const bcrypt = require('bcrypt');
const config = require('../config');

async function seed() {
    await db.connect();
    // clear existing data
    await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Cart.deleteMany({}),
        Order.deleteMany({}),
        Category.deleteMany({}),
        Review.deleteMany({}),
        Flag.deleteMany({})
    ]);

    const pass = await bcrypt.hash('password', config.bcryptRounds);
    const users = [];
    for (let i = 1; i <= 5; i++) {
        users.push(await User.create({ email: `demo${i}@example.com`, passwordHash: pass, username: `demo${i}`, isEmailVerified: true }));
    }
    // make first user an admin for demo
    users[0].role = 'admin'; await users[0].save();

    const categories = ['Electronics', 'Sports', 'Books', 'Home', 'Fashion'];
    const catDocs = [];
    for (const c of categories) catDocs.push(await Category.create({ key: c.toLowerCase(), name: c }));

    const products = [];
    for (let i = 1; i <= 20; i++) {
        const seller = users[i % users.length];
        products.push(await Product.create({
            title: `Demo Product ${i}`,
            description: `Well maintained demo item ${i}`,
            category: categories[i % categories.length],
            price: (i * 100),
            seller: seller._id,
            images: [{ url: '/placeholders/default.png', alt: `img${i}` }],
            condition: 'Good',
            location: 'Surat',
            available: true
        }));
    }

    // create carts for first two users
    const cart1 = await Cart.create({ user: users[0]._id, items: [{ product: products[0]._id, qty: 1, priceAtAdd: products[0].price }, { product: products[2]._id, qty: 2, priceAtAdd: products[2].price }] });
    const cart2 = await Cart.create({ user: users[1]._id, items: [{ product: products[3]._id, qty: 1, priceAtAdd: products[3].price }] });

    // create an order for user1 by marking products unavailable and creating order
    const purchased = [products[0], products[4]];
    for (const p of purchased) { p.available = false; await p.save(); }
    const order1 = await Order.create({ buyer: users[0]._id, items: purchased.map(p => ({ product: p._id, seller: p.seller, title: p.title, price: p.price, qty: 1 })), totalAmount: purchased.reduce((s, p) => s + p.price, 0) });
    // link order to user purchases
    users[0].purchases.push(order1._id); await users[0].save();

    // create sample reviews for some products
    await Review.create({ product: products[0]._id, buyer: users[0]._id, rating: 5, comment: 'Great item!' });
    await Review.create({ product: products[4]._id, buyer: users[0]._id, rating: 4, comment: 'Good value.' });

    // flags sample
    await Flag.create({ product: products[10]._id, reporter: users[2]._id, reason: 'Suspicious listing' });

    console.log('Seeded:', { users: users.length, categories: catDocs.length, products: products.length, carts: 2, orders: 1, reviews: 2, flags: 1 });
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
