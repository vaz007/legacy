/* eslint-disable no-undef */
/* eslint-disable camelcase */
const { DataTypes } = require('sequelize');
const db = require('../config/index');

const User = db.sequelize.define(
  'User',
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'user_id', // Maps to snake_case in the DB
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name', // Maps to snake_case in the DB
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone_number', // Maps to snake_case in the DB
      unique: true,
      validate: {
        isNumeric: {
          msg: 'Phone number must contain only digits.', // Custom error message for numeric validation
        },
        len: {
          args: [10, 10], // Ensures the length is exactly 10 digits
          msg: 'Phone number must be exactly 10 digits long.', // Custom error message for length validation
        },
      },
    },
    alternatePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alternate_phone', // Maps to snake_case in the DB
      unique: true,
      validate: {
        isNumeric: {
          msg: 'Alternate Phone number must contain only digits.', // Custom error message for numeric validation
        },
        len: {
          args: [10, 10], // Ensures the length is exactly 10 digits
          msg: 'Alternate Phone number must be exactly 10 digits long.', // Custom error message for length validation
        },
      },
    },
    alternateEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alternate_email', // Maps to snake_case in the DB
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'dev'),
      defaultValue: 'user',
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_verified', // Maps to snake_case in the DB
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'phone_verified', // Maps to snake_case in the DB
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'blacklisted'),
      defaultValue: 'active',
      field: 'status', // Maps to snake_case in the DB
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at', // Maps to snake_case in the DB
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at', // Maps to snake_case in the DB
    },
  },
  {
    tableName: 'users',
    timestamps: false, // Disable Sequelize's automatic timestamps (since you handle them manually)
    validate: {
      // Custom validation for ensuring phoneNumber and email are not the same as alternatePhone and alternateEmail
      phoneEmailNotSame() {
        // Check if alternatePhone is defined and not the same as phoneNumber
        const { phoneNumber, alternatePhone, email, alternateEmail } = this;
        console.log(phoneNumber, alternatePhone, email, alternateEmail);
        console.log(JSON.stringify(alternatePhone));
        console.log(alternatePhone === null);
        if (
          alternatePhone &&
          alternatePhone !== null &&
          phoneNumber === alternatePhone
        ) {
          throw new Error(
            'Primary phone number cannot be the same as alternate phone number.',
          );
        }

        // Check if alternateEmail is defined and not the same as email
        if (alternateEmail && email === alternateEmail) {
          throw new Error(
            'Primary email cannot be the same as alternate email.',
          );
        }
      },
    },
  },
);

module.exports = User;
