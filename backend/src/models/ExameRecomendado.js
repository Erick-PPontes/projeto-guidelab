const {DataTypes, Model} = require('sequelize')
const sequelize = require('../database/database')
const Exame = require('./Exame')
class ExameRecomendado extends Model {}

ExameRecomendado.init({
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  exame_id:{
    type: DataTypes.INTEGER,
    allowNull:false
  },
  sexo:{
    type: DataTypes.STRING,
    defaultValue:'ambos'
  },
  idade_min: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  idade_max:{
    type: DataTypes.INTEGER,
    defaultValue: 120
  }
}, {
  sequelize,
  modelName:'ExameRecomendado',
  tableName:'exames_recomendados',
  timestamps:false
})
Exame.hasMany(ExameRecomendado, {foreignKey: 'exame_id', as:'recomendacoes' })
ExameRecomendado.belongsTo(Exame,{foreignKey: 'exame_id', as: 'exame'})

module.exports = ExameRecomendado