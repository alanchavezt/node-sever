const express = require('express');
const routes = express.Router();
const axios = require("axios");

routes.post('/api/users/:id/password', async (req, res)=>{
    const authorization = req.headers.authorization;

    try {
        const userId = req.params.id;
        const createPassword = req.body;
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // user.password = hashedPassword;

        const response = await axios.post(`${process.env.API_URL}/api/users/${userId}/password`, createPassword, {
            headers: {'authorization': authorization}
        });

        // res.status(200);
        res.status(201);
        res.set("Connection", "close");
        res.json(response.data);
    } catch (error)  {
        res.status(500).send();
        res.json("Error occurred!");
    }
});

routes.put('/api/users/:id/password', async (req, res)=>{
    const authorization = req.headers.authorization;

    try {
        const userId = req.params.id;
        const changePassword = req.body;
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // user.password = hashedPassword;

        const response = await axios.put(`${process.env.API_URL}/api/passwords/${userId}`, changePassword, {
            headers: {'authorization': authorization}
        });

        // res.status(200);
        res.status(201);
        res.set("Connection", "close");
        res.json(response.data);
    } catch (error)  {
        // res.status(500).send();
        res.json("Error occurred resetting password!" + error);
    }
});

module.exports = routes;
