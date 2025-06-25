const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Resort = require('../models/resort');

const Outlet = sequelize.define('Outlet',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
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
    timestamps: true
});

Resort.hasMany(Outlet, {
    foreignKey: 'resort_id',
    onDelete: 'CASCADE'
});
Outlet.belongsTo(Resort, {
    foreignKey: 'resort_id'
});

module.exports = Outlet;