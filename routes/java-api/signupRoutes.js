const express = require('express');
const routes = express.Router();
const axios = require("axios");

routes.post('/', async (req, res, next) => {
    const user = req.body;
    const {firstName, lastName, email,  password, confirmPassword} = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ 'message': 'First Name, Last Name, Email and Password are required.' });
    }

    try {
        const response = await axios.post(`${process.env.API_URL}/api/signup`, user);

        res.status(201).json(response.data);
    } catch (error)  {
        res.status(error.response.status).json(error.response.data);
    }
});

module.exports = routes;
