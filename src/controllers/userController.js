// controllers/userController.js
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');
const userService = require('../services/userService'); // Assuming you have this service

const createUser = asyncHandler(async (req, res) => {
  const { email, fullName, phoneNumber } = req.body;

  // Input validation
  if (!email || !fullName || !phoneNumber) {
    // Directly throw an error (asyncHandler will catch it and pass it to the errorHandler)
    const error = new Error('Email, Full Name & Phone Number are required');
    error.status = 400;
    throw error;
  }

  // userService.createUser() is an async function that creates a new user
  const newUser = await userService.createUser({
    email,
    fullName,
    phoneNumber,
  });

  // Respond with the created user
  return res.status(201).json({ user: newUser });
});

// Get User by UserId
const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a parameter
  const user = await userService.getUserById(userId); // Fetch user by userId
  return res.status(200).json({ user });
});

// Update User by Email
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a parameter
  const updatedData = req.body; // Assuming the body contains the updated user data
  const updatedUser = await userService.updateUserById(userId, updatedData);
  return res.status(200).json({ user: updatedUser });
});

// Delete User by Email
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a parameter
  const result = await userService.deleteUserById(userId);
  return res.status(200).json(result);
});

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
