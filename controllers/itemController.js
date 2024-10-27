const Item = require('../models/Item');

// GET all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// POST a new item
exports.addItem = async (req, res) => {
    const { name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment } = req.body;
    try {
        const newItem = new Item({ name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// PUT update an item
exports.updateItem = async (req, res) => {
    const { name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment } = req.body;
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, { name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment }, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
