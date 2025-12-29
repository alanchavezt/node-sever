const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Authorization header missing",
            code: "AUTH_HEADER_MISSING"
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Invalid authorization header format",
            code: "AUTH_HEADER_INVALID"
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    error: "Token expired",
                    code: "TOKEN_EXPIRED"
                });
            }

            return res.status(401).json({
                error: "Invalid token",
                code: "TOKEN_INVALID"
            });
        }

        // Validate payload shape (defensive)
        if (!decoded?.UserInfo) {
            return res.status(403).json({
                error: "Token payload missing user information",
                code: "TOKEN_PAYLOAD_INVALID"
            });
        }

        req.user = decoded.UserInfo;
        req.roles = decoded.UserInfo.roles || [];

        next();
    });
};

module.exports = verifyJWT;
