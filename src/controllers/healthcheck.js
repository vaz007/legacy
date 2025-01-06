const logger = require('../utils/logger');

const healthcheck = (req, res) => {
  logger.info('GET /api/v1/healthcheck called');
  logger.error('This is an error message');
  logger.warn('This is a warning');
  logger.info('This is an informational message');
  logger.debug('Debugging details here');
  logger.verbose('Verbose level logging for deep trace');
  res.status(200).json({ message: 'Healthcheck!!' });
};

module.exports = { healthcheck };

// SAMPLE CONTROLLER

/**
  //// src/controllers/userController.js
const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");

// Example route to fetch user data
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await userService.getUserById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { getUser };

   */
