const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const itemRoutes = require('./routes/items');

const app = express();
app.use(cors());  // Enable CORS for cross-origin requests
app.use(bodyParser.json());  // Enable JSON parsing

// MongoDB Atlas connection
const dbUrl = "mongodb+srv://jaymobikes:%23Child001@jaymobikes.61s63.mongodb.net/?retryWrites=true&w=majority&appName=jaymobikes"; // Replace with your actual MongoDB URI
const connectionParams = {
    /*useNewUrlParser: true,
    useUnifiedTopology: true,*/
};

mongoose
    .connect(dbUrl, connectionParams)
    .then(() => {
        console.info("Connected to the database");
    })
    .catch((e) => {
        console.error("Error:", e);
    });

// API routes
app.use('/api/items', itemRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;