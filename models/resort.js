const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Resort = sequelize.define('Resort',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    location:{
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    timestamps: true
});

module.exports = Resort;