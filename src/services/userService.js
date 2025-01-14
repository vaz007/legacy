const Nominee = require('../models/nomineeModel'); // Your Sequelize model
const User = require('../models/userModel'); // Your Sequelize model

async function createUser({ email, fullName, phoneNumber }) {
  try {
    const newUser = await User.create({ email, fullName, phoneNumber });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findOne({ where: { userId } }); // Search user by email
    console.log(user);
    if (!user) {
      const error = new Error(`User with Id ${userId} not found`);
      error.status = 404;
      throw error;
    }
    return user;
  } catch (error) {
    const errors = new Error(`Error fetching user: ${error}`);
    errors.status = 404;
    throw errors;
  }
}

// Update User by Email

async function updateUserById(userId, updatedData) {
  try {
    // First, fetch the user to get the old email before making any updates
    const user = await User.findOne({ where: { userId } });
    let updatedUserResult;
    if (!user) {
      throw new Error('User not found');
    }
    // Store the old email
    const oldEmail = user.email;

    // If email is being updated
    if (updatedData.email) {
      // Update the user with the new email and set emailVerified to false
      const [rowsUpdated, [updatedUser]] = await User.update(
        { ...updatedData, emailVerified: false }, // Set emailVerified to false when email changes
        { where: { userId }, returning: true }, // To return the updated user object (PostgreSQL)
      );

      if (rowsUpdated === 0) {
        throw new Error('Error updating user');
      }
      console.log(oldEmail);
      console.log(updatedData);

      // Now, update all nominees that were related to the old email
      await Nominee.update(
        { nomineeOfEmail: updatedData.email }, // Set the new nomineeOfEmail
        { where: { nomineeOfEmail: oldEmail } }, // Update only those with the old email
      );
      updatedUserResult = updatedUser; // Return the updated user object
    } else {
      // If no email is updated, just update the user data (but not email-related fields)
      const [rowsUpdated, [updatedUser]] = await User.update(updatedData, {
        where: { userId },
        returning: true, // To return the updated user object (PostgreSQL)
      });

      if (rowsUpdated === 0) {
        throw new Error('User not found');
      }

      updatedUserResult = updatedUser; // Return the updated user object
    }
    return updatedUserResult;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

// Delete User by Email
async function deleteUserById(userId) {
  try {
    const user = await User.findOne({ where: { userId } }); // Search user by email
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy(); // Delete the user
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}
module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
