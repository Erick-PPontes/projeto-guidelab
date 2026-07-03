const sequelize = require('./database')

require('../models/Usuario')
require('../models/Categoria')
require('../models/Exame')
require('../models/ExameRecomendado')
require('../models/ListaSalva')

const sincronizar = async() => {
  try{
    await sequelize.sync({ alter: true })
    console.log('Banco de dados sincronizado!')
  } catch (error){
    console.error('Erro ao sincronizar banco:',error)
  }
}

module.exports = sincronizar