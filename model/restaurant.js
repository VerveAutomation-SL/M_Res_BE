const sequelize = require('../config/db');
const { DataTypes } = require("sequelize");

const Restaurant = sequelize.define('Restaurant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    restaurantNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Restaurant number must be unique'
        },
        validate: {
            notEmpty: {
                msg: 'Restaurant number cannot be empty'
            },
        }
    },
    restaurantName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Restaurant name must be unique'
        },
        validate: {
            notEmpty: {
                msg: 'Restaurant name cannot be empty'
            },
        }
    },
},
{
    tableName: 'restaurant',
    timestamps: true,
});

module.exports = Restaurant;