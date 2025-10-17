const User = require("../model/User");
const ROLES_LIST = require("../config/roles_list");
const bcrypt = require("bcrypt");

/**
 * Handles user password update.
 * Expected body: { currentPassword, newPassword, confirmPassword }
 */
const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const requestingUser = req.user;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password are required." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match." });
    }

    // Self-update only
    const isSelfUpdate = requestingUser.id === id;
    if (!isSelfUpdate) {
        return res.status(403).json({ message: "You can only change your own password." });
    }

    try {
        const user = await User.findOne({ id }).exec();
        if (!user) return res.status(404).json({ message: "User not found" });

        // If self-update, verify current password
        if (isSelfUpdate) {
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) return res.status(401).json({ message: "Current password is incorrect." });
        }

        // Hash and update password
        const hashedPwd = await bcrypt.hash(newPassword, 10);
        user.password = hashedPwd;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * Admin-only: Reset another user's password.
 * Expected body: { newPassword, confirmPassword }
 */
const resetPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const requestingUser = req.user;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password are required." });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match." });
    }

    // Only admins can reset other users' passwords
    const isAdmin = requestingUser.roles.some(role => role.name === ROLES_LIST.Admin);
    if (!isAdmin) {
        return res.status(403).json({ message: "Only admins can reset user passwords." });
    }

    try {
        const user = await User.findOne({ id }).exec();
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedPwd = await bcrypt.hash(newPassword, 10);
        user.password = hashedPwd;
        await user.save();

        return res.status(200).json({ message: `Password for ${user.email} has been reset successfully.` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { updatePassword, resetPassword };
