const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidV4 } = require("uuid");

const roleSchema = new Schema({
    id: {
        type: String,
        default: uuidV4,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
