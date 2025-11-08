const ROLES_LIST = require("../config/roles_list");

const checkSelfOrAdmin = (requestingUser, ownerId) => {
    const isSelf = requestingUser.id === ownerId;
    const isAdmin = requestingUser.roles.some(role => role.name === ROLES_LIST.Admin);

    if (!isSelf && !isAdmin) {
        const error = new Error("You are not authorized to perform this action");
        error.status = 403;
        throw error;
    }
};

module.exports = { checkSelfOrAdmin };
