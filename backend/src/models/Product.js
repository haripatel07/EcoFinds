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
    condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'], default: 'Good' },
    location: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
});

ProductSchema.index({ title: 'text', description: 'text' }, { weights: { title: 5, description: 1 } });
module.exports = mongoose.model('Product', ProductSchema);
