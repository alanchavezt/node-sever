const express = require('express');
const routes = express.Router();
const axios = require("axios");

routes.get('/API/users/:id/roles', (req, res) => {
    const userId =  req.params.id;
    const authorization = req.headers.authorization;

    axios.get(`${process.env.API_URL}/API/users/${userId}/roles`, {
        headers: {'authorization': authorization}
    }).then(response => {
        res.status(200);
        res.set("Connection", "close");
        res.json(response.data);
    }).catch(error => {
        res.json("Error occurred!")
    });
});

routes.post('/API/users/:id/roles', async (req, res, next)=>{
    const authorization = req.headers.authorization;
    const userId =  req.params.id;
    const role = req.body;

    try {
        const response = await axios.post(`${process.env.API_URL}/API/users/${userId}/roles`, role, {
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

routes.delete('/API/users/:userId/roles/:roleId', async (req, res) => {
    if (!req?.params?.userId || !req?.params?.roleId) return res.status(400).json({ 'message': 'User ID and Role Id are required.' });

    const { userId, roleId} = req.params;
    const url = `${process.env.API_URL}/API/users/${userId}/roles/${roleId}`;

    try {
        const response = await axios.delete(url, {
            headers: {'authorization': req.headers.authorization}
        });
        const data = response?.data;

        res.json(data);
    } catch (err)  {
        res.json(err);
    }
});

module.exports = routes;
