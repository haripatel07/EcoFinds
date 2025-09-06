# EcoFinds — Backend API & Schemas (terminal-style `.md` for your team)

Copy this file into your repo as `API_AND_SCHEMAS.md`. It contains **all API endpoints**, **request/response examples**, **auth requirements**, and the full **Mongoose schemas** (copy-paste-ready). Use it to implement controllers, routes, and to coordinate frontend & mobile teams.

---

## Quick notes

* Auth: JWT in `Authorization: Bearer <token>`.
* Passwords: store bcrypt hash in `passwordHash`.
* DB: MongoDB (Mongoose).
* Image uploading: images\[] holds URLs (placeholder for MVP).
* All timestamps are ISO strings.

---

# Table of contents

1. [Auth & User endpoints](#auth--user-endpoints)
2. [Product endpoints](#product-endpoints)
3. [Cart & Checkout endpoints](#cart--checkout-endpoints)
4. [Order / Purchase endpoints](#order--purchase-endpoints)
5. [Optional endpoints (Category / Review / Flags)](#optional-endpoints)
6. [Sample curl commands](#sample-curl-commands)
7. [Mongoose Schemas (copy into `/models/*.js`)](#mongoose-schemas)

---

## Implemented endpoints (this repo)

The backend in this repository implements the following endpoints (paths match the API above):

- Auth
  - POST /api/auth/register
  - POST /api/auth/login
  - GET  /api/auth/verify-email (email verification link)
- Users
  - GET  /api/users/me
  - PUT  /api/users/me
- Products
  - GET    /api/products
  - GET    /api/products/:id
  - POST   /api/products (auth)
  - PUT    /api/products/:id (auth, owner)
  - DELETE /api/products/:id (auth, owner)
  - POST   /api/products/:id/flag (auth)
- Cart
  - GET    /api/cart
  - POST   /api/cart
  - PUT    /api/cart
  - DELETE /api/cart/:productId
  - POST   /api/cart/checkout (auth)
  - POST   /api/checkout (auth)  <-- alias required by API.md
- Orders
  - GET    /api/orders
  - GET    /api/orders/:id
- Categories (optional)
  - GET  /api/categories
  - POST /api/categories (auth + admin)
- Reviews
  - GET  /api/products/:id/reviews
  - POST /api/products/:id/reviews (auth)
- Flags (moderation)
  - GET  /api/flags (auth + admin)
  - POST /api/products/:id/flag (auth)

---

## Project structure (important files)

```
/backend
  /src
    /config
      index.js
    /controllers
      auth.controller.js
      users.controller.js
      products.controller.js
      cart.controller.js
      orders.controller.js
      categories.controller.js
      reviews.controller.js
      flags.controller.js
    /routes
      auth.routes.js
      users.routes.js
      products.routes.js
      cart.routes.js
      orders.routes.js
      categories.routes.js
      reviews.routes.js
      flags.routes.js
    /middleware
      auth.middleware.js
      admin.middleware.js
      validate.middleware.js
      ownership.middleware.js
      error.middleware.js
    /models
      User.js
      Product.js
      Cart.js
      Order.js
      Category.js
      Review.js
      Flag.js
    /services
      db.service.js
      auth.service.js
    /utils
      logger.js
      validators.js
      pagination.js
      seed.js
    app.js
    server.js
  package.json
  .env.example
  README.md
```

---

## Auth & User endpoints

```
POST   /api/auth/register       # public
POST   /api/auth/login          # public
GET    /api/users/me            # auth
PUT    /api/users/me            # auth
```

### `POST /api/auth/register`

Request:

```json
{
  "email": "captain@example.com",
  "password": "S3cret!",
  "username": "captain"
}
```

Response (201):

```json
{
  "user": { "id":"<userId>", "email":"captain@example.com", "username":"captain" },
  "token": "<jwt>"
}
```

### `POST /api/auth/login`

Request:

```json
{ "email": "captain@example.com", "password": "S3cret!" }
```

Response (200):

```json
{
  "user": { "id":"<userId>", "email":"captain@example.com", "username":"captain" },
  "token": "<jwt>"
}
```

### `GET /api/users/me` (auth)

Response:

```json
{
  "id": "<userId>",
  "email": "captain@example.com",
  "username": "captain",
  "avatarUrl": "",
  "phone": "",
  "isPhoneVerified": false,
  "isEmailVerified": false,
  "role": "user",
  "createdAt": "2025-09-06T12:00:00.000Z",
  "wishlist": [],
  "purchases": []
}
```

### `PUT /api/users/me` (auth)

Request (partial allowed):

```json
{
  "username": "captain2",
  "avatarUrl": "https://cdn.example.com/avatar.png",
  "phone": "+911234567890"
}
```

Response: updated user object.

---

## Product endpoints

```
GET    /api/products                 # public (query params: q, category, page, limit)
GET    /api/products/:id             # public
POST   /api/products                 # auth (create)
PUT    /api/products/:id             # auth (owner only)
DELETE /api/products/:id             # auth (owner only)
```

### `GET /api/products`

Query params:

* `q` — keyword search (title + description)
* `category` — filter by category
* `page` — default 1
* `limit` — default 20

Response (200):

```json
{
  "items": [ { "id":"...","title":"...","price":1000,"images":[{"url":"..."}], "category":"Electronics" } ],
  "page": 1,
  "limit": 20,
  "total": 123
}
```

### `GET /api/products/:id`

Response:

```json
{
  "id":"<productId>",
  "title":"Used Mountain Bike",
  "description":"Well maintained",
  "category":"Sports",
  "price":4500,
  "currency":"INR",
  "seller": { "id":"<sellerId>", "username":"sellerName", "avatarUrl": "" },
  "images":[{"url":"https://...","alt":"bike"}],
  "available": true,
  "condition":"Good",
  "location":"Surat",
  "createdAt":"2025-09-06T12:00:00.000Z"
}
```

### `POST /api/products` (auth)

Request:

```json
{
  "title":"Used Mountain Bike",
  "description":"Good condition",
  "category":"Sports",
  "price":4500,
  "images":[{"url":"/placeholders/bike.png","alt":"bike"}],
  "condition":"Good",
  "location":"Surat"
}
```

Response: created product object (201).

### `PUT /api/products/:id` (auth, owner)

Request: fields to update. Response: updated product.

### `DELETE /api/products/:id` (auth, owner)

Response: 204 No Content or deleted product.

---

## Cart & Checkout endpoints

```
GET    /api/cart                # auth
POST   /api/cart                # auth  (body: { productId, qty })
PUT    /api/cart                # auth  (replace items array) or update item qty
DELETE /api/cart/:productId     # auth
POST   /api/checkout            # auth  (simulate purchase)
```

### `GET /api/cart` (auth)

Response:

```json
{
  "user": "<userId>",
  "items": [
    { "product":{"id":"...","title":"...","price":1000,"images":[{"url":"..."}]}, "qty":1, "priceAtAdd":1000 }
  ],
  "updatedAt":"2025-09-06T12:00:00.000Z"
}
```

### `POST /api/cart` (auth)

Request:

```json
{ "productId":"<productId>", "qty": 1 }
```

Response: updated cart object.

### `DELETE /api/cart/:productId` (auth)

Removes the item; response: updated cart.

### `POST /api/checkout` (auth)

* Process:

  1. Validate cart items exist & are `available: true`.
  2. Atomically set `available=false` per product (or use transaction for multiple).
  3. Create `Order` with items + totalAmount.
  4. Clear user's cart.
  5. Add order id to user's purchases (optional).
* Request:

```json
{ "paymentMethod":"mock" }
```

* Response (201):

```json
{ "orderId":"<orderId>", "status":"completed", "totalAmount":4500 }
```

---

## Order / Purchase endpoints

```
GET    /api/orders           # auth  (list user's orders)
GET    /api/orders/:id       # auth  (user's specific order)
```

### `GET /api/orders` (auth)

Response:

```json
[
  {
    "id":"<orderId>",
    "buyer":"<userId>",
    "items":[ { "product":"<productId>", "title":"Used Bike", "price":4500, "qty":1 } ],
    "totalAmount":4500,
    "status":"completed",
    "createdAt":"2025-09-06T12:05:00.000Z"
  }
]
```

### `GET /api/orders/:id` (auth)

Return order detail if buyer matches requestor (or admin).

---

## Optional endpoints (Category / Review / Flags)

```
GET    /api/categories            # public
POST   /api/categories            # auth admin
GET    /api/products/:id/reviews  # public
POST   /api/products/:id/reviews  # auth (buyer only ideally)
POST   /api/products/:id/flag     # auth (report)
GET    /api/flags                 # auth admin (moderation)
GET    /api/wishlist              # auth (current user's wishlist)
POST   /api/wishlist/:productId   # auth (toggle wishlist)
```

---

## Sample curl commands

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"email":"captain@example.com","password":"S3cret!","username":"captain"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email":"captain@example.com","password":"S3cret!"}'

# Get products (search)
curl "http://localhost:5000/api/products?q=bike&category=Sports&page=1&limit=12"

# Create product (auth)
curl -X POST http://localhost:5000/api/products \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <token>" \
 -d '{"title":"Used Bike","description":"Good","category":"Sports","price":4500,"images":[{"url":"/placeholders/bike.png"}]}'

# Add to cart
curl -X POST http://localhost:5000/api/cart \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <token>" \
 -d '{"productId":"<productId>","qty":1}'

# Checkout
curl -X POST http://localhost:5000/api/checkout \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <token>" \
 -d '{"paymentMethod":"mock"}'
```

---

## Mongoose Schemas (create in `/models/*.js`)

> Paste each block into the corresponding file (e.g., `models/User.js`) and `module.exports = mongoose.model(...)` is included.

### `models/User.js`

```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  username: { type: String, required: true, trim: true, index: true },
  avatarUrl: { type: String, default: '' },
  phone: { type: String, default: '' },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

UserSchema.index({ email: 1 });
module.exports = mongoose.model('User', UserSchema);
```

---

### `models/Category.js` (optional)

```js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', CategorySchema);
```

---

### `models/Product.js`

```js
const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: 'text' },
  description: { type: String, default: '' },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  images: { type: [ImageSchema], default: [{ url: '/placeholders/default.png', alt: 'placeholder' }] },
  available: { type: Boolean, default: true, index: true },
  condition: { type: String, enum: ['New','Like New','Good','Fair','Poor'], default: 'Good' },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.index({ title: 'text', description: 'text' }, { weights: { title: 5, description: 1 } });
module.exports = mongoose.model('Product', ProductSchema);
```

---

### `models/Cart.js`

```js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, default: 1, min: 1 },
  priceAtAdd: { type: Number, required: true }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: { type: [CartItemSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);
```

---

### `models/Order.js`

```js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [OrderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created','completed','cancelled'], default: 'completed' },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Order', OrderSchema);
```

---

### `models/Review.js` (optional)

```js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
```

---

### `models/Flag.js` (optional moderation)

```js
const mongoose = require('mongoose');

const FlagSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flag', FlagSchema);
```

---

## Implementation tips (short)

* Protect routes with JWT middleware; assign `req.user`.
* On product edit/delete: check `product.seller.equals(req.user._id)`.
* Use `findOneAndUpdate({ _id, available: true }, { $set: { available: false }})` or a transaction during checkout to avoid race-conditions.
* Text search: use `$text` with sorting by score for `q` param.
* Seed DB with demo users/products for UI demonstration.

---