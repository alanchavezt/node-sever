const express = require("express");
const userPasswordController = require("../../controllers/userPasswordController.js");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

const router = express.Router();

router.route("/:id/password")
    .put(verifyRoles(ROLES_LIST.Admin), userPasswordController.updatePassword);

module.exports = router;
