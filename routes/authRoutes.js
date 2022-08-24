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

        // const userObj = utils.getCleanUser(user);
        return res.json({user, token});

        // return 401 status if the credential does not match.
        // if(await bcrypt.compare(req.body.password, user.password)) {
        //     res.status(200);
        //     res.set("Connection", "close");
        //
        //     // todo save token in the database
        //     // generate token, get basic user details and return the token along with user details
        //     const token = utils.generateToken(user);
        //     const userObj = utils.getCleanUser(user);
        //     return res.json({user: userObj, token});
        // } else {
        //     return res.status(401).json({
        //         error: true,
        //         message: "Username or Password is Wrong."
        //     });
        // }
    } catch (error) {
        res.status(500);
        res.json("Error occurred: " + error);
    };
});

module.exports = routes;
