const {DataTypes, Model} = require('sequelize')
const sequelize = require('../database/database')

class Usuario extends Model {}

Usuario.init({
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull:false
  },
  email:{
    type: DataTypes.STRING,
    allowNull:false,
    unique:true
  },
  senha:{
    type: DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize,
  modelName:'Usuario',
  tableName:'usuarios',
  timestamps:true
})

module.exports = Usuario