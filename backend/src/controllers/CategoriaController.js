const Categoria = require('../models/Categoria')

const listar = async (req, res) => {
  try {
    const categorias = await Categoria.findAll()
    res.json(categorias)
  } catch (error) {
    console.error(error)
    res.status(500).json({erro:'Erro ao buscar categorias' })
  }
}

const criar = async (req, res) => {
  const {nome,descricao,icone} = req.body
  try {
    const categoria = await Categoria.create({ nome, descricao})
    res.status(201).json(categoria)
  } catch (error) {
    console.error(error)
    res.status(500).json({ erro:'Erro ao criar categoria'})
  }
}

const atualizar = async (req, res) => {
  const {id} = req.params
  const {nome,descricao,icone} = req.body
  try {
    await Categoria.update({nome,descricao}, { where: { id } })
    res.json({ mensagem: 'Categoria atualizada!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({erro:'Erro ao atualizar categoria' })
  }
}

const deletar = async (req, res) => {
  const {id} = req.params
  try {
    await Categoria.destroy({where:{ id }})
    res.json({ mensagem:'Categoria deletada!'})
  } catch (error){
    console.error(error)
    res.status(500).json({erro: 'Erro ao deletar categoria' })
  }
}

module.exports = {listar, criar, atualizar, deletar}