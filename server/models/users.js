
'use strict';

let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {

  const Users = sequelize.define('Users', {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: () => cuid(),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

  });

  return Users;
};
