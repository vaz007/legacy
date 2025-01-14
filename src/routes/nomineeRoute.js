const express = require('express');
const {
  createNominee,
  getNomineeById,
  updateNominee,
  deleteNominee,
} = require('../controllers/nomineeController');

const router = express.Router();

// POST /api/nominees
router.post('/', createNominee);

// GET /api/nominees/:nomineeId
router.get('/:nomineeId', getNomineeById);

// PATCH /api/nominees/:nomineeId
router.patch('/:nomineeId', updateNominee);

// DELETE /api/nominees/:nomineeId
router.delete('/:nomineeId', deleteNominee);

module.exports = router;
