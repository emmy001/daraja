const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    amount_paid: { type: Number, required: true },
    comments: { type: String, required: true },
    total_paid: { type: Number, required: true },
    default_amount: { type: Number, required: true },
    balance_due: { type: Number, required: true },
    last_payment: { type: Date, default: Date.now },
    number_plate: { type: String, required: true },
    contact: { type: String, required: true },
    contract_details: { type: Number, required: true },
});

module.exports = mongoose.model('Item', itemSchema);
