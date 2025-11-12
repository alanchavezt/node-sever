const ROLES_LIST = require("../config/roles_list");

const verifySelfOrAdmin = (getOwnerIdFromReq) => {
    return async (req, res, next) => {
        try {
            const requestingUser = req.user;
            if (!requestingUser) {
                return res.status(401).json({ message: "Authentication required" });
            }

            const ownerId = await Promise.resolve(getOwnerIdFromReq(req));
            const isSelf = requestingUser.id === ownerId;
            const isAdmin = requestingUser.roles?.some(role => role.name === ROLES_LIST.Admin);


            if (!isSelf && !isAdmin) {
                return res.status(403).json({
                    message: "You are not authorized to perform this action"
                });
            }

            next();
        } catch (err) {
            console.error("Error in verifySelfOrAdmin middleware:", err);
            res.status(500).json({ message: "Internal authorization error" });
        }
    };
};

module.exports = { verifySelfOrAdmin };
