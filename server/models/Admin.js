//Admin.js

const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of usernames
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure uniqueness of emails
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'superadmin'], // Enumerate possible roles
        default: 'admin' // Default role
    }
});

const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = AdminModel;
