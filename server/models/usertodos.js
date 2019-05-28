'use strict';
module.exports = (sequelize, DataTypes) => {
  const userTodos = sequelize.define('userTodos', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    todoId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return userTodos;
};