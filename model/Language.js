const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const LanguageSchema = new mongoose.Schema({
    id: { type: String, default: uuidV4, required: true, unique: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    name: { type: String, required: true },
    proficiency: { type: String }, // e.g. "Native", "Fluent", "Intermediate"
}, { timestamps: true });

module.exports = mongoose.model("Language", LanguageSchema);
