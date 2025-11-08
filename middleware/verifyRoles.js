const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.status(401).json({
                message: "You must be authenticated to access this resource."
            }); // No roles, Not authenticated
        }

        // Check if any of the user's roles match allowedRoles
        const hasRole = req.roles.some(role => allowedRoles.includes(role.name));

        if (!hasRole) {
            return res.status(403).json({
                message: "You do not have the required permissions to access this resource."
            }); // Authenticated but not allowed
        }

        next();
    }
}

module.exports = verifyRoles
