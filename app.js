const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');
const mpesaRoutes = require('./routes/mpesaRoutes');

const app = express();

// Middleware
app.use(cors());  // Enable CORS for cross-origin requests
app.use(bodyParser.json());  // Enable JSON parsing

// Use M-Pesa routes
app.use('/api/mpesa', mpesaRoutes);

// MongoDB Atlas connection
const dbUrl = process.env.DB_URL || process.env.MONGODB_URI;
const connectionParams = {
    // Additional connection options can be added if needed
};

mongoose
    .connect(dbUrl, connectionParams)
    .then(() => {
        console.info("Connected to MongoDB Atlas");
    })
    .catch((e) => {
        console.error("MongoDB connection error:", e);
    });

// API routes
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);

// Start the HTTP server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on HTTP on port ${PORT}`);
});

module.exports = app;
