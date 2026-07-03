const { DataTypes, Model } = require('sequelize')
const sequelize = require('../database/database')
const Usuario = require('./Usuario')

class ListaSalva extends Model {}

ListaSalva.init({
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_lista: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Minha lista'
  },
  exames:{
    type: DataTypes.TEXT, // JSON salvo como texto
    allowNull: false
  },
  usuario_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ListaSalva',
  tableName: 'listas_salvas',
  timestamps: true
})

Usuario.hasMany(ListaSalva, { foreignKey: 'usuario_id', as: 'listas' })
ListaSalva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' })

module.exports = ListaSalva