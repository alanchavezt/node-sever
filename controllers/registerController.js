const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const { v4: uuidV4 } = require("uuid");
const { createVerificationToken } = require("../helpers/tokens");
const { sendVerificationEmail } = require("../helpers/email");

const VERIFICATION_TOKEN_EXPIRES_MIN = process.env.VERIFICATION_TOKEN_EXPIRES_MIN ? Number(process.env.VERIFICATION_TOKEN_EXPIRES_MIN) : 60 * 24; // 24h

const handleNewUser = async (req, res) => {
    let { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) return res.status(400).json({ "message": "Username and password are required." });

    try {
        // Normalize email (make it lowercase)
        email = email.trim().toLowerCase();

        // check for duplicate usernames in the db
        const duplicate = await User.findOne({ email: email }).exec();
        if (duplicate) return res.sendStatus(409); //Conflict

        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // find default USER role
        const defaultRole = await Role.findOne({ name: "USER" }).exec();
        if (!defaultRole) {
            return res.status(500).json({ message: "Default USER role not found" });
        }

        // Assign the role using the _id reference
        const roles = [{ _id: defaultRole._id }];

        // derive username from email (everything before '@')
        const username = email.split("@")[0];

        // Create and save the user
        const newUser = new User({
            id: uuidV4(),
            username,
            firstName,
            lastName,
            email,
            password: hashedPwd,
            roles,
            active: true
        });

        const savedUser = await newUser.save();

        const { token, hashed } = createVerificationToken();
        savedUser.emailVerificationToken = hashed;
        savedUser.emailVerificationExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_MIN * 60 * 1000);
        await savedUser.save();

        // Send verification email (async)
        try {
            await sendVerificationEmail({
                to: savedUser.email,
                token,
                userId: savedUser.id,
                name: savedUser.firstName
            });
        } catch (err) {
            console.error("Failed to send verification email", err);
        }

        console.log(`✅ User created: ${savedUser.email} (${savedUser.id})`);

        res.status(201).json({
            success: `New user ${email} created!`,
            userId: savedUser.id
        });
    } catch (err) {
        console.error("Error creating new user:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
