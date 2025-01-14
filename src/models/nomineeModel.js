const { DataTypes } = require('sequelize');
const db = require('../config/index');

const Nominee = db.sequelize.define(
  'Nominee',
  {
    nomineeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'nominee_id',
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'relationship',
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'address',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      field: 'email',
    },
    nomineeOf: {
      type: DataTypes.UUID,
      allowNull: false, // Person who nominated the nominee
      field: 'nominee_of',
    },
    nomineeOfEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'nominee_of_email',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified', // This field tracks if the nominee has been verified
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    tableName: 'nominees',
    timestamps: true,
  },
);

module.exports = Nominee;
