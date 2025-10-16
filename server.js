require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');
const bodyParser = require('body-parser');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require("./middleware/credentials");
const connectDB = require('./config/dbConn');

const userPasswordRoutes = require('./routes/java-api/userPasswordRoutes');
const roleRoutes = require('./routes/java-api/roleRoutes');
const userRolesRoutes = require('./routes/java-api/userRolesRoutes');
const resumeRoutes = require('./routes/api/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
// const API = process.env.API_URL || "http://localhost:8080";

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// enable Cross Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// middleware for cookies
app.use(cookieParser());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

/** Handling routes request for testing purposes */
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


/** Handling routes request API handlers */
app.use(userPasswordRoutes);
app.use(userRolesRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api', resumeRoutes);

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/roles', require('./routes/api/roleRoutes'));
app.use('/users', require('./routes/api/userRoutes'));
app.use('/users', require('./routes/api/userPasswordRoutes'));

app.all(/.*/, (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

/** Error-handling middleware */
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
