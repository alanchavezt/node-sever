const mongoose = require('mongoose');
const { v4: uuidV4 } = require("uuid");

const JobDescriptionSchema = new mongoose.Schema({
    id: { type: String, default: uuidV4, required: true, unique: true },
    text: { type: String, required: true }
});

const ExperienceSchema = new mongoose.Schema({
    id: { type: String, default: uuidV4, required: true, unique: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    employer: { type: String, required: true },
    jobTitle: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    state: { type: String },
    city: { type: String },
    jobDescription: [JobDescriptionSchema]
});

module.exports = mongoose.model("Experience", ExperienceSchema);
