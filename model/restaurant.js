const sequelize = require('../config/db');
const { DataTypes } = require("sequelize");
const Resort = require("./resort");

const Restaurant = sequelize.define('Restaurant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    resort_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resort,
            key: 'id'
        },
        validate: {
            notEmpty: {
                msg: 'Resort ID cannot be empty'
            },
        }
    },
},
{
    tableName: 'restaurant',
    timestamps: true,
});

Resort.hasMany(Restaurant, {
    foreignKey: "resort_id",
    as: "restaurants",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Restaurant.belongsTo(Resort, {
    foreignKey: "resort_id",
    as: "resort",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
module.exports = Restaurant;