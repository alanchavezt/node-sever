const express = require("express");
const router = express.Router();
const resumeController = require("../../controllers/ResumeController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router.route("/")
    .get(verifyRoles(ROLES_LIST.Admin), resumeController.getAllResumes)
    .post(verifyRoles(ROLES_LIST.Admin), resumeController.createResume);

router.route("/:id")
    .get(verifyRoles(ROLES_LIST.Admin), resumeController.getResumeById)
    .put(verifyRoles(ROLES_LIST.Admin), resumeController.updateResume)
    .delete(verifyRoles(ROLES_LIST.Admin), resumeController.deleteResume);

module.exports = router;
