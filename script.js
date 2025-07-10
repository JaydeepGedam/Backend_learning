const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log the request URL
app.use(function (req, res, next) {
    console.log('Request URL:', req.url);
    next();
});

// Route to handle GET requests to the root URL
app.get('/', (req, res, next) => {
    res.send('Hello, World!');
    // return next(new Error('An error occurred!'));
});

app.get("/profile/:username", (req, res) => {
    const username = req.params.username;
    res.send(`Profile of ${username}`);
});

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);