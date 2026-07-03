const {DataTypes, Model} = require('sequelize')
const sequelize = require('../database/database')
const Categoria = require('./Categoria')

class Exame extends Model {}

Exame.init({
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
    type: DataTypes.TEXT,
    allowNull:true
  },
  jejum:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  preparo:{
    type: DataTypes.TEXT,
    allowNull:true
  },
  tempo_resultado:{
    type: DataTypes.STRING,
    allowNull:true
  },
  categoria_id:{
    type: DataTypes.INTEGER,
    allowNull:false
  }
}, {
  sequelize,
  modelName:'Exame',
  tableName:'exames',
  timestamps:true
})
Categoria.hasMany(Exame,{foreignKey:'categoria_id',as: 'exames'})
Exame.belongsTo(Categoria, {foreignKey: 'categoria_id', as: 'categoria'})

module.exports = Exame