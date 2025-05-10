const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); 
const { Parser } = require('json2csv'); // Import json2csv


const app = express();
app.use(cors()); // Use cors
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

mongoose.connect('mongodb://localhost/railway_reservation', { useNewUrlParser: true, useUnifiedTopology: true });


const foodOrderSchema = new mongoose.Schema({
    pnr: String,
    foodItem: String,
    quantity: Number,
    deliveryTime: String,
    totalCost: Number
});
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
  });

const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);
const Contact = mongoose.model('Contact', contactSchema);
////////////////////////////////////////////////


const bookingSchema = new mongoose.Schema({
origin: String,
destination: String,
train: String,
seatType: String,
numSeats: Number,
totalCost: Number,
payId: String,
pnrNumber: String,
cancelled: { type: Boolean, default: false }  // Added cancelled field
});

const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/bookTicket', async (req, res) => {
const booking = new Booking(req.body);
try {
  await booking.save();
  res.status(201).send(booking);
} catch (error) {
  res.status(400).send(error);
}
});

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





    

    ////////////////////////////////////////////////////    
app.post('/order', async (req, res) => {
    try {
        // Extract order details from the request body
        const { pnr, foodItem, quantity, deliveryTime, totalCost } = req.body;

        // Create a new food order instance
        const newOrder = new FoodOrder({
            pnr,
            foodItem,
            quantity,
            deliveryTime,
            totalCost
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with success message
        res.status(201).json({ message: "Food order placed successfully!" });
    } catch (error) {
        // Handle errors
        console.error("Error placing food order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
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
///////contact////
// Define a schema and model for contact details

  
  // API endpoint to handle contact form submission
  app.post('/api/contact', async (req, res) => {
   
  try {
    // Extract order details from the request body
    const {  name,email,subject, message } = req.body;

    // Create a new food order instance
    const contact = new Contact({
        name,
        email,
        subject,
        message
    });
  await contact.save();

  // Respond with success message
  res.status(201).json({ message: "successfully! sended..." });
} catch (error) {
  // Handle errors
  console.error("Error sending info:", error);
  res.status(500).json({ error: "Internal server error" });
   }
  });

/////////////



/////////////////
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
