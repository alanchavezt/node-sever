const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ email: email }).populate('roles').exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const user = {
            "id": foundUser.id,
            "username": foundUser.username,
            "firstName": foundUser.firstName,
            "lastName": foundUser.lastName,
            "email": foundUser.email,
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
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        console.log(result);
        console.log(user);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // for testing in insomnia or postman
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // for production use

        // Send authorization roles and access token to user
        res.json({ user, roles, accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
