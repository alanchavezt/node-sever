const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const EducationSchema = new mongoose.Schema({
    id: { type: String, default: uuidV4, required: true, unique: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    school: { type: String, required: true },
    degree: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    state: { type: String },
    city: { type: String },
    description: { type: String }
});

module.exports = mongoose.model("Education", EducationSchema);
