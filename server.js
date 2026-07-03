const express = require('express')
const cors = require('cors')
require('dotenv').config()

const sincronizar = require('./backend/src/database/sync')
const rotas = require('./backend/src/routes/routes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensagem: 'API GuideLab funcionando!' })
})

app.use(rotas)
const PORT = process.env.PORT || 3001

sincronizar().then(() =>{
  app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}).catch((erro) =>{
  console.log("Falha fatal: O servidor não iniciou porque o banco deu erro.", erro)
})