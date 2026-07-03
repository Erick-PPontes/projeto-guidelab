const {DataTypes, Model} = require('sequelize')
const sequelize = require('../database/database')

class Categoria extends Model {}

Categoria.init({
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  nome:{
    type: DataTypes.STRING,
    allowNull:false
  },
  descricao:{
    type: DataTypes.STRING,
    allowNull:true
  },
/*  icone:{
    type: DataTypes.STRING,
    allowNull:true
  }*/
}, {
  sequelize,
  modelName:'Categoria',
  tableName:'categorias',
  timestamps:true
})

module.exports = Categoria