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
    },
    alternatePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'alternate_phone', // Maps to snake_case in the DB
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
    // validate: {
    //   // Custom validation for ensuring phoneNumber and email are not the same as alternatePhone and alternateEmail
    //   phoneEmailNotSame() {
    //     // Check if alternatePhone is defined and not the same as phoneNumber
    //     const { phone_number, alternate_phone, email, alternate_email } =
    //       this.dataValues;

    //     console.log('Validation context:', {
    //       phone_number,
    //       alternate_phone,
    //       email,
    //       alternate_email,
    //     });
    //     if (alternate_phone !== undefined && phoneNumber === alternate_phone) {
    //       throw new Error(
    //         'Primary phone number cannot be the same as alternate phone number.',
    //       );
    //     }

    //     // Check if alternateEmail is defined and not the same as email
    //     if (alternate_email !== undefined && email === alternate_email) {
    //       throw new Error(
    //         'Primary email cannot be the same as alternate email.',
    //       );
    //     }
    //   },
    // },
  },
);

module.exports = User;
