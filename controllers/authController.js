const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    // TODO: FOLLOW UP
    // Want to also track "failed attempts" or "lock accounts"?
    // failedLoginAttempts
    // lockedAt
    // unlockAfter
    // Auto-lockout after X failed attempts
};

module.exports = { handleLogin };
