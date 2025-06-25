const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Room = require('../models/room');

const Guest = sequelize.define('Guest',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    guest_name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    room_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'id'
        }
    },
},{
    timestamps: true
});

Room.hasOne(Guest, {
    foreignKey: 'room_id',
    onDelete: 'SET NULL'
});
Guest.belongsTo(Room, {
    foreignKey: 'room_id'
});

module.exports = Guest;