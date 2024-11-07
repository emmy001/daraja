const mongoose = require('mongoose');

// Item Schema and Model
const itemSchema = new mongoose.Schema({
    id:{ type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String },
    amount_paid: { type: Number, required: true },
    comments: { type: String },
    total_paid: { type: Number, required: true, default: 0 },
    default_amount: { type: Number, required: true },
    balance_due: { type: Number, required: true },
    last_payment: { type: Date, default: Date.now },
    number_plate: { type: String },
    contact: { type: String },
    contract_details: { type: String }, // Changed to String, adjust as needed
});

const Item = mongoose.model('Item', itemSchema);



// Exporting both models
module.exports = { Item };
