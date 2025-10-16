const User = require('../model/User');
const Role = require('../model/Role');
const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');

const handleNewUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName|| !email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // check for duplicate usernames in the db
        const duplicate = await User.findOne({ email: email }).exec();
        if (duplicate) return res.sendStatus(409); //Conflict

        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // find default USER role
        const defaultRole = await Role.findOne({ name: 'USER' }).exec();
        if (!defaultRole) {
            return res.status(500).json({ message: 'Default USER role not found' });
        }

        // Assign the role using the _id reference
        const roles = [{ _id: defaultRole._id }];

        const newUser = new User({
            id: uuidV4(),
            firstName,
            lastName,
            email,
            password: hashedPwd,
            roles,
        });

        const result = await newUser.save();

        console.log(`✅ User created: ${result.email} (${result.id})`);

        res.status(201).json({
            success: `New user ${email} created!`,
            userId: result.id, // return UUID
        });
    } catch (err) {
        console.error('Error creating new user:', err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = { handleNewUser };
