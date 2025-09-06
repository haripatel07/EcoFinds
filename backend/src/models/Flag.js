const mongoose = require('mongoose');

const FlagSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    resolved: { type: Boolean, default: false }
}, { timestamps: true });

FlagSchema.index({ product: 1, reporter: 1 }, { unique: true });

module.exports = mongoose.model('Flag', FlagSchema);
