const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { Parser } = require('json2csv');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect("mongodb://kavinkumar:MzCNzvyvfwB4vs6w@ac-xyz-shard-00-00.mongodb.net:27017,ac-xyz-shard-00-01.mongodb.net:27017,ac-xyz-shard-00-02.mongodb.net:27017/myDB?ssl=true&replicaSet=atlas-xxxx-shard-0&authSource=admin
")
");
', {
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.error("❌ Error connecting to MongoDB", err);
});

// SCHEMAS & MODELS

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const bookingSchema = new mongoose.Schema({
    origin: String,
    destination: String,
    train: String,
    seatType: String,
    numSeats: Number,
    totalCost: Number,
    payId: String,
    pnrNumber: String,
    cancelled: { type: Boolean, default: false }
});
const Booking = mongoose.model('Booking', bookingSchema);

const foodOrderSchema = new mongoose.Schema({
    pnr: String,
    foodItem: String,
    quantity: Number,
    deliveryTime: String,
    totalCost: Number
});
const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});
const Contact = mongoose.model('Contact', contactSchema);

// ROUTES

// LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", username);
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

// REGISTER
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

// BOOK TICKET
app.post('/api/bookTicket', async (req, res) => {
    const booking = new Booking(req.body);
    try {
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        res.status(400).send(error);
    }
});

// CANCEL TICKET
app.post('/api/cancelTicket', async (req, res) => {
    const { pnrNumber } = req.body;
    try {
        const booking = await Booking.findOne({ pnrNumber });
        if (booking) {
            if (booking.cancelled) {
                return res.status(400).send({ message: 'Ticket is already canceled' });
            }
            booking.cancelled = true;
            await booking.save();
            res.status(200).send({ message: 'Ticket canceled successfully', pnrNumber });
        } else {
            res.status(404).send({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// FOOD ORDER
app.post('/order', async (req, res) => {
    try {
        const { pnr, foodItem, quantity, deliveryTime, totalCost } = req.body;
        const newOrder = new FoodOrder({ pnr, foodItem, quantity, deliveryTime, totalCost });
        await newOrder.save();
        res.status(201).json({ message: "Food order placed successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// DOWNLOAD REPORT (CSV)
app.get('/downloadReport', async (req, res) => {
    try {
        const tickets = await Booking.find().lean();
        const fields = ['origin', 'destination', 'train', 'seatType', 'numSeats', 'totalCost', 'payId', 'pnrNumber', 'cancelled'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(tickets);
        res.header('Content-Type', 'text/csv');
        res.attachment('booking_report.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// CONTACT FORM
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        res.status(201).json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// SERVER LISTEN
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
