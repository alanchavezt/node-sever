const User = require("../model/User");
const Role = require("../model/Role");

const getUserRoles = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ id }).populate("roles").exec();
        if (!user) return res.status(404).json({ message: "User not found." });
        res.status(200).json(user.roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUserRoles = async (req, res) => {
    const { id } = req.params;
    const { roleIds } = req.body; // Expecting an array of role UUIDs

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
        return res.status(400).json({ message: "Please provide at least one role." });
    }

    try {
        // Fetch user and populate roles
        const user = await User.findOne({ id }).populate("roles");
        if (!user) return res.status(404).json({ message: "User not found." });

        // Validate that all roleIds exist
        const roles = await Role.find({ id: { $in: roleIds } });
        if (roles.length !== roleIds.length) {
            return res.status(404).json({ message: "One or more roles not found." });
        }

        // Replace user's roles with the selected ones
        user.roles = roles.map(r => r._id);
        await user.save();

        res.status(200).json({ message: "User roles updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};



const removeRoleFromUser = async (req, res) => {
    const { id, roleId } = req.params;

    try {
        const user = await User.findOne({ id }).populate("roles");
        if (!user) return res.status(404).json({ message: "User not found." });

        // Check if the role is assigned to the user
        const roleExists = user.roles.some(r => r.id === roleId);
        if (!roleExists) {
            return res.status(404).json({ message: "Role not assigned to this user." });
        }

        // Remove the role
        user.roles = user.roles.filter(r => r.id !== roleId);
        await user.save();

        res.status(200).json({ message: "Role removed from user." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getUserRoles,
    updateUserRoles,
    removeRoleFromUser
};
