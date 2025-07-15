const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resort = sequelize.define("Resort", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
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
  }
}, {
  timestamps: true,
  tableName: "resorts",
  underscored: true,
});

module.exports = Resort;
