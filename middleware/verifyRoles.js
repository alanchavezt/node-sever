const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401); // No roles found

        // Check if any of the user's roles match allowedRoles
        const hasRole = req.roles.some(role => allowedRoles.includes(role.name));

        if (!hasRole) return res.sendStatus(401); // Unauthorized

        next();
    }
}

module.exports = verifyRoles
