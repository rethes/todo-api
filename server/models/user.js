'use strict';

let cuid = require('cuid');

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
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

    User.associate = function(models) {
        User.hasMany(models.TodoItem, {
            foreignKey: 'todoId',
        });
    };

    return User;
};