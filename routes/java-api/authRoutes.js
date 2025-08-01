const express = require("express");
const routes = express.Router();
const axios = require("axios");

routes.post("/", async (req, res) => {
    const { email, password } = req.body;
    const usernameOrEmail = email || req.body.usernameOrEmail;

    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Username and password are required."
        });
    }

    try {
        const response = await axios.post(`${process.env.API_URL}/api/auth`, {
            usernameOrEmail: usernameOrEmail,
            password: password
        });
        const accessToken = response.data.accessToken;
        const user = response.data.user;
        const roles = response.data.roles;

        return res.json({ accessToken, user, roles });
    } catch (error) {
        res.status(401).json({
            error: error,
            message: "Username or Password is Wrong."
        });
    }
    ;
});

module.exports = routes;
