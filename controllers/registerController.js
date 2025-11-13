const User = require('../models/User');
const Role = require('../models/Role');
const Resume = require("../models/Resume");
const bcrypt = require('bcrypt');
const { v4: uuidV4 } = require('uuid');

const handleNewUser = async (req, res) => {
    let { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName|| !email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {
        // Normalize email (make it lowercase)
        email = email.trim().toLowerCase();

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

        // derive username from email (everything before '@')
        const username = email.split('@')[0];

        // Create and save the user
        const newUser = new User({
            id: uuidV4(),
            username,
            firstName,
            lastName,
            email,
            password: hashedPwd,
            roles,
            active: true
        });

        const savedUser = await newUser.save();

        // Automatically create an empty resume for the user
        const newResume = await Resume.create({
            user: savedUser._id,
            firstName: savedUser.firstName,
            middleName: savedUser.middleName || "",
            lastName: savedUser.lastName,
            email: savedUser.email,
            summary: "",
            objective: "",
            education: [],
            experience: [],
            skills: [],
            certifications: [],
            languages: [],
            skillsHighlight: ""
        });

        console.log(`✅ User created: ${savedUser.email} (${savedUser.id})`);
        console.log(`📝 Resume created for user: ${savedUser.email} (resume id: ${newResume._id})`);

        res.status(201).json({
            success: `New user ${email} created!`,
            userId: savedUser.id,
            resumeId: newResume._id
        });
    } catch (err) {
        console.error('Error creating new user:', err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = { handleNewUser };
