const express = require("express");
const userRoleController = require("../../controllers/UserRoleController.js");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

const router = express.Router();

router.route("/:id/roles")
    .get(verifyRoles(ROLES_LIST.Admin), userRoleController.getUserRoles)
    .post(verifyRoles(ROLES_LIST.Admin), userRoleController.updateUserRoles);

router.route("/:id/roles/:roleId")
    .delete(verifyRoles(ROLES_LIST.Admin), userRoleController.removeRoleFromUser);

module.exports = router;