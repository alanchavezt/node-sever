const mongoose = require('mongoose');
const { v4: uuidV4 } = require("uuid");

const SkillSchema = new mongoose.Schema({
    id: { type: String, default: uuidV4, required: true, unique: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    skill: { type: String, required: true },
    experience: { type: String }
});

module.exports = mongoose.model('Skill', SkillSchema);
