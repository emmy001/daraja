const express = require('express');
const router = express.Router();
const { getItems, addItem, updateItem, deleteItem, authenticateToken } = require('../controllers/itemController');

// Item routes with authentication middleware
router.get('/', authenticateToken, getItems);         // GET all items (protected)
router.post('/', authenticateToken, addItem);         // POST a new item (protected)
router.put('/:id', authenticateToken, updateItem);    // PUT update an item (protected)
router.delete('/:id', authenticateToken, deleteItem); // DELETE an item (protected)

module.exports = router;
