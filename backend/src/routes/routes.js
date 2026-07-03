const express = require('express')
const router = express.Router()
const autenticar = require('../middlewares/auth')

const authController = require('../controllers/authController')
const categoriaController = require('../controllers/CategoriaController')
const exameController = require('../controllers/ExameController')
const listaController = require('../controllers/listaController')

router.post('/auth/login', authController.login)
router.post('/auth/cadastrar', authController.cadastrar)

router.get('/categorias', categoriaController.listar)

router.post('/categorias', autenticar, categoriaController.criar)
router.put('/categorias/:id', autenticar, categoriaController.atualizar)
router.delete('/categorias/:id', autenticar, categoriaController.deletar)

router.get('/exames', exameController.listar)
router.get('/exames/recomendados', exameController.recomendados)
router.get('/exames/categoria/:categoria_id', exameController.listarPorCategoria)

router.post('/exames', autenticar, exameController.criar)
router.put('/exames/:id', autenticar, exameController.atualizar)
router.delete('/exames/:id', autenticar, exameController.deletar)

router.post('/listas', autenticar, listaController.salvar)
router.get('/listas', autenticar, listaController.minhasListas)
router.delete('/listas/:id', autenticar, listaController.deletar)

module.exports = router