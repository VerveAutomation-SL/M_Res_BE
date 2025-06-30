const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Resort = require("./resort");

const Room = sequelize.define("Room", {
  roomId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  resortId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resort,
      key: "resortId",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },

  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Room number is required" }
    }
  },

  type: {
    type: DataTypes.ENUM("Standard", "Villa"),
    allowNull: false,
    defaultValue: "Standard",
    validate: {
        isIn: {
            args: [["Standard", "Deluxe", "Suite", "Villa"]],
            msg: "Type must be one of Standard, Deluxe, Suite, or Villa"
        }
    }
  },
  isAvailable: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Available",
    validate: {
      isIn: {
        args: [["Available", "Occupied"]],
        msg: "Status must be one of Available or Occupied"
      }
    }
  },

}, {
  timestamps: true,
  tableName: "rooms"
});

// Associations
Resort.hasMany(Room, {
  foreignKey: "resortId",
});
Room.belongsTo(Resort, {
  foreignKey: "resortId",
});

module.exports = Room;
