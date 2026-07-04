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
    
    api.get('/categorias')
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Erro ao carregar categorias:", err))
  }, [])

  const toggleCategoria = (id) => {
    setSelecionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleCategoria(id)
    }
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
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>Guia de Exames Laboratoriais</span>
          <h1 style={styles.heroTitulo}>
            Descubra quais exames<br />você deve fazer
          </h1>
          <p style={styles.heroSub}>
            Selecione as categorias de interesse e receba sugestões
            personalizadas para levar ao laboratório da sua preferência.
          </p>

          <div style={styles.perfilRow}>
            <div style={styles.campo}>
              <label style={styles.labelBranca}>Sexo</label>
              <select
                value={sexo}
                onChange={e => setSexo(e.target.value)}
                style={styles.selectHero}
              >
                <option value="" style={{ backgroundColor: '#fff', color: '#111827' }}>
                  Não informar
                </option>
                <option value="M" style={{ backgroundColor: '#fff', color: '#111827' }}>
                  Masculino
                </option>
                <option value="F" style={{ backgroundColor: '#fff', color: '#111827' }}>
                  Feminino
                </option>
              </select>
            </div>
            <div style={styles.campo}>
              <label style={styles.labelBranca}>Idade</label>
              <input
                type="number"
                placeholder="Ex: 35"
                value={idade}
                onChange={e => setIdade(e.target.value)}
                onKeyDown={e => (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') && e.preventDefault()} // Impede caracteres inválidos em idades
                style={{ ...styles.selectHero, width: '110px' }}
                min="1"
                max="120"
              />
            </div>
          </div>
        </div>
      </div>

      {/*Conteudo*/}
      <div style={styles.container}>

        <div style={styles.secaoHeader}>
          <div>
            <h2 style={styles.secaoTitulo}>Escolha as categorias</h2>
            <p style={styles.secaoSub}>
              Clique nas categorias que deseja verificar
            </p>
          </div>
          {selecionadas.length > 0 && (
            <span style={styles.contadorBadge}>
              {selecionadas.length} selecionada{selecionadas.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={styles.grid}>
          {categorias.map(cat => {
            const sel = selecionadas.includes(cat.id)
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategoria(cat.id)}
                onKeyDown={(e) => handleKeyDown(e, cat.id)}
                tabIndex={0} 
                role="button" 
                aria-pressed={sel}
                style={{ ...styles.card, ...(sel ? styles.cardSel : {}) }}
              >
                {sel && <div style={styles.check}>✓</div>}
                <span style={styles.icone}>{cat.icone}</span>
                <strong style={styles.nomeCategoria}>{cat.nome}</strong>
                <p style={styles.descCategoria}>{cat.descricao}</p>
              </div>
            )
          })}
        </div>

        <button
          onClick={buscar}
          disabled={selecionadas.length === 0}
          style={{
            ...styles.botao,
            ...(selecionadas.length === 0 ? styles.botaoOff : {})
          }}
        >
          Ver exames recomendados →
        </button>

        <p style={styles.aviso}>
          Este site é um guia informativo e não substitui a orientação médica.
        </p>

      </div>
    </div>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1AB5BB 0%, #0D8A8F 100%)',
    padding: '72px 48px',
    display: 'flex',
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: '680px',
    width: '100%',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '5px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '0.4px',
  },
  heroTitulo: {
    color: '#FFFFFF',
    fontSize: '40px',
    fontWeight: '700',
    marginBottom: '16px',
    lineHeight: '1.2',
    fontFamily: "'Sora', sans-serif",
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '17px',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  perfilRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelBranca: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '13px',
    fontWeight: '600',
  },
  selectHero: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid rgba(255,255,255,0.3)',
    fontSize: '14px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    outline: 'none',
    minWidth: '160px',
    boxSizing: 'border-box'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '48px 20px 64px',
  },
  secaoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  secaoTitulo: {
    fontSize: '22px',
    color: '#2C3060',
    fontFamily: "'Sora', sans-serif",
  },
  secaoSub: {
    color: '#6B7280',
    fontSize: '14px',
    marginTop: '4px',
  },
  contadorBadge: {
    backgroundColor: '#C41E2C',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '5px 14px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    position: 'relative',
    padding: '24px 16px',
    borderRadius: '14px',
    border: '2px solid #E5E7EB',
    cursor: 'pointer',
    textAlign: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    outline: 'none', 
  },
  cardSel: {
    border: '2px solid #1AB5BB',
    backgroundColor: '#E0F7F8',
    boxShadow: '0 4px 16px rgba(26,181,187,0.18)',
    transform: 'translateY(-3px)',
  },
  check: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    backgroundColor: '#1AB5BB',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    fontSize: '38px',
    display: 'block',
    marginBottom: '10px',
  },
  nomeCategoria: {
    fontSize: '15px',
    color: '#2C3060',
    display: 'block',
    marginBottom: '6px',
    fontWeight: '700',
  },
  descCategoria: {
    fontSize: '12px',
    color: '#9CA3AF',
    lineHeight: '1.4',
  },
  botao: {
    display: 'block',
    width: '100%',
    padding: '18px',
    backgroundColor: '#C41E2C',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '20px',
    boxShadow: '0 4px 16px rgba(196,30,44,0.3)',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  },
  botaoOff: {
    backgroundColor: '#D1D5DB',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  aviso: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: '13px',
  }
}

export default Home