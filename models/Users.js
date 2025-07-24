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
        type: DataTypes.ENUM("Admin", "User"),
        allowNull: false,
        defaultValue: "User",
        validate: {
            isIn: {
                args: [["Admin", "User"]],
                msg: "Role must be either 'Admin' or 'User'",
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