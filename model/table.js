const sequelize = require('../config/db');
const { DataTypes } = require("sequelize");
const Restaurant = require("./restaurant");

const DiningTable = sequelize.define('DiningTable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    diningTableNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Table number cannot be empty'
            },
        }
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Restaurant ID cannot be empty'
            },
        },
        references: {
            model: Restaurant,
            key: 'id'
        }
    }
}, {
    tableName: 'dining_tables',
    timestamps: true,
});

Restaurant.hasMany(DiningTable, {
    foreignKey: 'restaurantId',
    as: 'diningTables'
});

DiningTable.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
});

module.exports = DiningTable;