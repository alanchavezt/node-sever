const Role = require("../model/Role");

const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().sort({ name: 1 });
        if (!roles) return res.status(204).json({ message: 'No roles found' });
        res.json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Role name required' });

        const duplicate = await Role.findOne({ name }).lean().exec();
        if (duplicate) return res.status(409).json({ message: 'Role already exists' });

        const role = await Role.create({ name, description });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: figure out which way to use for finding role, either the _id or id field
        // const role = await Role.findById(id);
        const role = await Role.findOne({ id: id });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // TODO: figure out which way to use for finding role, either the _id or id field
        // const role = await Role.findById(id);
        const role = await Role.findOne({id: id});
        if (!role) return res.status(404).json({ message: 'Role not found' });

        if (name) role.name = name;
        if (description !== undefined) role.description = description;

        const updatedRole = await role.save();
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: figure out which way to use for finding role, either the _id or id field
        // const role = await Role.findById(id);
        const role = await Role.findOne({ id: id });
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // await role.deleteOne();
        await role.deleteOne({ id: id });
        res.json({ message: `Role '${role.name}' deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};