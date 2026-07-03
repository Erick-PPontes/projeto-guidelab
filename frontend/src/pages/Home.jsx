import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Home() {
  const [categorias, setCategorias] = useState([])
  const [selecionadas, setSelecionadas] = useState([])
  const [sexo, setSexo] = useState('')
  const [idade, setIdade] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/categorias').then(res => setCategorias(res.data))
  }, [])

  const toggleCategoria = (id) => {
    setSelecionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const buscar = () => {
    if (selecionadas.length === 0) {
      alert('Selecione ao menos uma categoria!')
      return
    }
    navigate('/resultado', {
      state: { categorias: selecionadas, sexo, idade }
    })
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Descubra quais exames fazer</h1>
      <p style={styles.subtitulo}>
        Selecione as categorias de interesse e receba sugestões personalizadas
      </p>

      {/* Perfil opcional */}
      <div style={styles.perfil}>
        <div style={styles.campo}>
          <label style={styles.label}>Sexo (opcional)</label>
          <select
            value={sexo}
            onChange={e => setSexo(e.target.value)}
            style={styles.select}
          >
            <option value="">Prefiro não informar</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Idade (opcional)</label>
          <input
            type="number"
            placeholder="Ex: 30"
            value={idade}
            onChange={e => setIdade(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Categorias */}
      <h2 style={styles.secao}>Escolha as categorias:</h2>
      <div style={styles.grid}>
        {categorias.map(cat => (
          <div
            key={cat.id}
            onClick={() => toggleCategoria(cat.id)}
            style={{
              ...styles.card,
              ...(selecionadas.includes(cat.id) ? styles.cardSelecionado : {})
            }}
          >
            <span style={styles.icone}>{cat.icone}</span>
            <strong style={styles.nomeCategoria}>{cat.nome}</strong>
            <p style={styles.descCategoria}>{cat.descricao}</p>
          </div>
        ))}
      </div>

      <button
        onClick={buscar}
        style={styles.botao}
        disabled={selecionadas.length === 0}
      >
        Ver exames recomendados →
      </button>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'sans-serif',
  },
  titulo: {
    fontSize: '32px',
    color: '#1a73e8',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '16px',
  },
  perfil: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    justifyContent: 'center',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    color: '#444',
    fontWeight: 'bold',
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    minWidth: '180px',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    width: '100px',
  },
  secao: {
    color: '#333',
    marginBottom: '16px',
    fontSize: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    backgroundColor: '#fff',
  },
  cardSelecionado: {
    border: '2px solid #1a73e8',
    backgroundColor: '#e8f0fe',
  },
  icone: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '8px',
  },
  nomeCategoria: {
    fontSize: '16px',
    color: '#333',
    display: 'block',
    marginBottom: '6px',
  },
  descCategoria: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  botao: {
    display: 'block',
    width: '100%',
    padding: '16px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
}

export default Home