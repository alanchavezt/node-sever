const express = require("express");
const userPasswordController = require("../../controllers/UserPasswordController.js");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

const router = express.Router();

router.route("/:id/password")
    // Self-update (any authenticated user, already handled by verifyJWT before reaching here)
    .put(verifyRoles(ROLES_LIST.User),userPasswordController.updatePassword)
    // Admin reset for other users
    .post(verifyRoles(ROLES_LIST.Admin), userPasswordController.resetPassword);

module.exports = router;
