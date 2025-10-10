const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const createNewUser = async (req, res) => {
    try {
        const { username, firstName, middleName, lastName, email, roles } = req.body;

        if (!username || !firstName || !lastName || !email || !roles?.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check for duplicate username or email
        const duplicate = await User.findOne({
            $or: [{ username }, { email }]
        }).exec();

        if (duplicate) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 👇 Generate a random temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPwd = await bcrypt.hash(tempPassword, 10);

        const userObject = {
            username,
            firstName,
            middleName,
            lastName,
            email,
            roles,
            password: hashedPwd,
            active: true
        };

        const newUser = await User.create(userObject);

        res.status(201).json({
            id: newUser.id,
            username: newUser.username
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });

    // TODO: figure out which way to use for finding user, either the _id or id field
    // const user = await User.findOne({ _id: req.params.id }).exec();
    const user = await User.findOne({ id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }

    res.json(user);
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, firstName, middleName, lastName, email, roles, active } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required' });
    }

    // Validate at least one field to update
    if (!username && !firstName && !lastName && !email && !roles && active === undefined) {
        return res.status(400).json({ message: 'No update data provided' });
    }

    // TODO: Need to find the user by the id field, not _id, since that's what is being passed in, and figure out why _id is not being used or how to make it be used
    // const user = await User.findById(id).exec();
    const user = await User.findOne({ id: id }).exec();

    if (!user) {
        return res.status(404).json({ message: `User ID ${id} not found` });
    }

    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (middleName) user.middleName = middleName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (Array.isArray(roles)) user.roles = roles;
    if (typeof active === 'boolean') user.active = active;

    const updatedUser = await user.save();

    const formattedUser = {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        roles: updatedUser.roles,
        active: updatedUser.active
    };

    res.json(formattedUser);
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ "message": 'User ID required' });
        }

        const user = await User.findOne({ id: id }).exec();

        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
        }

        // TODO: figure out which way to use for deleting user, either the _id or id field
        // const result = await user.deleteOne();
        await user.deleteOne({ id: id });

        res.json({ message: `User ID ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    getUser,
    updateUser,
    deleteUser
}
