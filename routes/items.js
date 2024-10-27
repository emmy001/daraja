const express = require('express');
const router = express.Router();
const { getItems, addItem, updateItem, deleteItem } = require('../controllers/itemController');

// GET all items
router.get('/', getItems);

// POST a new item
router.post('/', addItem);

// PUT update an item
router.put('/:id', updateItem);

// DELETE an item
router.delete('/:id', deleteItem);

module.exports = router;
