const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Resort = sequelize.define('Resorts',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    location:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
},{
    timestamps: true
});

module.exports = Resort;