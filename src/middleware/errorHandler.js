const logger = require('../utils/logger');

// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  if (!err) {
    return res.status(500).json({
      success: false,
      message: 'Unknown error',
    });
  }
  // Send a response to the client
  return res.status(err.status || 400).json({
    success: false,
    message: err.message || 'Bad Request',
  });
};
