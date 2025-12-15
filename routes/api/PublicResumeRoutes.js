const express = require('express');
const router = express.Router();
const resumeController = require("../../controllers/ResumeController");

router.route("/resumes/:id")
    .get(resumeController.getResumeById);

module.exports = router;
