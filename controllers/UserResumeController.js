const Resume = require("../models/Resume");
const User = require("../models/User");

const getUserResumes = async (req, res) => {
    try {
        const { id } = req.params; // user UUID
        const requestingUser = req.user; // this should be set by your auth middleware

        // Find the user by UUID
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Authorization check: allow if self or Admin
        const isSelf = requestingUser.id === id;
        const isAdmin = requestingUser.roles.some(role => role.name === "Admin"); // adjust if roles are stored differently
        if (!isSelf && !isAdmin) {
            return res.status(403).json({ message: "You are not authorized to view these resumes." });
        }

        // Fetch resumes by Mongo ObjectId of user
        const resumes = await Resume.find({ user: user._id });

        res.json(resumes);
    } catch (err) {
        console.error("Error fetching user resumes:", err);
        res.status(500).json({ message: "Failed to load user resumes" });
    }
};

module.exports = { getUserResumes };
