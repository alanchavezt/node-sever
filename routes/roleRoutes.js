const express = require('express');
const routes = express.Router();
const axios = require("axios");



routes.get('/', (req, res) => {
    const authorization = "Bearer " + req.headers.authorization;

    axios.get(`${process.env.API_URL}/API/roles`,{
        headers: {'authorization': authorization}
    }).then(response => {
        res.status(200);
        res.set("Connection", "close");
        res.json(response.data);
    }).catch(error => {
        res.json("Error occurred: " + error);
    });
});

routes.get('/:id', (req, res) => {
    const roleId =  req.params.id;
    const authorization = "Bearer " + req.headers.authorization;

    axios.get(`${process.env.API_URL}/API/roles/${roleId}`, {
        headers: {'authorization': authorization}
    }).then(response => {
        res.status(200);
        res.set("Connection", "close");
        res.json(response.data);
    }).catch(error => {
        res.json("Error occurred!")
    });
});

routes.post('/', async (req, res, next) => {
    const authorization = "Bearer " + req.headers.authorization;

    try {
        const role = req.body;
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // user.password = hashedPassword;

        const response = await axios.post(`${process.env.API_URL}/API/roles`, role, {
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

routes.put('/:id', async (req, res)=>{
    const authorization = "Bearer " + req.headers.authorization;

    try {
        const roleId = req.params.id;
        const role = req.body;
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // user.password = hashedPassword;

        const response = await axios.put(`${process.env.API_URL}/API/roles/${roleId}`, role, {
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

routes.delete('/:id', (req, res)=>{
    const roleId = req.params.id;
    const authorization = "Bearer " + req.headers.authorization;

    axios.delete(`${process.env.API_URL}/API/roles/${roleId}`, {
        headers: {'authorization': authorization}
    }).then(response => {
        res.status(200);
        res.set("Connection", "close");
        res.json(response.data);
    }).catch(error => {
        res.json("Error occurred!")
    });
});

module.exports = routes;
