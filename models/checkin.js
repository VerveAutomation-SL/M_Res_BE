const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Resort = require('./resort');
const Room = require('./room');

const CheckIn = sequelize.define('CheckIn', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_number:{
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Room,
      key: 'room_number'
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
  meal_type: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner'),
    allowNull: false
  },
  check_in_date:{
    type:DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  check_in_time:{
    type:DataTypes.TIME,
    defaultValue:sequelize.fn('NOW')
  }
},{
    timestamps: true,
    indexes:[
        {
            fields: ['room_number', 'meal_type', 'check_in_date' , 'check_in_time']
        }
    ]
});

Resort.hasMany(CheckIn, {
  foreignKey: 'resort_id',
  onDelete: 'CASCADE'
});


CheckIn.belongsTo(Resort, {
  foreignKey: 'resort_id'
});


module.exports = CheckIn;
