const User = require('../models/userModel'); // Your Sequelize model

async function createUser({ email, fullName, phoneNumber }) {
  try {
    const newUser = await User.create({ email, fullName, phoneNumber });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } }); // Search user by email
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

// Update User by Email
async function updateUserByEmail(email, updatedData) {
  try {
    const user = await User.findOne({ where: { email } }); // Search user by email
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updatedData); // Update the user
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

// Delete User by Email
async function deleteUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } }); // Search user by email
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
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
};
