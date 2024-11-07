
// controllers/mpesaController.js

const axios = require('axios');
const moment = require("moment");
const { getMpesaAccessToken } = require('../utils/mpesaAuth');
const { Item } = require('../models/Item');
const fs = require("fs");

// Initiate a payment request for testing purposes
exports.initiatePayment = async (req, res) => {
    const { id, amount, phoneNumber } = req.body;

    if (!id || !amount || !phoneNumber) {
        return res.status(400).json({ message: 'Missing required fields: id, amount, phoneNumber' });
    }

    try {
        const accessToken = await getMpesaAccessToken();

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
            {
                ShortCode: process.env.PAYBILL_SHORTCODE,
                CommandID: 'CustomerPayBillOnline',
                Amount: amount,
                Msisdn: phoneNumber,
                BillRefNumber: id
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        res.status(200).json({ message: 'Payment initiated', data: response.data });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ message: 'Error initiating payment', error: error.message });
    }
};

// Handle M-Pesa payment callback
exports.handleMpesaCallback = async (req, res) => {
    try {
        console.log("Received callback data:", JSON.stringify(req.body, null, 2));

        const { Body: { stkCallback: { CallbackMetadata: { Item } = [] } = {} } = {} } = req.body;

        if (!Item || Item.length === 0) {
            return res.status(400).json({ message: 'Callback metadata items are missing or empty' });
        }

        const amountItem = Item.find(item => item.Name === "Amount");
        const billRefItem = Item.find(item => item.Name === "BillRefNumber");

        if (!amountItem || !billRefItem) {
            return res.status(400).json({ message: 'Callback data missing required fields' });
        }

        const TransAmount = amountItem.Value;
        const BillRefNumber = billRefItem.Value;

        const item = await Item.findOneAndUpdate(
            { id: BillRefNumber },
            { $inc: { total_paid: TransAmount } },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Payment processed successfully', item });
    } catch (error) {
        console.error("Error processing payment callback:", error);
        res.status(500).json({ message: 'Failed to update item', error: error.message });
    }
};

// Confirm and update payment details in MongoDB
exports.confirmMpesaPayment = async (req, res) => {
    try {
        const { TransAmount, BillRefNumber } = req.body;

        if (!TransAmount || !BillRefNumber) {
            return res.status(400).json({ ResultCode: 1, ResultDesc: 'Missing required fields: TransAmount, BillRefNumber' });
        }

        const item = await Item.findOneAndUpdate(
            { id: BillRefNumber },
            { $inc: { total_paid: TransAmount } },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ ResultCode: 1, ResultDesc: 'Item not found' });
        }

        res.status(200).json({ ResultCode: 0, ResultDesc: 'Confirmation received successfully' });
    } catch (error) {
        console.error("Error in payment confirmation:", error);
        res.status(500).json({ ResultCode: 1, ResultDesc: 'Error processing confirmation' });
    }
};

// Validate incoming payment
exports.validateMpesaPayment = async (req, res) => {
    try {
        const { TransType, TransID, TransTime, TransAmount, BusinessShortCode, BillRefNumber, MSISDN } = req.body;

        if (!TransType || !TransID || !TransTime || !TransAmount || !BusinessShortCode || !BillRefNumber || !MSISDN) {
            return res.status(400).json({ ResultCode: 1, ResultDesc: 'Missing required payment details' });
        }

        const isValidTransaction = true; // Replace this with actual validation logic

        if (isValidTransaction) {
            res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
        } else {
            res.status(200).json({ ResultCode: 1, ResultDesc: 'Rejected' });
        }
    } catch (error) {
        console.error("Error in payment validation:", error);
        res.status(500).json({ ResultCode: 1, ResultDesc: 'Error processing validation' });
    }
};


// STK Push Route
exports.stkPushRequest = async (req, res) => {
    try {
        const accessToken = await getMpesaAccessToken();
        const timestamp = moment().format("YYYYMMDDHHmmss");
        const password = Buffer.from(
            process.env.SHORTCODE + process.env.PASSKEY + timestamp
        ).toString("base64");

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: req.body.amount,
                PartyA: req.body.phoneNumber,
                PartyB: process.env.SHORTCODE,
                PhoneNumber: req.body.phoneNumber,
                CallBackURL: process.env.CALLBACK_URL,
                AccountReference: "Jaymobikes",
                TransactionDesc: "Test Transaction"
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        res.status(200).json({ message: 'STK Push request sent', data: response.data });
    } catch (error) {
        console.error("Error sending STK Push:", error);
        res.status(500).json({ message: 'STK Push request failed', error: error.message });
    }
};

// Register URL for C2B
exports.registerUrl = async (req, res) => {
    try {
        const accessToken = await getMpesaAccessToken();

        // Make sure the URLs are correctly defined in the environment
        const confirmationUrl = process.env.CONFIRMATION_URL;
        const validationUrl = process.env.VALIDATION_URL;

        // Validate the URLs are set
        if (!confirmationUrl || !validationUrl) {
            return res.status(400).json({
                message: 'Missing Confirmation or Validation URL in environment variables',
            });
        }

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
            {
                ShortCode: process.env.SHORTCODE,
                ResponseType: "Completed",
                ConfirmationURL: confirmationUrl,
                ValidationURL: validationUrl,
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        // Return the success response if everything is good
        res.status(200).json({ message: 'URLs registered successfully', data: response.data });
    } catch (error) {
        // Handle error and log the full error message
        console.error("Error registering URLs:", error.response?.data || error.message || error);
        res.status(500).json({ message: 'Failed to register URLs', error: error.response?.data || error.message });
    }
};


