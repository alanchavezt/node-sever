const User = require("../models/User");
const Resume = require("../models/Resume");
const Education = require("../models/Education");
const Experience = require("../models/Experience");
const Skill = require("../models/Skill");
const Certification = require("../models/Certification");
const Language = require("../models/Language");
require("../models/Education");

const createResume = async (req, res) => {
    try {
        const userUuid = req.body.userId;
        const user = await User.findOne({ id: userUuid });
        if (!user) {
            return res.status(404).json({ message: `User with ID ${userUuid} not found` });
        }

        const resume = new Resume({
            user: user._id,
            firstName: user.firstName,
            middleName: user.middleName || "",
            lastName: user.lastName,
            email: user.email,
            summary: "",
            objective: "",
            skillsHighlight: "",
            education: [],
            experience: [],
            skills: [],
            certifications: [],
            languages: []
        });

        await resume.save();
        res.status(201).json(resume);
    } catch (err) {
        console.error("Error creating resume:", err);
        res.status(500).json({ message: "Server error while creating resume" });
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
        } else {
            query = query
                .populate("education")
                .populate("experience")
                .populate("skills")
                .populate("certifications")
                .populate("languages");
        }

        const resume = await query.exec();
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        res.json(resume);
    } catch (err) {
        console.error("Error in getResumeById:", err);

        if (err.status && err.message) {
            return res.status(err.status).json({ message: err.message });
        }

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
        const { id } = req.params;

        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        await Promise.all([
            Education.deleteMany({ _id: { $in: resume.education } }),
            Experience.deleteMany({ _id: { $in: resume.experience } }),
            Skill.deleteMany({ _id: { $in: resume.skills } }),
            Certification.deleteMany({ _id: { $in: resume.certifications } }),
            Language.deleteMany({ _id: { $in: resume.languages } }),
        ]);

        await resume.deleteOne();
        res.json({ message: "Resume and all related data deleted successfully" });
    } catch (err) {
        console.error("Error deleting resume:", err);
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
