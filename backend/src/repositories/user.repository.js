const User = require('../models/User');

async function findById(id) { return User.findById(id); }
async function save(user) { return user.save(); }

module.exports = { findById, save };
