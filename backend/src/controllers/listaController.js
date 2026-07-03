const ListaSalva = require('../models/ListaSalva')

const salvar = async (req, res) => {
  const {nome_lista,exames} = req.body
  const usuario_id = req.usuario.id // vem do token JWT

  try {
    const lista = await ListaSalva.create({
      nome_lista,
      exames: JSON.stringify(exames),
      usuario_id
    })
    res.status(201).json({mensagem:'Lista salva!', id: lista.id })
  } catch (error) {
    res.status(500).json({erro:'Erro ao salvar lista'})
  }
}

const minhasListas = async (req, res) => {
  const usuario_id = req.usuario.id
  try {
    const listas = await ListaSalva.findAll({where:{ usuario_id } })
    const resultado = listas.map(l => ({
      ...l.toJSON(),
      exames: JSON.parse(l.exames)
    }))
    res.json(resultado)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar listas' })
  }
}

const deletar = async (req, res) => {
  const { id } = req.params
  const usuario_id = req.usuario.id
  try {
    await ListaSalva.destroy({where:{id, usuario_id} })
    res.json({ mensagem: 'Lista deletada!' })
  } catch (error) {
    res.status(500).json({erro:'Erro ao deletar lista' })
  }
}

module.exports = {salvar,minhasListas,deletar}