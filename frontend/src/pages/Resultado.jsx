import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Resultado() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [examesRecomendados, setExamesRecomendados] = useState([])
  const [todosExames, setTodosExames] = useState([])
  const [listaSelecionada, setListaSelecionada] = useState([])
  const [nomeLista, setNomeLista] = useState('Minha lista de exames')
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!state) { navigate('/'); return }

    const { sexo, idade, categorias } = state
    const params = new URLSearchParams()
    if (sexo) params.append('sexo', sexo)
    if (idade) params.append('idade', idade)

    api.get(`/exames/recomendados?${params}`)
      .then(res => {
        const exames = res.data
          .map(r => r.exame)
          .filter(e => e !== null && e !== undefined)
        setExamesRecomendados(exames)
        setListaSelecionada(exames) 
      })
      .catch(err => console.error("Erro ao carregar recomendados:", err))

    Promise.all(
      categorias.map(id => api.get(`/exames/categoria/${id}`))
    ).then(resultados => {
      const todos = resultados.flatMap(r => r.data)
      setTodosExames(todos)
      setCarregando(false)
    }).catch(err => {
      console.error("Erro ao carregar exames por categoria:", err)
      setCarregando(false)
    })
  }, [state, navigate])

  const toggleExame = (exame) => {
    setListaSelecionada(prev =>
      prev.find(e => e.id === exame.id)
        ? prev.filter(e => e.id !== exame.id)
        : [...prev, exame]
    )
    setSalvo(false) 
  }

  const handleKeyDown = (e, exame) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleExame(exame)
    }
  }

  const salvarLista = async () => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    if (listaSelecionada.length === 0) {
      alert('Selecione pelo menos um exame para salvar.')
      return
    }
    
    setSalvando(true)
    try {
      await api.post('/listas', { nome_lista: nomeLista, exames: listaSelecionada })
      setSalvo(true)
    } catch {
      alert('Erro ao salvar lista. Tente novamente.')
    }
    setSalvando(false)
  }

  const examesExtras = todosExames.filter(
    e => !examesRecomendados.find(r => r.id === e.id)
  )

  if (carregando) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingTexto}>Buscando exames para você...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <button onClick={() => navigate('/')} style={styles.voltar}>
            ← Voltar
          </button>
          <h1 style={styles.titulo}>Exames Recomendados</h1>
          <p style={styles.subtitulo}>
            Clique nos exames para adicionar ou remover da sua lista
          </p>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.layout}>

          <div style={styles.colunaExames}>

            {examesRecomendados.length > 0 && (
              <div style={styles.secao}>
                <div style={styles.secaoHeader}>
                  <div>
                    <h2 style={styles.secaoTitulo}>Sugeridos para você</h2>
                    <p style={styles.secaoSub}>Baseado no seu perfil</p>
                  </div>
                </div>
                <div style={styles.grid}>
                  {examesRecomendados.map(exame => {
                    const sel = listaSelecionada.find(e => e.id === exame.id)
                    return (
                      <div
                        key={exame.id}
                        onClick={() => toggleExame(exame)}
                        onKeyDown={(e) => handleKeyDown(e, exame)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={!!sel}
                        style={{ ...styles.card, ...(sel ? styles.cardSel : {}) }}
                      >
                        {sel && <div style={styles.check}>✓</div>}
                        <strong style={styles.nomeExame}>{exame.nome}</strong>
                        <p style={styles.descExame}>{exame.descricao}</p>
                        <div style={styles.cardTags}>
                          {exame.jejum && (
                            <span style={styles.tagJejum}> Jejum</span>
                          )}
                          <span style={styles.tagTempo}>
                             {exame.tempo_resultado}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {examesExtras.length > 0 && (
              <div style={styles.secao}>
                <div style={styles.secaoHeader}>
                  <div>
                    <h2 style={styles.secaoTitulo}>Adicionar mais exames</h2>
                    <p style={styles.secaoSub}>Outros exames disponíveis nas categorias selecionadas</p>
                  </div>
                </div>
                <div style={styles.grid}>
                  {examesExtras.map(exame => {
                    const sel = listaSelecionada.find(e => e.id === exame.id)
                    return (
                      <div
                        key={exame.id}
                        onClick={() => toggleExame(exame)}
                        onKeyDown={(e) => handleKeyDown(e, exame)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={!!sel}
                        style={{ ...styles.card, ...(sel ? styles.cardSel : {}) }}
                      >
                        {sel && <div style={styles.check}>✓</div>}
                        <strong style={styles.nomeExame}>{exame.nome}</strong>
                        <p style={styles.descExame}>{exame.descricao}</p>
                        <div style={styles.cardTags}>
                          {exame.jejum && (
                            <span style={styles.tagJejum}> Jejum</span>
                          )}
                          <span style={styles.tagTempo}>
                             {exame.tempo_resultado}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={styles.colunaResumo}>
            <div style={styles.resumoCard}>
              <h2 style={styles.resumoTitulo}>
                Sua Lista
                <span style={styles.resumoBadge}>
                  {listaSelecionada.length}
                </span>
              </h2>

              {listaSelecionada.length === 0 ? (
                <p style={styles.listaVazia}>
                  Selecione exames ao lado para montar sua lista
                </p>
              ) : (
                <ul style={styles.listaExames}>
                  {listaSelecionada.map(e => (
                    <li key={e.id} style={styles.itemExame}>
                      <div style={styles.itemHeader}>
                        <strong style={styles.itemNome}>{e.nome}</strong>
                        <button
                          onClick={() => toggleExame(e)}
                          style={styles.itemRemover}
                          title="Remover exame"
                        >
                          ✕
                        </button>
                      </div>
                      {e.jejum && (
                        <span style={styles.itemJejum}>Requer jejum</span>
                      )}
                      {e.preparo && (
                        <p style={styles.itemPreparo}>{e.preparo}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {listaSelecionada.length > 0 && (
                <>
                  <div style={styles.divisor} />

                  <div style={styles.campo}>
                    <label style={styles.label}>Nome da lista</label>
                    <input
                      value={nomeLista}
                      onChange={e => {
                        setNomeLista(e.target.value)
                        setSalvo(false)
                      }}
                      style={styles.inputNome}
                      placeholder="Ex: Checkup anual"
                    />
                  </div>

                  {salvo ? (
                    <div style={styles.salvoMsg}>
                       Lista salva com sucesso!
                    </div>
                  ) : (
                    <button
                      onClick={salvarLista}
                      style={styles.botaoSalvar}
                      disabled={salvando}
                    >
                      {salvando ? 'Salvando...' : 'Salvar lista'}
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    style={styles.botaoImprimir}
                  >
                     Imprimir lista
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  loading: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #F3F4F6',
    borderTop: '4px solid #1AB5BB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingTexto: {
    color: '#6B7280',
    fontSize: '16px',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #1AB5BB 0%, #0D8A8F 100%)',
    padding: '40px 48px',
    boxSizing: 'border-box'
  },
  headerContent: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  voltar: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '16px',
    fontFamily: "'Inter', sans-serif",
    transition: 'background 0.2s',
  },
  titulo: {
    color: '#fff',
    fontSize: '28px',
    fontFamily: "'Sora', sans-serif",
    marginBottom: '6px',
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '15px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 20px 64px',
    boxSizing: 'border-box'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '28px',
    alignItems: 'start',
  },
  colunaExames: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  secao: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
  },
  secaoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '20px',
  },
  secaoTitulo: {
    fontSize: '18px',
    color: '#2C3060',
    fontFamily: "'Sora', sans-serif",
  },
  secaoSub: {
    fontSize: '13px',
    color: '#9CA3AF',
    marginTop: '2px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  },
  card: {
    position: 'relative',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    cursor: 'pointer',
    backgroundColor: '#F8F9FB',
    transition: 'all 0.2s ease',
    userSelect: 'none',
    outline: 'none', 
  },
  cardSel: {
    border: '2px solid #1AB5BB',
    backgroundColor: '#E0F7F8',
    boxShadow: '0 4px 12px rgba(26,181,187,0.15)',
    transform: 'translateY(-2px)',
  },
  check: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#1AB5BB',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeExame: {
    fontSize: '14px',
    color: '#2C3060',
    display: 'block',
    marginBottom: '6px',
    fontWeight: '700',
    lineHeight: '1.3',
    fontFamily: "'Sora', sans-serif",
  },
  descExame: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  tagJejum: {
    fontSize: '11px',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '600',
  },
  tagTempo: {
    fontSize: '11px',
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  colunaResumo: {
    position: 'sticky',
    top: '88px',
    boxSizing: 'border-box'
  },
  resumoCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
    boxSizing: 'border-box'
  },
  resumoTitulo: {
    fontSize: '18px',
    color: '#2C3060',
    fontFamily: "'Sora', sans-serif",
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  resumoBadge: {
    backgroundColor: '#C41E2C',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '700',
    padding: '2px 10px',
    borderRadius: '20px',
  },
  listaVazia: {
    color: '#9CA3AF',
    fontSize: '14px',
    textAlign: 'center',
    padding: '24px 0',
    lineHeight: '1.5',
  },
  listaExames: {
    listStyle: 'none',
    padding: 0,
    maxHeight: '320px',
    overflowY: 'auto',
  },
  itemExame: {
    padding: '10px 0',
    borderBottom: '1px solid #F3F4F6',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '4px',
  },
  itemNome: {
    fontSize: '13px',
    color: '#2C3060',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  itemRemover: {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '0',
    flexShrink: 0,
    transition: 'color 0.2s',
  },
  itemJejum: {
    fontSize: '11px',
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    padding: '2px 8px',
    borderRadius: '10px',
    display: 'inline-block',
    marginBottom: '4px',
  },
  itemPreparo: {
    fontSize: '11px',
    color: '#9CA3AF',
    margin: 0,
    lineHeight: '1.4',
  },
  divisor: {
    height: '1px',
    backgroundColor: '#F3F4F6',
    margin: '16px 0',
  },
  campo: {
    marginBottom: '12px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    display: 'block',
    marginBottom: '6px',
  },
  inputNome: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1.5px solid #E5E7EB',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
  },
  salvoMsg: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '8px',
  },
  botaoSalvar: {
    width: '100%',
    padding: '13px',
    backgroundColor: '#C41E2C',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '8px',
    boxShadow: '0 4px 12px rgba(196,30,44,0.25)',
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.2s',
  },
  botaoImprimir: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#1AB5BB',
    border: '2px solid #1AB5BB',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'background 0.2s',
  },
}

export default Resultado