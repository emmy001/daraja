const { Item } = require('../models/Item'); // Removed User since it's not used
const bcrypt = require('bcrypt'); // If not used, consider removing
const jwt = require('jsonwebtoken');

// Middleware for token verification
exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// GET all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    if (!items.length) return res.status(404).json({ message: 'No items found' });
    res.json(items);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Custom findOneAndUpdate function
exports.findOneAndUpdate = async (id, update, options) => {
    try {
        return await Item.findOneAndUpdate({ id }, update, options);
    } catch (error) {
        console.error("Error in findOneAndUpdate:", error);
        throw error;
    }
};




/// POST a new item
exports.addItem = async (req, res) => {
  const { id, name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment, number_plate, contact, contract_details } = req.body;

  try {
    // Check if ID is provided and if it already exists in the database
    if (id) {
      const existingItem = await Item.findOne({ id });
      if (existingItem) {
        return res.status(400).json({ message: `ID ${id} already exists. Please choose a different ID.` });
      }
    }

    // Create the new item with the provided details
    const newItem = new Item({
      id, // Use provided ID
      name,
      status,
      amount_paid,
      comments,
      total_paid,
      default_amount,
      balance_due,
      last_payment,
      number_plate,
      contact,
      contract_details
    });

    await newItem.save();
    res.status(201).json(newItem); // Return the newly created item
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// PUT update an item
exports.updateItem = async (req, res) => {
  const { id, name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment, number_plate, contact, contract_details } = req.body;

  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { id, name, status, amount_paid, comments, total_paid, default_amount, balance_due, last_payment, number_plate, contact, contract_details },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
