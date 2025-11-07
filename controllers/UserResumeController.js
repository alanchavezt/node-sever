const Resume = require("../models/Resume");
const User = require("../models/User");

const getUserResumes = async (req, res) => {
    try {
        const { id } = req.params; // user UUID

        // Find the user by UUID
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch resumes by Mongo ObjectId of user
        const resumes = await Resume.find({ user: user._id });

        res.json(resumes);
    } catch (err) {
        console.error("Error fetching user resumes:", err);
        res.status(500).json({ message: "Failed to load user resumes" });
    }
};

module.exports = { getUserResumes };
