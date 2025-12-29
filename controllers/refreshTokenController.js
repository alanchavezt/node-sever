const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).populate("roles").exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username || foundUser.email !== decoded.email) return res.sendStatus(403);
            const user = {
                "id": foundUser.id,
                "firstName": foundUser.firstName,
                "lastName": foundUser.lastName,
                "email": foundUser.email,
                "username": foundUser.username
            };
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser.id,
                        "firstName": decoded.firstName,
                        "lastName": decoded.lastName,
                        "email": decoded.email,
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({ user, roles, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }
