const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://kavinkumar:MzCNzvyvfwB4vs6w@railwaydevops.uuwjlpj.mongodb.net/?retryWrites=true&w=majority&appName=railwaydevops', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDBAtlas ");
}).catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Received login request with username:", username, "and password:", password);

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            console.log("User found:", user);
            res.status(200).send('Login successful');
        } else {
            console.log("No matching user found");
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Internal server error');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log("Received registration request with username:", username, "and password:", password);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
