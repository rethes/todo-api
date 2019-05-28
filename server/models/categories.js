'use strict';

module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define('Categories', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    classMethods: {
      associate: (models) => {
        Categories.hasMany(models.todos, {
          foreignKey: 'categoryId',
          as: 'todos'
        });
      }
    }
  });
  return Categories;
};
