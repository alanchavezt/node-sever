const express = require("express");
const router = express.Router();
const resumeController = require("../../controllers/ResumeController");
const resumeEducationController = require("../../controllers/ResumeEducationController");
const resumeExperienceController = require("../../controllers/ResumeExperienceController");
const resumeSkillController = require("../../controllers/ResumeSkillController");
const resumeCertificationController = require("../../controllers/ResumeCertificationController");
const resumeLanguageController = require("../../controllers/ResumeLanguageController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router.route("/")
    .get(verifyRoles(ROLES_LIST.Admin), resumeController.getAllResumes)
    .post(verifyRoles(ROLES_LIST.Admin), resumeController.createResume);

router.route("/:id")
    .get(verifyRoles(ROLES_LIST.Admin), resumeController.getResumeById)
    .put(verifyRoles(ROLES_LIST.Admin), resumeController.updateResume)
    .delete(verifyRoles(ROLES_LIST.Admin), resumeController.deleteResume);

router.route("/:id/education")
    .put(verifyRoles(ROLES_LIST.Admin), resumeEducationController.updateEducation);

router.route("/:id/experience")
    .put(verifyRoles(ROLES_LIST.Admin), resumeExperienceController.updateExperience);

router.route("/:id/skills")
    .put(verifyRoles(ROLES_LIST.Admin), resumeSkillController.updateSkills);

router.route("/:id/certifications")
    .put(verifyRoles(ROLES_LIST.Admin), resumeCertificationController.updateCertifications);

router.route("/:id/languages")
    .put(verifyRoles(ROLES_LIST.Admin), resumeLanguageController.updateLanguages);

module.exports = router;
