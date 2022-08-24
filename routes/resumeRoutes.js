const express = require('express');
const routes = express.Router();
const path = require("path");
const fs = require("fs");

routes.get('/getResume', (req, res) => {
    const filePath = path.join(__dirname, '../data/myResumeFile.json')

    fs.readFile(filePath, 'utf8' , (err, data) => {
        if (err) {
            console.error(err);
            return res.status(403).json({
                error: true,
                message: "File not found!"
            });
        }

        const resume = JSON.parse(data);
        return res.json(resume);
    })
});

routes.post('/writeFile', async (req, res) => {
    const authorization = "Bearer " + req.headers.authorization;
    const resume = req.body;
    const updatedResume = JSON.stringify(resume);
    const filePath = path.join(__dirname, '../data/myResumeFile.json')

    // TODO figure out how to use the file system library with React
    fs.writeFile(filePath, updatedResume, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
});

module.exports = routes;
