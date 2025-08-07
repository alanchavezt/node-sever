const express = require('express');
const routes = express.Router();
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

routes.get('/getResume', async (req, res) => {
    const filePath = path.join(__dirname, '..', '..', 'data', 'myResumeFile.json');

    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        const resume = JSON.parse(data);
        return res.json(resume);

    } catch (err) {
        console.error(err);
        return res.status(403).json({
            error: true,
            message: "File not found!"
        });
    }
});

routes.post('/writeFile', async (req, res) => {
    const resume = req.body;
    const updatedResume = JSON.stringify(resume);
    const filePath = path.join(__dirname, '..', '..', 'data', 'myResumeFile.json');

    try {
        await fsPromises.writeFile(filePath, updatedResume);
        console.log("File was saved!");
        return res.status(200).json({message: "File was saved!"});
    } catch (err) {
        console.error(err);
    }
});

module.exports = routes;
