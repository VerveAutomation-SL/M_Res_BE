const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resort = sequelize.define("Resort", {
  resortId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  resortNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Resort number must be unique"
    },
    validate: {
      notEmpty: { msg: "Resort number is required" }
    }
  },

  resortName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Resort name must be unique"
    },
    validate: {
      notEmpty: { msg: "Resort name is required" }
    }
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Location is required" }
    }
  },

  totalRooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "Total rooms must be an integer" },
      min: {
        args: 1,
        msg: "Total rooms must be at least 1"
      }
    }
  }
}, {
  timestamps: true,
  tableName: "resorts"
});

module.exports = Resort;
