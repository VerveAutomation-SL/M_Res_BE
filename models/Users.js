const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const Resort = require("./resort");
const Restaurant = require("./restaurant");

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

    resortId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Resort,
            key: 'id'
        },
        validate: {
            isInt: {
                msg: "Resort ID must be an integer",
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
        defaultValue: 'All',
        validate: {
            isIn: {
                args: [['Breakfast', 'Lunch', 'Dinner', 'All']],
                msg: 'Meal type must be either Breakfast, Lunch, Dinner, or All',
            }
        }
    },
    resetPasswordToken:{
        type: DataTypes.STRING,
        allowNull: true,
    },

    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Inactive",
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

User.belongsTo(Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
});

Restaurant.hasMany(User, {
    foreignKey: 'restaurantId',
    as: 'restaurants',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

User.belongsTo(Resort, {
    foreignKey: 'resortId',
    as: 'resorts',
});

Resort.hasMany(User, {
    foreignKey: 'resortId',
    as: 'resorts',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = User;