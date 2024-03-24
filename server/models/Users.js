const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
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
    pfp: {
        type: String,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference to the Post model or another model for posts
    }],
    achievements: [{
        type: String,
        required: true
    }],
    reported: {
        type: Boolean,
        default: false // Set default value to false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the Users model for followers
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the Users model for following
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference to the Post model for saved posts
    }]
});

const UsersModel = mongoose.model('Users', UsersSchema);

module.exports = UsersModel;