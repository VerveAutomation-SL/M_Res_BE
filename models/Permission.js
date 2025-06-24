const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Permission = sequelize.define("Permission", {
    PermissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    types: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error("Permissions must be an array");
                }
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

module.exports = Permission;