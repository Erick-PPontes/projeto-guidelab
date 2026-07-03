const Exame = require('../models/Exame')
const ExameRecomendado = require('../models/ExameRecomendado')
const Categoria = require('../models/Categoria')
const { Op } = require('sequelize')

const listar = async (req, res) => {
  try {
    const exames = await Exame.findAll({include:[{model:Categoria, as:'categoria' }] })
    res.json(exames)
  } catch (error){
    console.error(error)
    res.status(500).json({erro:'Erro ao buscar exames'})
  }
}

const listarPorCategoria = async (req, res) => {
  const { categoria_id } = req.params
  try {
    const exames = await Exame.findAll({where:{categoria_id } })
    res.json(exames)
  } catch (error) {
    res.status(500).json({erro:'Erro ao buscar exames da categoria' })
  }
}

const recomendados = async (req, res) => {
  const { sexo, idade, categoria_id } = req.query
  try{
    const where = {}
    if (sexo) where.sexo = [sexo,'ambos']
    if (idade) {
      where.idade_min = {[Op.lte]: idade}
      where.idade_max = {[Op.gte]: idade}
    }

    const recomendacoes = await ExameRecomendado.findAll({
      where,
      include: [{
        model: Exame,
        as:'exame',
        where:categoria_id ? {categoria_id} :{},
        include: [{model: Categoria, as: 'categoria'}]
      }]
    })

    res.json(recomendacoes)
  } catch (error) {
    console.error(error)
    res.status(500).json({erro: 'Erro ao buscar recomendações' })
  }
}

const criar = async (req, res) => {
  const {nome, descricao, jejum, preparo, tempo_resultado, categoria_id } = req.body
  try {
    const exame = await Exame.create({nome,descricao,jejum,preparo,tempo_resultado,categoria_id })
    res.status(201).json(exame)
  } catch (error){
    console.error(error)
    res.status(500).json({erro: 'Erro ao criar exame'})
  }
}

const atualizar = async (req, res) => {
  const { id } = req.params
  const dados = req.body
  try {
    await Exame.update(dados,{ where:{ id }})
    res.json({ mensagem:'Exame atualizado!'})
  } catch (error) {
    console.error(error)
    res.status(500).json({erro: 'Erro ao atualizar exame'})
  }
}

const deletar = async (req, res) => {
  const { id } = req.params
  try {
    await Exame.destroy({where: { id }})
    res.json({ mensagem:'Exame deletado!'})
  } catch (error) {
    console.error(error)
    res.status(500).json({erro: 'Erro ao deletar exame'})
  }
}

module.exports = {listar,listarPorCategoria,recomendados,criar,atualizar,deletar }