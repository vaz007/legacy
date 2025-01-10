// controllers/userController.js
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');
const userService = require('../services/userService'); // Assuming you have this service

const createUser = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  // Input validation
  if (!email || !fullName) {
    // Directly throw an error (asyncHandler will catch it and pass it to the errorHandler)
    const error = new Error('Email and Full Name are required');
    error.status = 400;
    throw error;
  }

  // userService.createUser() is an async function that creates a new user
  const newUser = await userService.createUser({ email, fullName });

  // Respond with the created user
  return res.status(201).json({ user: newUser });
});

// Get User by Email
const getUser = asyncHandler(async (req, res) => {
  const { email } = req.params; // Assuming email is passed as a parameter
  const user = await userService.getUserByEmail(email);

  // If user not found, throw an error
  if (!user) {
    const error = new Error(`User with email ${email} not found`);
    error.status = 404;
    throw error;
  }

  return res.status(200).json({ user });
});

// Update User by Email
const updateUser = asyncHandler(async (req, res) => {
  const { email } = req.params; // Assuming email is passed as a parameter
  const updatedData = req.body; // Assuming the body contains the updated user data
  const updatedUser = await userService.updateUserByEmail(email, updatedData);

  // If user not found, throw an error
  if (!updatedUser) {
    const error = new Error(`User with email ${email} not found`);
    error.status = 404;
    throw error;
  }

  return res.status(200).json({ user: updatedUser });
});

// Delete User by Email
const deleteUser = asyncHandler(async (req, res) => {
  const { email } = req.params; // Assuming email is passed as a parameter
  const result = await userService.deleteUserByEmail(email);

  // If delete operation fails, throw an error
  if (!result || !result.success) {
    const error = new Error(`Failed to delete user with email ${email}`);
    error.status = 400;
    throw error;
  }

  return res.status(200).json(result);
});

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
