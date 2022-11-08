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

const signupRoutes = require('./routes/java-api/signupRoutes');
const authRoutes = require('./routes/java-api/authRoutes');
const userPasswordRoutes = require('./routes/java-api/userPasswordRoutes');
const userRoutes = require('./routes/java-api/userRoutes');
const roleRoutes = require('./routes/java-api/roleRoutes');
const userRolesRoutes = require('./routes/java-api/userRolesRoutes');
const resumeRoutes = require('./routes/java-api/resumeRoutes');


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


/** Middleware that checks if JWT token exists and verifies it if it does exist.
 * In all future routes, this helps to know if the request is authenticated or not. */
app.use( (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue
    next();

    // token = token.replace('Bearer ', '');
    // jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    //     if (err) {
    //         return res.status(401).json({
    //             error: true,
    //             message: "(Unauthorized) Invalid user."
    //         });
    //     } else {
    //         //set the user to req so other routes can use it
    //         req.user = user;
    //         next();
    //     }
    // });
});


// /** request handlers */
app.get('/', (req, res) => {
    if (!req.user) {
        return res.status(401).json({success: false, message: 'Invalid user to access it.'});
    }
    res.send('Welcome to the Node.js! - ' + req.user.name);
});

/** verify the token and return it if it's valid */
app.get('/API/verifyToken', function (req, res) {

    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token;

    if (!token) {
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }

    return res.json({ user: {}, token });

    // check token that was passed by decoding token using secret
    // jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    //     if (err) return res.status(401).json({
    //         error: true,
    //         message: "Invalid token."
    //     });
    //
    //     // todo: retrieve the token from the database and compare tokens
    //     // return 401 status if the userId does not match.
    //     if (user.userId !== userData.userId) {
    //         return res.status(401).json({
    //             error: true,
    //             message: "Invalid user."
    //         });
    //     }
    //
    //     const userObj = utils.getCleanUser(userData);
    //     return res.json({ user: userObj, token });
    // });
});

/** Handling routes request for testing purposes */
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


/** Handling routes request API handlers */
app.use('/API/signup', signupRoutes);
app.use('/API/auth/signin', authRoutes);
app.use(userPasswordRoutes);
app.use(userRolesRoutes);
app.use('/API/roles', roleRoutes);
app.use('/API/users', userRoutes);
app.use('/API', resumeRoutes);

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

app.all('*', (req, res) => {
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
