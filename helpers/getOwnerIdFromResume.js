const Resume = require("../models/Resume");
const User = require("../models/User");

const getOwnerIdFromResume = async (req) => {
    const { id } = req.params;

    // Step 1: Find resume and ensure it exists
    const resume = await Resume.findById(id).select("user");
    if (!resume) {
        const error = new Error("Resume not found");
        error.status = 404;
        throw error;
    }

    // Step 2: Fetch the user referenced by the resume
    const owner = await User.findById(resume.user);
    if (!owner) {
        const error = new Error("Owner user not found");
        error.status = 404;
        throw error;
    }

    // Step 3: Return the UUID (not ObjectId)
    return owner.id;
};

module.exports = getOwnerIdFromResume;
