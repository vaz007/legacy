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
router.get('/:userId', getUser);

// Update User by userId
router.patch('/:userId', updateUser);

// Delete User by userId
router.delete('/:userId', deleteUser);

module.exports = router;
