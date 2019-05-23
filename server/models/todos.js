'use strict';
let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {
  const Todos = sequelize.define('Todos',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => cuid(),
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      classMethods: {
        associate: models => {
          Todos.belongsTo(models.Categories, {
            foreignKey: 'categoryId',
            onDelete: 'CASCADE',
            allowNull: false,
          });
        },
      },
    }
  );
  return Todos;
};
