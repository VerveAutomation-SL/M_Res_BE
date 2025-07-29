const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Restaurant = require("./restaurant");
const User = require("./Users");

const Permission = sequelize.define("Permission", {
    PermissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'name',
            msg: 'Permission name must be unique',
        },
        validate: {
            notEmpty: {
                msg: 'Permission name cannot be empty',
            }
        }
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Restaurant,
            key: 'id'
        },
    },
    meal_type: {
        type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner', 'All'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['Breakfast', 'Lunch', 'Dinner', 'All']],
                msg: 'Meal type must be either Breakfast, Lunch, Dinner, or All',
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'permissions',
});

Permission.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
});

Restaurant.hasMany(Permission, {
    foreignKey: 'restaurantId',
    as: 'permissions',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});



module.exports = Permission;