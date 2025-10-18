const mongoose = require("mongoose");
const { v4: uuidV4 } = require("uuid");

const CertificationSchema = new mongoose.Schema({
    id: { type: String, default: uuidV4, required: true, unique: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
    name: { type: String, required: true },
    issuedBy: { type: String },
    issueDate: { type: String },
    expirationDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Certification", CertificationSchema);
