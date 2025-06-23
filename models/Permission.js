const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Permission = sequelize.define("Permission", {
    PermissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'permissions',
});

module.exports = Permission;