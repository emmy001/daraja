// routes/mpesaRoutes.js

const express = require('express');
const router = express.Router();
const mpesaController = require('../controllers/mpesaController');

// Route for initiating an MPesa payment (sandbox or production)
router.post('/pay', async (req, res) => {
  try {
    const result = await mpesaController.initiatePayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Route for handling MPesa callback response
router.post('/callback', async (req, res) => {
  try {
    const result = await mpesaController.handleMpesaCallback(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error handling callback:", error);
    res.status(500).json({ error: "Callback handling failed" });
  }
});

// Route for payment validation (called by MPesa)
router.post('/validate', async (req, res) => {
  try {
    const result = await mpesaController.validateMpesaPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error validating payment:", error);
    res.status(500).json({ error: "Validation failed" });
  }
});

// Route for payment confirmation (called by MPesa)
router.post('/confirm', async (req, res) => {
  try {
    const result = await mpesaController.confirmMpesaPayment(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Confirmation failed" });
  }
});

// Route for sending an STK Push request
router.post('/stkpush', mpesaController.stkPushRequest);

// Route for registering URLs for C2B
router.get('/register-url', async (req, res) => {
    try {
        const result = await mpesaController.registerUrl(req, res);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error registering URLs:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});


module.exports = router;
