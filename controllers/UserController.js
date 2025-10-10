const User = require("../model/User");
const Role = require("../model/Role");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ "message": "No users found" });
    res.json(users);
};

const createNewUser = async (req, res) => {
    try {
        const { username, firstName, middleName, lastName, email, roles } = req.body;

        if (!username || !firstName || !lastName || !email || !roles?.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check for duplicate username or email
        const duplicate = await User.findOne({
            $or: [{ username }, { email }]
        }).exec();

        if (duplicate) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Ensure all role IDs exist
        const roleIds = roles.map(r => r.id);
        const roleDocs = await Role.find({ id: { $in: roleIds } }).exec();

        if (roleDocs.length !== roles.length) {
            return res.status(400).json({ message: "Some roles do not exist" });
        }

        const roleObjectIds = roleDocs.map(r => r._id);

        // 👇 Generate a random temporary password
        // const tempPassword = Math.random().toString(36).slice(-8);
        const tempPassword = "Alan123!";
        const hashedPwd = await bcrypt.hash(tempPassword, 10);

        const userObject = {
            username,
            firstName,
            middleName,
            lastName,
            email,
            roles: roleObjectIds,
            password: hashedPwd,
            active: true
        };

        const newUser = await User.create(userObject);

        await newUser.populate("roles");

        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            roles: newUser.roles.map(r => ({ id: r.id, name: r.name }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "User ID required" });

    // TODO: figure out which way to use for finding user, either the _id or id field
    // const user = await User.findOne({ _id: req.params.id }).exec();
    const user = await User.findOne({ id: req.params.id }).populate("roles");
    if (!user) {
        return res.status(204).json({ "message": `User ID ${req.params.id} not found` });
    }

    res.json(user);
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, firstName, middleName, lastName, email, roles, active } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID required" });
        }

        // Validate at least one field to update
        if (!username && !firstName && !lastName && !email && !roles && active === undefined) {
            return res.status(400).json({ message: "No update data provided" });
        }

        // Find user by UUID-based id
        const user = await User.findOne({ id }).exec();

        if (!user) {
            return res.status(404).json({ message: `User ID ${id} not found` });
        }

        if (username) user.username = username;
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (typeof active === "boolean") user.active = active;

        // Handle roles (if provided)
        if (Array.isArray(roles)) {
            // Support both [{ id: 'uuid' }] and ['uuid'] formats
            const roleIds = roles.map(r => (typeof r === 'string' ? r : r.id));
            const roleDocs = await Role.find({ id: { $in: roleIds } }).exec();

            if (roleDocs.length !== roleIds.length) {
                return res.status(400).json({ message: 'Some roles do not exist' });
            }

            user.roles = roleDocs.map(r => r._id);
        }

        const updatedUser = await user.save();
        await updatedUser.populate('roles');

        const formattedUser = {
            id: updatedUser.id,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            middleName: updatedUser.middleName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            active: updatedUser.active,
            roles: updatedUser.roles.map(r => ({
                id: r.id,
                name: r.name
            }))
        };

        res.json(formattedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ "message": "User ID required" });
        }

        const user = await User.findOne({ id: id }).exec();

        if (!user) {
            return res.status(204).json({ "message": `User ID ${req.body.id} not found` });
        }

        // TODO: figure out which way to use for deleting user, either the _id or id field
        // const result = await user.deleteOne();
        await user.deleteOne({ id: id });

        res.json({ message: `User ID ${id} deleted successfully` });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllUsers,
    createNewUser,
    getUser,
    updateUser,
    deleteUser
};
