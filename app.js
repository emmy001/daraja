const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());  // Enable CORS for cross-origin requests
app.use(bodyParser.json());  // Enable JSON parsing

// MongoDB Atlas connection
const dbUrl = process.env.DB_URL;
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
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;