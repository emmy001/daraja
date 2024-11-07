// utils/mpesaAuth.js

const axios = require('axios');

async function getMpesaAccessToken() {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Failed to get M-Pesa access token:", error);
        throw error;
    }
}

module.exports = { getMpesaAccessToken };
