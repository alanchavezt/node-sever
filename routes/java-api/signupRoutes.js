const express = require('express');
const routes = express.Router();
const axios = require("axios");

routes.post('/', async (req, res, next) => {
    try {
        const user = req.body;
        const response = await axios.post(`${process.env.API_URL}/API/signup`, user);

        res.status(201).json(response.data);
    } catch (error)  {
        res.status(error.response.status).json(error);
    }
});

module.exports = routes;
