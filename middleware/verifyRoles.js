const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401); // No roles found (not authenticated)

        // Check if any of the user's roles match allowedRoles
        const hasRole = req.roles.some(role => allowedRoles.includes(role.name));

        if (!hasRole) return res.sendStatus(403); // Forbidden (authenticated but not allowed)

        next();
    }
}

module.exports = verifyRoles
