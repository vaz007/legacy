const Nominee = require('../models/nomineeModel');

// Create a new nominee
async function createNominee({
  fullName,
  relationship,
  address,
  email,
  nomineeOf,
  nomineeOfEmail,
}) {
  try {
    const newNominee = await Nominee.create({
      fullName,
      relationship,
      address,
      email,
      nomineeOf,
      nomineeOfEmail,
    });
    return newNominee;
  } catch (error) {
    throw new Error(`Error creating nominee: ${error.message}`);
  }
}

// Get a nominee by ID
async function getNomineeById(nomineeId) {
  try {
    const nominee = await Nominee.findByPk(nomineeId);
    if (!nominee) {
      throw new Error('Nominee not found');
    }
    return nominee;
  } catch (error) {
    throw new Error(`Error fetching nominee: ${error.message}`);
  }
}

// Update a nominee by ID
async function updateNominee(nomineeId, updatedData) {
  try {
    const nominee = await Nominee.findByPk(nomineeId);
    if (!nominee) {
      throw new Error('Nominee not found');
    }
    await nominee.update(updatedData);
    return nominee;
  } catch (error) {
    throw new Error(`Error updating nominee: ${error.message}`);
  }
}

// Delete a nominee by ID
async function deleteNominee(nomineeId) {
  try {
    const nominee = await Nominee.findByPk(nomineeId);
    if (!nominee) {
      throw new Error('Nominee not found');
    }
    await nominee.destroy();
  } catch (error) {
    throw new Error(`Error deleting nominee: ${error.message}`);
  }
}

module.exports = {
  createNominee,
  getNomineeById,
  updateNominee,
  deleteNominee,
};
