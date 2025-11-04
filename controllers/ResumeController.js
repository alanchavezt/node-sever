const Resume = require("../models/Resume");
require("../models/Education");

const createResume = async (req, res) => {
    try {
        const resume = new Resume(req.body);
        await resume.save();
        res.status(201).json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().populate("user", "firstName lastName email");
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { populate } = req.query;

        let query = Resume.findById(id);
        if (populate) {
            query = query.populate(populate); // e.g., "education"
        }

        const resume = await query.exec();
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        res.json(resume);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch resume" });
    }
};

const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Basic fields that can be updated
        const fields = [
            "firstName",
            "middleName",
            "lastName",
            "address",
            "phone",
            "email",
            "summary",
            "objective"
        ];

        fields.forEach(field => {
            if (updateData[field] !== undefined) {
                resume[field] = updateData[field];
            }
        });

        const updatedResume = await resume.save();
        res.json(updatedResume);
    } catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({ message: "Server error updating resume" });
    }
};

const deleteResume = async (req, res) => {
    try {
        const deleted = await Resume.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Resume not found" });
        res.json({ message: "Resume deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createResume,
    getAllResumes,
    getResumeById,
    updateResume,
    deleteResume
};
