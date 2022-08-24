const express = require('express');
const router = express.Router();
const axios = require("axios");

let config = {
    headers: {
        'authorization': ""
    }
};

router.use( (req, res, next) => {
    // TODO: The bearer is done in the axios interceptors. I have to remove it from here
    config.headers.authorization = `Bearer ${req.headers.authorization}`;
    next();
});

router.route('/')
    .get((req, res) => {
        const url = `${process.env.API_URL}/API/users`;

        axios.get(url, config).then(response => {
            res.status(200).json(response.data);
        }).catch(error => {
            res.json("Error occurred: " + error);
        });
    })
    .post(async (req, res, next)=>{
        const url = `${process.env.API_URL}/API/users`;
        // const user = req.body;

        try {
            const response = await axios.post(url, req.body, config);

            res.status(200).json(response.data);
        } catch (error)  {
            res.json("Error occurred: " + error);
        }
    });

router.route('/:id')
    .get((req, res) => {
        const userId =  req.params.id;
        const url = `${process.env.API_URL}/API/users/${userId}`;

        axios.get(url, config).then(response => {
            res.status(200).json(response.data);
        }).catch(error => {
            res.json("Error occurred!" + error);
        });
    })
    .put(async (req, res)=>{
        const userId = req.params.id;
        const url = `${process.env.API_URL}/API/users/${userId}`;
        // const user = req.body;

        try {
            const response = await axios.put(url, req.body, config);

            res.status(200).json(response.data);
        } catch (error)  {
            res.json("Error occurred!" + error);
        }
    })
    .delete((req, res)=>{
        const userId = req.params.id;
        const url = `${process.env.API_URL}/API/users/${userId}`;

        axios.delete(url, config).then(response => {
            res.status(200).json(response.data);
        }).catch(error => {
            res.json("Error occurred!" + error);
        });
    });

module.exports = router;
