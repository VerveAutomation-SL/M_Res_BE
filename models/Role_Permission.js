const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const RolePermission = sequelize.define("RolePermission", {
    RolePermissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    RoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Role',
            key: 'RoleId'
        }
    },
    PermissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Permission',
            key: 'PermissionId'
        }
    }
}, {
    timestamps: true,
    tableName: 'role_permissions',
});

module.exports = RolePermission;