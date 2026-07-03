const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
require('dotenv').config()

const login = async (req, res) => {
  const { email, senha } = req.body

  try {
    const usuario = await Usuario.findOne({where: {email}})
    if (!usuario) {
      return res.status(404).json({erro:'Usuário não encontrado' })
    }

    const senhaValida = await bcrypt.compare(senha,usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({erro:'Senha incorreta'})
    }

    const token = jwt.sign(
      { id: usuario.id, email:usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({token, nome:usuario.nome })

  } catch (error) {
    console.error(error)
    res.status(500).json({erro:'Erro interno no servidor' })
  }
}

const cadastrar = async (req, res) => {
  const {nome,email,senha } = req.body

  try {
    const existe = await Usuario.findOne({ where:{email} })
    if (existe) {
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)
    const usuario = await Usuario.create({ nome, email, senha: senhaCriptografada })

    res.status(201).json({mensagem:'Usuário criado!',id: usuario.id })

  } catch (error){
    console.error(error)
    res.status(500).json({ erro:'Erro ao criar usuário'})
  }
}

module.exports = {login,cadastrar }