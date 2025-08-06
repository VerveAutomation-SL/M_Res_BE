const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Resort = require('./resort');
const Room = require('./room');
const { checkout } = require('../routes/resortRoutes');

const CheckIn = sequelize.define('CheckIns', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Room,
      key: 'id'
    }
  },
  resort_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resort,
      key: 'id'
    }
  },
  outlet_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  table_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  meal_type: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner'),
    allowNull: false
  },
  meal_plan: {
    type: DataTypes.ENUM('all-inclusive', 'full-board', 'half-board'),
    allowNull: false
  },
  check_in_date:{
    type:DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  check_out_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  check_in_time:{
    type: DataTypes.TIME,
    defaultValue:sequelize.fn('NOW')
  },
  check_out_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  checkout_remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('checked-in', 'checked-out'),
    defaultValue: 'checked-in',
    allowNull: false
  },

},{
    timestamps: true,
    indexes:[
        {
            fields: ['room_id', 'meal_type', 'check_in_date' , 'check_in_time', 'status']
        }
    ]
});

Resort.hasMany(CheckIn, {
  foreignKey: 'resort_id',
  onDelete: 'CASCADE'
});

Room.hasMany(CheckIn, {
  foreignKey: 'room_id',
  onDelete: 'CASCADE'
});

CheckIn.belongsTo(Resort, {
  foreignKey: 'resort_id'
});

CheckIn.belongsTo(Room, {
  foreignKey: 'room_id'
});

module.exports = CheckIn;
