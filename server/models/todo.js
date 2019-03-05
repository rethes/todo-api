'use strict';

module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      // DataTypes.string means that we only expect a string value in this field,
      // allowNull: false what this attribute does is that it made the title field not null
      type: DataTypes.STRING, allowNull: false,
    },
  });

  Todo.associate = function(models) {
    // associations can be defined here
      Todo.hasMany(models.TodoItem, {
          // every single todos has many todoItem
          // todoId is going to be the foreign key column in todoItem,
          foreignKey: 'todoId',
      });
  };
  return Todo;
};
