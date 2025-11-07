const Certification = require("../models/Certification");
const Resume = require("../models/Resume");

const updateCertifications = async (req, res) => {
    try {
        const { id } = req.params; // resume id
        const certificationsData = req.body; // array of certifications

        const resume = await Resume.findById(id);
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        // Remove old certifications linked to this resume
        await Certification.deleteMany({ resume: id });

        // Create new certifications
        const createdCertifications = await Certification.insertMany(
            certificationsData.map(cert => ({ ...cert, resume: id }))
        );

        // Update resume with new certification references
        resume.certifications = createdCertifications.map(cert => cert._id);
        await resume.save();

        res.json({ certifications: createdCertifications });
    } catch (error) {
        console.error("Error updating certifications:", error);
        res.status(500).json({ message: "Failed to update certifications" });
    }
};

module.exports = { updateCertifications };
