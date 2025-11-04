const Resume = require("../models/Resume");
const Experience = require("../models/Experience");

const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const experienceData = req.body;

        const resume = await Resume.findById(id);
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        await Experience.deleteMany({ resume: id });

        const newExperiences = await Experience.insertMany(
            experienceData.map(exp => ({ ...exp, resume: id }))
        );

        resume.experience = newExperiences.map(e => e._id);
        await resume.save();

        const updatedResume = await Resume.findById(id).populate("experience");
        res.json({ experience: updatedResume.experience });
    } catch (error) {
        console.error("Error updating experience:", error);
        res.status(500).json({ message: "Server error updating experience" });
    }
};

module.exports = { updateExperience };
