const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Resort = require('./resort');

const Room = sequelize.define('Room',{
    id :{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room_number:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status:{
        type: DataTypes.ENUM('available', 'occupied'),
        defaultValue: 'available',
    },
    resort_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resort,
            key: 'id'
        }
    }
},{
    timestamps:true,
    underscored: true
});

Resort.hasMany(Room, {
    foreignKey: 'resort_id',
    onDelete: 'CASCADE'
});
Room.belongsTo(Resort, {
    foreignKey: 'resort_id'
});

module.exports = Room;