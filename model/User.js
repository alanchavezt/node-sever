const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidV4 } = require('uuid');

const userSchema = new Schema({
    id: {
        type: String,
        default: uuidV4,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        // required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Staff: Number,
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);
