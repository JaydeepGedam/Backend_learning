const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crud_project')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("create");
});


app.post('/create', async (req, res) => {
    const { name, email, image } = req.body;
    try {
        const user = new User({ name, email, image });
        await user.save();
        console.log('User saved to MongoDB:', user);
        res.redirect('/users');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Error saving user');
    }
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users', { users });
});

app.get('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.redirect('/users');
});

app.get('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('edit', { user });
});

app.post('/edituser/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, image } = req.body;
    await User.findByIdAndUpdate(userId, { name, email, image });
    res.redirect('/users');
});

app.listen(3000);