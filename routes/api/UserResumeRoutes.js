const express = require("express");
const router = express.Router();
const userResumeController = require("../../controllers/UserResumeController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router.route("/:id/resumes")
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), userResumeController.getUserResumes)

module.exports = router;