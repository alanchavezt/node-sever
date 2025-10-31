const Resume = require("../models/Resume");

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
        const resumes = await Resume.find()
            .populate("user", "firstName lastName email")
            // .populate("education")
            // .populate("experience")
            // .populate("skills")
            // .populate("certifications")
            // .populate("languages");
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id)
            .populate("user", "firstName lastName email")
            // .populate("education")
            // .populate("experience")
            // .populate("skills")
            // .populate("certifications")
            // .populate("languages");

        if (!resume) return res.status(404).json({ message: "Resume not found" });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateResume = async (req, res) => {
    try {
        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate("user")
            // .populate("education")
            .populate("experience")
            .populate("skills")
            .populate("certifications")
            .populate("languages");

        if (!updatedResume) return res.status(404).json({ message: "Resume not found" });
        res.json(updatedResume);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    deleteResume,
};
