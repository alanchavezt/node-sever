const express = require('express');
const routes = express.Router();
const axios = require("axios");

routes.post('/', async (req, res) => {
    // const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // return 400 status if username/password does not exist
    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Username or Password required."
        });
    }

    try {
        const response = await axios.post(`${process.env.API_URL}/API/auth`, {email, password});
        const token = response.data.token;
        const user = response.data.user;
        const roles = response.data.roles;

        return res.json({token, user, roles});
    } catch (error) {
        res.status(401).json({
            error: error,
            message: "Username or Password is Wrong."
        });
    };
});

module.exports = routes;
