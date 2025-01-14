/* eslint-disable import/order */

const nomineeService = require('../services/nomineeService');
const asyncHandler = require('express-async-handler');

// Create a new nominee
const createNominee = asyncHandler(async (req, res) => {
  const { fullName, relationship, address, email, nomineeOf, nomineeOfEmail } =
    req.body;

  // Input validation
  if (!fullName || !relationship || !email || !nomineeOf) {
    const error = new Error(
      'userId, fullName, relationship, email, and nomineeOf are required',
    );
    error.status = 400;
    throw error;
  }

  // Call service to create nominee
  const newNominee = await nomineeService.createNominee({
    fullName,
    relationship,
    address,
    email,
    nomineeOf,
    nomineeOfEmail,
  });

  return res.status(201).json({ status: 'success', data: newNominee });
});

// Get nominee by ID
const getNomineeById = asyncHandler(async (req, res) => {
  const { nomineeId } = req.params;

  if (!nomineeId) {
    const error = new Error('nomineeId is required');
    error.status = 400;
    throw error;
  }

  const nominee = await nomineeService.getNomineeById(nomineeId);
  return res.status(200).json({ status: 'success', data: nominee });
});

// Update nominee by ID
const updateNominee = asyncHandler(async (req, res) => {
  const { nomineeId } = req.params;
  const updatedData = req.body;

  if (!nomineeId) {
    const error = new Error('nomineeId is required');
    error.status = 400;
    throw error;
  }
  // Check if `nomineeOfEmail` is being updated (you can't allow it)
  if (updatedData.nomineeOfEmail) {
    const error = new Error('Changing nomineeOfEmail is not allowed');
    error.status = 400;
    throw error; // Return an error if an attempt is made to update the nomineeOfEmail
  }

  // Check if `nomineeOfID` is being updated (you can't allow it)
  if (updatedData.nomineeOf) {
    const error = new Error('Changing nomineeOfId is not allowed');
    error.status = 400;
    throw error; // Return an error if an attempt is made to update the nomineeOfEmail
  }

  const updatedNominee = await nomineeService.updateNominee(
    nomineeId,
    updatedData,
  );
  return res.status(200).json({ status: 'success', data: updatedNominee });
});

// Delete nominee by ID
const deleteNominee = asyncHandler(async (req, res) => {
  const { nomineeId } = req.params;

  if (!nomineeId) {
    const error = new Error('nomineeId is required');
    error.status = 400;
    throw error;
  }

  await nomineeService.deleteNominee(nomineeId);
  return res
    .status(204)
    .json({ status: 'success', data: `Nominee with ID ${nomineeId} deleted` });
});

module.exports = {
  createNominee,
  getNomineeById,
  updateNominee,
  deleteNominee,
};
