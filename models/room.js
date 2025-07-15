const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Resort = require("./resort");

const Room = sequelize.define("Room", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  resort_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resort,
      key: "id",
    },
  },

  room_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Room number is required" }
    }
  },

}, {
  timestamps: true,
  tableName: "rooms",
  underscored: true,

});

// Associations
Resort.hasMany(Room, {
  foreignKey: "resort_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Room.belongsTo(Resort, {
  foreignKey: "resort_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Room;
