const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// POST /api/users
router.post('/', createUser);
// Get User by Email
router.get('/:email', getUser);

// Update User by Email
router.put('/:email', updateUser);

// Delete User by Email
router.delete('/:email', deleteUser);

module.exports = router;
