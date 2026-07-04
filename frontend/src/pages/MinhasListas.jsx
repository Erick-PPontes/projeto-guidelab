import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function MinhasListas() {
  const [listas, setListas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [listaSelecionada, setListaSelecionada] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    api.get('/listas')
      .then(res => {
        setListas(res.data)
        if (res.data.length > 0) setListaSelecionada(res.data[0])
        setCarregando(false)
      })
      .catch(() => navigate('/login'))
  }, [navigate]) 

  const deletar = async (id) => {
    if (!window.confirm('Deseja deletar esta lista?')) return
    try {
      await api.delete(`/listas/${id}`)
      const novas = listas.filter(l => l.id !== id)
      setListas(novas)
      setListaSelecionada(novas.length > 0 ? novas[0] : null)
    } catch {
      alert('Erro ao deletar lista')
    }
  }

  
  const handleKeyDown = (e, lista) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setListaSelecionada(lista)
    }
  }

  if (carregando) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingIcon}></div> {/* Emoji provisório */}
        <p style={styles.loadingTexto}>Carregando suas listas...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.titulo}>Minhas Listas</h1>
          <p style={styles.subtitulo}>
            Gerencie suas listas de exames salvas
          </p>
        </div>
      </div>

      <div style={styles.container}>

        {listas.length === 0 ? (
          /* vazio */
          <div style={styles.vazio}>
            <div style={styles.vazioIcone}></div> {/* Emoji provisório */}
            <h2 style={styles.vazioTitulo}>Nenhuma lista salva ainda</h2>
            <p style={styles.vazioDesc}>
              Acesse a página inicial, selecione as categorias e salve sua
              primeira lista de exames.
            </p>
            <button
              onClick={() => navigate('/')}
              style={styles.botaoNova}
            >
              Criar minha primeira lista
            </button>
          </div>
        ) : (
          <div style={styles.layout}>

            {/*coluna esquerda */}
            <div style={styles.coluna}>
              <div style={styles.colunaHeader}>
                <h2 style={styles.colunaTitulo}>
                  Suas listas
                  <span style={styles.contador}>{listas.length}</span>
                </h2>
                <button
                  onClick={() => navigate('/')}
                  style={styles.botaoNova}
                >
                  + Nova lista
                </button>
              </div>

              <div style={styles.listaCards}>
                {listas.map(lista => (
                  <div
                    key={lista.id}
                    onClick={() => setListaSelecionada(lista)}
                    onKeyDown={(e) => handleKeyDown(e, lista)} // Acessibilidade via teclado
                    tabIndex={0}
                    role="button"
                    aria-pressed={listaSelecionada?.id === lista.id}
                    style={{
                      ...styles.card,
                      ...(listaSelecionada?.id === lista.id ? styles.cardSel : {})
                    }}
                  >
                    <div style={styles.cardTopo}>
                      <div style={styles.cardIcone}></div> {/* Emoji provisório */}
                      <button
                        onClick={e => { e.stopPropagation(); deletar(lista.id) }}
                        style={styles.botaoDeletar}
                        title="Deletar lista"
                      >
                         
                      </button>
                    </div>
                    <strong style={styles.cardNome}>{lista.nome_lista}</strong>
                    <div style={styles.cardInfo}>
                      <span style={styles.cardQtd}>
                        {lista.exames.length} exame{lista.exames.length !== 1 ? 's' : ''}
                      </span>
                      <span style={styles.cardData}>
                        {new Date(lista.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*coluna direita */}
            {listaSelecionada && (
              <div style={styles.detalhe}>
                <div style={styles.detalheHeader}>
                  <h2 style={styles.detalheTitulo}>
                    {listaSelecionada.nome_lista}
                  </h2>
                  <span style={styles.detalheBadge}>
                    {listaSelecionada.exames.length} exame{listaSelecionada.exames.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <p style={styles.detalheSub}>
                  Salva em {new Date(listaSelecionada.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>

                <div style={styles.divisor} />

                <ul style={styles.listaExames}>
                  {listaSelecionada.exames.map((exame, i) => (
                    <li key={i} style={styles.itemExame}>
                      <div style={styles.itemTopo}>
                        <strong style={styles.itemNome}>{exame.nome}</strong>
                        {exame.jejum && (
                          <span style={styles.tagJejum}> Jejum</span>
                        )}
                      </div>
                      {exame.preparo && (
                        <p style={styles.itemPreparo}>
                           Preparo: {exame.preparo}
                        </p>
                      )}
                      {exame.tempo_resultado && (
                        <p style={styles.itemTempo}>
                           Resultado em: {exame.tempo_resultado}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>

                <div style={styles.divisor} />

                <button
                  onClick={() => window.print()}
                  style={styles.botaoImprimir}
                >
                    Imprimir esta lista
                </button>
              </div>
            )}

          </div>
        )}
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
    fontFamily: "'Inter', sans-serif",
  },
  loadingIcon: {
    fontSize: '48px',
  },
  loadingTexto: {
    color: '#6B7280',
    fontSize: '16px',
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
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box'
  },
  vazio: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  vazioIcone: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  vazioTitulo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '22px',
    color: '#2C3060',
    marginBottom: '12px',
  },
  vazioDesc: {
    color: '#6B7280',
    fontSize: '15px',
    marginBottom: '28px',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto 28px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  coluna: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  colunaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  colunaTitulo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '16px',
    color: '#2C3060',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  contador: {
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
    fontSize: '12px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  listaCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    border: '2px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    outline: 'none',
  },
  cardSel: {
    border: '2px solid #1AB5BB',
    backgroundColor: '#E0F7F8',
    boxShadow: '0 4px 12px rgba(26,181,187,0.15)',
  },
  cardTopo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardIcone: {
    fontSize: '20px',
  },
  botaoDeletar: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    padding: '4px',
    opacity: '0.6',
    transition: 'opacity 0.2s',
  },
  cardNome: {
    fontSize: '14px',
    color: '#2C3060',
    display: 'block',
    marginBottom: '8px',
    fontWeight: '700',
    lineHeight: '1.3',
  },
  cardInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardQtd: {
    fontSize: '12px',
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
    padding: '3px 10px',
    borderRadius: '10px',
    fontWeight: '600',
  },
  cardData: {
    fontSize: '11px',
    color: '#9CA3AF',
  },
  botaoNova: {
    backgroundColor: '#C41E2C',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    boxShadow: '0 2px 8px rgba(196,30,44,0.25)',
  },
  detalhe: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '1px solid #E5E7EB',
    position: 'sticky',
    top: '88px',
    boxSizing: 'border-box'
  },
  detalheHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  detalheTitulo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '20px',
    color: '#2C3060',
  },
  detalheBadge: {
    backgroundColor: '#C41E2C',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '3px 12px',
    borderRadius: '20px',
  },
  detalheSub: {
    color: '#9CA3AF',
    fontSize: '13px',
    marginBottom: '4px',
  },
  divisor: {
    height: '1px',
    backgroundColor: '#F3F4F6',
    margin: '16px 0',
  },
  listaExames: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  itemExame: {
    padding: '12px 0',
    borderBottom: '1px solid #F9FAFB',
  },
  itemTopo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  itemNome: {
    fontSize: '14px',
    color: '#2C3060',
    fontWeight: '700',
  },
  tagJejum: {
    fontSize: '11px',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: '600',
  },
  itemPreparo: {
    fontSize: '12px',
    color: '#6B7280',
    margin: '3px 0 0',
  },
  itemTempo: {
    fontSize: '12px',
    color: '#9CA3AF',
    margin: '2px 0 0',
  },
  botaoImprimir: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#1AB5BB',
    border: '2px solid #1AB5BB',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box'
  },
}

export default MinhasListas