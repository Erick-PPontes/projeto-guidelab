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
        setCarregando(false)
      })
      .catch(() => {
        navigate('/login')
      })
  }, [])

  const deletar = async (id) => {
    if (!confirm('Deseja deletar esta lista?')) return
    try {
      await api.delete(`/listas/${id}`)
      setListas(prev => prev.filter(l => l.id !== id))
      if (listaSelecionada?.id === id) setListaSelecionada(null)
    } catch {
      alert('Erro ao deletar lista')
    }
  }

  if (carregando) {
    return (
      <div style={styles.loading}>
        <p>Carregando suas listas...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Minhas Listas</h1>
      <p style={styles.subtitulo}>
        Aqui estão todas as listas de exames que você salvou
      </p>

      {listas.length === 0 ? (
        <div style={styles.vazio}>
          <p style={styles.vaziTexto}>Você ainda não salvou nenhuma lista</p>
          <button
            onClick={() => navigate('/')}
            style={styles.botaoNova}
          >
            Criar minha primeira lista
          </button>
        </div>
      ) : (
        <div style={styles.layout}>

          {/* Lista de listas */}
          <div style={styles.coluna}>
            {listas.map(lista => (
              <div
                key={lista.id}
                onClick={() => setListaSelecionada(lista)}
                style={{
                  ...styles.card,
                  ...(listaSelecionada?.id === lista.id
                    ? styles.cardSelecionado : {})
                }}
              >
                <div style={styles.cardTopo}>
                  <strong style={styles.nomeLista}>{lista.nome_lista}</strong>
                  <button
                    onClick={e => { e.stopPropagation(); deletar(lista.id) }}
                    style={styles.botaoDeletar}
                  >
                    
                  </button>
                </div>
                <p style={styles.qtd}>
                  {lista.exames.length} exame(s)
                </p>
                <p style={styles.data}>
                  Salva em {new Date(lista.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}

            <button
              onClick={() => navigate('/')}
              style={styles.botaoNova}
            >
              + Nova lista
            </button>
          </div>

          {/* Detalhe da lista selecionada */}
          {listaSelecionada && (
            <div style={styles.detalhe}>
              <h2 style={styles.tituloDetalhe}>
                {listaSelecionada.nome_lista}
              </h2>
              <ul style={styles.listaExames}>
                {listaSelecionada.exames.map((exame, i) => (
                  <li key={i} style={styles.itemExame}>
                    <strong>{exame.nome}</strong>
                    {exame.jejum && (
                      <span style={styles.jejumTag}> • Requer jejum</span>
                    )}
                    {exame.preparo && (
                      <p style={styles.preparo}>Preparo: {exame.preparo}</p>
                    )}
                    {exame.tempo_resultado && (
                      <p style={styles.tempo}>
                        Resultado em: {exame.tempo_resultado}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.print()}
                style={styles.botaoImprimir}
              >
                 Imprimir lista
              </button>
            </div>
          )}
        </div>
      )}
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontFamily: 'sans-serif',
    color: '#666',
  },
  titulo: {
    fontSize: '28px',
    color: '#1a73e8',
    marginBottom: '8px',
  },
  subtitulo: {
    color: '#666',
    marginBottom: '32px',
  },
  vazio: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  vaziTexto: {
    color: '#888',
    fontSize: '18px',
    marginBottom: '24px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  coluna: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    cursor: 'pointer',
    backgroundColor: '#fff',
  },
  cardSelecionado: {
    border: '2px solid #1a73e8',
    backgroundColor: '#e8f0fe',
  },
  cardTopo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  nomeLista: {
    fontSize: '15px',
    color: '#222',
  },
  botaoDeletar: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  qtd: {
    fontSize: '13px',
    color: '#555',
    margin: '2px 0',
  },
  data: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
  botaoNova: {
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  detalhe: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '24px',
  },
  tituloDetalhe: {
    color: '#333',
    marginBottom: '16px',
    fontSize: '20px',
  },
  listaExames: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px',
  },
  itemExame: {
    padding: '12px 0',
    borderBottom: '1px solid #e0e0e0',
  },
  jejumTag: {
    color: '#e65100',
    fontSize: '13px',
  },
  preparo: {
    fontSize: '13px',
    color: '#666',
    margin: '4px 0 0',
  },
  tempo: {
    fontSize: '13px',
    color: '#888',
    margin: '4px 0 0',
  },
  botaoImprimir: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#fff',
    color: '#1a73e8',
    border: '2px solid #1a73e8',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  }
}

export default MinhasListas