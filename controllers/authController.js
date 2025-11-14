const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const { createVerificationToken } = require('../helpers/tokens');
const { sendVerificationEmail } = require('../helpers/email');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ "message": "Username and password are required." });

    const foundUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } })
        .populate("roles")
        .exec();

    if (!foundUser) return res.sendStatus(401); //Unauthorized

    // Validate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401);

    // Build user info
    const user = {
        "id": foundUser.id,
        "username": foundUser.username,
        "firstName": foundUser.firstName,
        "lastName": foundUser.lastName,
        "email": foundUser.email
    };

    // Extract the user's roles (as UUIDs or names)
    const roles = foundUser.roles.map(role => ({
        id: role.id,
        name: role.name
    }));

    // Create access token
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser.id,
                "username": foundUser.username,
                "firstName": foundUser.firstName,
                "lastName": foundUser.lastName,
                "email": foundUser.email,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    // --- 🔥 TRACK LOGIN METRICS ---
    foundUser.refreshToken = refreshToken;
    foundUser.lastLoginAt = new Date();
    foundUser.loginCount = (foundUser.loginCount || 0) + 1;

    // Optional: Ensure status is ACTIVE once user logs in
    if (foundUser.status !== "ACTIVE") {
        foundUser.status = "ACTIVE";
    }

    await foundUser.save();

    // Creates Secure Cookie with refresh token
    // Remove secure for testing in insomnia or postman
    // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    // Set cookie (secure for prod)
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000
    });

    // Send authorization roles and access token to user
    res.json({ user, roles, accessToken });

    // TODO: AUTH SECURITY ENHANCEMENTS
    // Add account security tracking:
    //  • failedLoginAttempts (number)
    //  • lockedAt (Date)
    //  • unlockAfter (Date or duration)
    //  • Auto-lockout after X failed attempts
    //  • Reset failedLoginAttempts on successful login
    //  • Log audit events for monitoring suspicious activity
    // ─────────────────────────────────────────────────────────────
};

const verifyEmail = async (req, res) => {
    try {
        const { token, id } = req.query; // or req.body for POST

        if (!token || !id) return res.status(400).json({ message: 'Invalid verification link' });

        const hashed = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by uuid (id) and hashed token and expiry
        const user = await User.findOne({
            id,
            emailVerificationToken: hashed,
            emailVerificationExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Verification link is invalid or has expired' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiresAt = undefined;
        await user.save();

        // Option A: redirect to front-end success page
        // return res.redirect(`${process.env.APP_BASE_URL}/email-verified?status=success`);

        // Option B: return JSON
        res.json({ message: "Email verified" });
    } catch (err) {
        console.error("verifyEmail error", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email required' });

        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

        // Rate limiting: basic cooldown check
        if (user.emailVerificationExpiresAt && user.emailVerificationExpiresAt > Date.now() - 5 * 60 * 1000) {
            // e.g., don't resend more than once per 5 minutes
            return res.status(429).json({ message: 'Too many requests. Try again later.' });
        }

        const { token, hashed } = createVerificationToken();
        user.emailVerificationToken = hashed;
        user.emailVerificationExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_MIN * 60 * 1000);
        await user.save();

        await sendVerificationEmail({ to: user.email, token, userId: user.id, name: user.firstName });

        res.json({ message: 'Verification email sent' });
    } catch (err) {
        console.error("resendVerification", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { handleLogin, verifyEmail, resendVerification };
