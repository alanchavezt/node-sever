const axios = require("axios");

let config = {headers: {'authorization': ""}};

const getAllUsers = async (req, res) => {
    config.headers.authorization = req.headers.authorization;

    const url = `${process.env.API_URL}/API/users`;
    const response = await axios.get(url, config);
    const users = response?.data;

    if (!users) return res.status(204).json({ 'message': 'No users found.' });

    res.status(200).json(users);
}

const createNewUser = async (req, res) => {
    if (!req?.body?.username || !req?.body?.firstName || !req?.body?.lastName || !req?.body?.email) {
        return res.status(400).json({ 'message': 'Username, first and last names, and email are required' });
    }

    config.headers.authorization = req.headers.authorization;

    const url = `${process.env.API_URL}/API/users`;

    try {
        const response = await axios.post(url, req.body, config);
        const user = response?.data;

        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.json(err.stack);
    }
}

const updateUser = async (req, res) => {
    // if (!req?.body?.id) {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    config.headers.authorization = req.headers.authorization;

    const userId = req.params.id;
    const url = `${process.env.API_URL}/API/users/${userId}`;

    try {
        const response = await axios.put(url, req.body, config);
        const user = response?.data;

        res.json(user);
    } catch (err)  {
        res.json(err.stack);
    }
}

const deleteUser = async (req, res) => {
    // if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    config.headers.authorization = req.headers.authorization;

    const userId = req.params.id;
    const url = `${process.env.API_URL}/API/users/${userId}`;

    try {
        const response = await axios.delete(url, config);
        const data = response?.data;

        res.json(data);
    } catch (err)  {
        res.json(err);
    }
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    config.headers.authorization = req.headers.authorization;

    const userId =  req.params.id;
    const url = `${process.env.API_URL}/API/users/${userId}`;

    try {
        const response = await axios.get(url, config);
        const user = response?.data;

        res.json(user);
    } catch (err)  {
        res.json(err);
    }
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}
