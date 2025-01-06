const express = require('express');

const router = express.Router();
const { healthcheck } = require('../controllers/healthcheck');

router.get('/', healthcheck);

module.exports = router;
