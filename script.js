const express = require('express');
const app = express();

// Middleware to log the request URL
app.use(function (req, res, next) {
    console.log('Request URL:', req.url);
    next();
});

// Route to handle GET requests to the root URL
app.get('/', (req, res, next) => {
    // res.send('Hello, World!');
    return next(new Error('An error occurred!'));
});

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000);