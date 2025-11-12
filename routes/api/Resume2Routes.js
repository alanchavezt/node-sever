const express = require("express");
const router = express.Router();
const resumeController = require("../../controllers/ResumeController");
const resumeEducationController = require("../../controllers/ResumeEducationController");
const resumeExperienceController = require("../../controllers/ResumeExperienceController");
const resumeSkillController = require("../../controllers/ResumeSkillController");
const resumeCertificationController = require("../../controllers/ResumeCertificationController");
const resumeLanguageController = require("../../controllers/ResumeLanguageController");
const verifyRoles = require("../../middleware/verifyRoles");
const { verifySelfOrAdmin } = require("../../middleware/verifySelfOrAdmin");
const getOwnerIdFromResume = require("../../helpers/getOwnerIdFromResume");
const ROLES_LIST = require("../../config/roles_list");

router.route("/")
    .get(verifyRoles(ROLES_LIST.Admin), resumeController.getAllResumes)
    .post(verifyRoles(ROLES_LIST.Admin), resumeController.createResume);

router.route("/:id")
    .get(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeController.getResumeById
    )
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeController.updateResume
    )
    .delete(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeController.deleteResume
    );

router.route("/:id/education")
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeEducationController.updateEducation
    );

router.route("/:id/experience")
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeExperienceController.updateExperience
    );

router.route("/:id/skills")
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeSkillController.updateSkills
    );

router.route("/:id/certifications")
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeCertificationController.updateCertifications
    );

router.route("/:id/languages")
    .put(
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User),
        verifySelfOrAdmin(getOwnerIdFromResume),
        resumeLanguageController.updateLanguages
    );

module.exports = router;
