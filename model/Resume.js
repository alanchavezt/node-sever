const mongoose = require('mongoose');
const { v4: uuidV4 } = require("uuid");

const ResumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },

    summary: { type: String },
    objective: { type: String },

    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certification" }],
    languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],

    skillsHighlight: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Resume", ResumeSchema);
