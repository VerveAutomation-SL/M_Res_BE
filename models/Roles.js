const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Role = sequelize.define("Role", {
    RoleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.ENUM("Admin", "Host"),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'roles',
});

module.exports = Role;