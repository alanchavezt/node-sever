const Resume = require("../models/Resume");
const Education = require("../models/Education");

const updateEducation = async (req, res) => {
    try {
        const { id } = req.params; // Resume ID
        const educationData = req.body; // array of education objects

        const resume = await Resume.findById(id);
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        // Delete existing education entries that belong to this resume
        await Education.deleteMany({ resume: id });

        // Create new education entries
        const newEducations = await Education.insertMany(
            educationData.map(edu => ({ ...edu, resume: id }))
        );

        // Update resume to reference new education entries
        resume.education = newEducations.map(e => e._id);
        await resume.save();

        // Populate and return updated education
        const updatedResume = await Resume.findById(id).populate("education");
        res.json({ education: updatedResume.education });
    } catch (error) {
        console.error("Error updating education:", error);
        res.status(500).json({ message: "Server error updating education" });
    }
};

module.exports = {
    updateEducation
};
