const sequelize = require('./database')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/Usuario')
const Categoria = require('../models/Categoria')
const Exame = require('../models/Exame')
const ExameRecomendado = require('../models/ExameRecomendado')
const ListaSalva = require('../models/ListaSalva')

const popular = async () => {
    await sequelize.sync({force: true }) 
    console.log('Banco formatado...')

  const senha = await bcrypt.hash('admin123', 10)
  await Usuario.create({ nome: 'Admin Lab', email: 'admin@lab.com', senha })
    //categorias
  const rins = await Categoria.create({ nome: 'Rins', descricao: 'Avalia a função renal'})
  const figado = await Categoria.create({ nome: 'Fígado', descricao: 'Avalia a função hepática' })
  const colesterol = await Categoria.create({ nome: 'Colesterol', descricao: 'Avalia o perfil lipídico' })
  const vitaminas = await Categoria.create({ nome: 'Vitaminas', descricao: 'Verifica níveis de vitaminas'})
  const diabetes = await Categoria.create({ nome: 'Diabetes', descricao: 'Avalia o controle glicêmico' })
    //rins
  const creatinina = await Exame.create({ nome: 'Creatinina', descricao: 'Avalia a função dos rins', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '1 dia', categoria_id: rins.id })
  const ureia = await Exame.create({ nome: 'Ureia', descricao: 'Mede o nível de ureia no sangue', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '1 dia', categoria_id: rins.id })
  const acidoUrico = await Exame.create({ nome: 'Ácido Úrico', descricao: 'Detecta gota e problemas renais', jejum: true, preparo: 'Jejum de 8 horas', tempo_resultado: '1 dia', categoria_id: rins.id })

  //fígado
  const tgo = await Exame.create({ nome: 'TGO', descricao: 'Enzima hepática - indica danos no fígado', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '1 dia', categoria_id: figado.id })
  const tgp = await Exame.create({ nome: 'TGP', descricao: 'Enzima hepática - mais específica para o fígado', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '1 dia', categoria_id: figado.id })
  const ggt = await Exame.create({ nome: 'GGT', descricao: 'Avalia doenças hepáticas e uso de álcool', jejum: false, preparo: 'Evitar álcool 24h antes', tempo_resultado: '1 dia', categoria_id: figado.id })

  //Colesterol
  const colTotal = await Exame.create({ nome: 'Colesterol Total', descricao: 'Mede o colesterol total no sangue', jejum: true, preparo: 'Jejum de 12 horas', tempo_resultado: '1 dia', categoria_id: colesterol.id })
  const hdl = await Exame.create({ nome: 'HDL', descricao: 'Colesterol bom', jejum: true, preparo: 'Jejum de 12 horas', tempo_resultado: '1 dia', categoria_id: colesterol.id })
  const ldl = await Exame.create({ nome: 'LDL', descricao: 'Colesterol ruim', jejum: true, preparo: 'Jejum de 12 horas', tempo_resultado: '1 dia', categoria_id: colesterol.id })
  const triglicerides = await Exame.create({ nome: 'Triglicerídeos', descricao: 'Gordura no sangue', jejum: true, preparo: 'Jejum de 12 horas', tempo_resultado: '1 dia', categoria_id: colesterol.id })

  //Vitaminas
  const vitD = await Exame.create({ nome: 'Vitamina D', descricao: 'Avalia nível de vitamina D', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '3 dias', categoria_id: vitaminas.id })
  const vitB12 = await Exame.create({ nome: 'Vitamina B12', descricao: 'Avalia nível de vitamina B12', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '3 dias', categoria_id: vitaminas.id })
  const ferro = await Exame.create({ nome: 'Ferro Sérico', descricao: 'Avalia reservas de ferro', jejum: true, preparo: 'Jejum de 8 horas', tempo_resultado: '1 dia', categoria_id: vitaminas.id })

  //Diabetes
  const glicose = await Exame.create({ nome: 'Glicose', descricao: 'Mede o açúcar no sangue', jejum: true, preparo: 'Jejum de 8 a 12 horas', tempo_resultado: '1 dia', categoria_id: diabetes.id })
  const hba1c = await Exame.create({ nome: 'Hemoglobina Glicada (HbA1c)', descricao: 'Controle do diabetes nos últimos 3 meses', jejum: false, preparo: 'Nenhum preparo necessário', tempo_resultado: '3 dias', categoria_id: diabetes.id })

  //Recomendações
  await ExameRecomendado.bulkCreate([
    { exame_id: creatinina.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: ureia.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: colTotal.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: hdl.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: ldl.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: glicose.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: vitD.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: vitB12.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: tgo.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
    { exame_id: hba1c.id, sexo: 'ambos', idade_min: 0, idade_max: 120 },
  ])

  console.log('Banco populado com sucesso!')
  process.exit()
}

popular().catch((err) => {
  console.error('Erro ao popular banco:', err)
  process.exit(1)
})