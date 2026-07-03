const jwt = require('jsonwebtoken')
require('dotenv').config()

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({erro:'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (error) {
    console.error(error)
    return res.status(403).json({erro:'Token inválido ou expirado' })
  }
}

module.exports = autenticar