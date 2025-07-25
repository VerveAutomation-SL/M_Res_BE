const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const Permission  = require("./Permission");

const SALT_ROUNDS = 10;

const User = sequelize.define("User", {
    UserId : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM("Admin", "Manager", "Host"),
        allowNull: false,
        defaultValue: "User",
        validate: {
            isIn: {
                args: [["Admin", "Manager", "Host"]],
                msg: "Role must be either Admin, Manager, or Host",
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: 'email',
            msg: 'Email address already in use',
        },
        validate: {
            isEmail: {
                msg: 'Please provide a valid email address',
            },
            notEmpty: { msg: "Email is required" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Password is required",
            }
        }
    },
    PermissionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Permission,
            key: 'PermissionId'
        }
    },

    status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Active",
        validate: {
            isIn: {
                args: [["Active", "Inactive"]],
                msg: "Status must be either Active or Inactive"
            }
        }
    }

}, {
    timestamps: true,
    tableName: 'users',

    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
            }
        }
    }
})

Permission.hasMany(User, {foreignKey: 'PermissionId'});
User.belongsTo(Permission, {foreignKey: 'PermissionId'});

module.exports = User;