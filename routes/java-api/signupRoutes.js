const express = require('express');
const routes = express.Router();
const axios = require("axios");

routes.post('/', async (req, res, next) => {
    try {
        const user = req.body;
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // user.password = hashedPassword;

        const response = await axios.post(`${process.env.API_URL}/API/signup`, user);

        // res.status(200);
        res.status(201).json(response.data);
    } catch (error)  {
        res.json("Error occurred!" + error);
    }
});

module.exports = routes;
