const { body, param, query } = require('express-validator');

const register = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    body('username').isLength({ min: 2 }).withMessage('Username required')
];

const login = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password required')
];

const productCreate = [
    body('title').isLength({ min: 1 }).withMessage('Title is required'),
    body('price').isNumeric().withMessage('Price must be numeric'),
    body('category').isLength({ min: 1 }).withMessage('Category required')
];

const productUpdate = [
    body('price').optional().isNumeric().withMessage('Price must be numeric'),
    body('title').optional().isLength({ min: 1 }).withMessage('Title is required when provided')
];

const cartPost = [
    body('productId').isMongoId().withMessage('Valid productId is required'),
    body('qty').optional().isInt({ min: 1 }).withMessage('qty must be >=1')
];

const cartPut = [
    body('items').isArray().withMessage('items must be an array'),
    body('items.*.product').isMongoId().withMessage('product id required'),
    body('items.*.qty').isInt({ min: 1 }).withMessage('qty must be integer >=1')
];

const categoryCreate = [
    body('key').isLength({ min: 1 }).withMessage('key required'),
    body('name').isLength({ min: 1 }).withMessage('name required')
];

const reviewCreate = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('rating 1-5 required'),
    body('comment').optional().isString()
];

const flagCreate = [
    body('reason').isLength({ min: 3 }).withMessage('reason required')
];

const checkout = [
    body('paymentMethod').optional().isString()
];

module.exports = { register, login, productCreate, productUpdate, cartPost, cartPut, categoryCreate, reviewCreate, flagCreate, checkout };
