const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidV4 } = require("uuid");

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
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email address"]
    },
    username: {
        type: String
        // required: true
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        }
    ],
    password: {
        type: String,
        required: false // Optional for now, we will refactor the password later, since we will use jwt tokens
    },
    refreshToken: String,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
