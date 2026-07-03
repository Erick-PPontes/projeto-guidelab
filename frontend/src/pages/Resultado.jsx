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

  useEffect(() => {
    if (!state) { navigate('/'); return }

    const { sexo, idade, categorias } = state

    // Busca recomendados
    const params = new URLSearchParams()
    if (sexo) params.append('sexo', sexo)
    if (idade) params.append('idade', idade)

    api.get(`/exames/recomendados?${params}`).then(res => {
      const ids = res.data.map(r => r.exame)
      setExamesRecomendados(res.data.map(r => r.exame))
      setListaSelecionada(res.data.map(r => r.exame))
    })

    // Busca todos os exames das categorias selecionadas
    Promise.all(
      categorias.map(id => api.get(`/exames/categoria/${id}`))
    ).then(resultados => {
      const todos = resultados.flatMap(r => r.data)
      setTodosExames(todos)
    })
  }, [])

  const toggleExame = (exame) => {
    setListaSelecionada(prev =>
      prev.find(e => e.id === exame.id)
        ? prev.filter(e => e.id !== exame.id)
        : [...prev, exame]
    )
  }

  const salvarLista = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    setSalvando(true)
    try {
      await api.post('/listas', {
        nome_lista: nomeLista,
        exames: listaSelecionada
      })
      setSalvo(true)
    } catch {
      alert('Erro ao salvar lista')
    }
    setSalvando(false)
  }

  const examesExtras = todosExames.filter(
    e => !examesRecomendados.find(r => r.id === e.id)
  )

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.voltar}>
        ← Voltar
      </button>

      <h1 style={styles.titulo}>Exames Recomendados</h1>
      <p style={styles.subtitulo}>
        Baseado no seu perfil, sugerimos os seguintes exames:
      </p>

      {/* Recomendados */}
      {examesRecomendados.length > 0 && (
        <>
          <h2 style={styles.secao}>⭐ Sugeridos para você</h2>
          <div style={styles.grid}>
            {examesRecomendados.map(exame => (
              <div
                key={exame.id}
                onClick={() => toggleExame(exame)}
                style={{
                  ...styles.card,
                  ...(listaSelecionada.find(e => e.id === exame.id)
                    ? styles.cardSelecionado : {})
                }}
              >
                <strong style={styles.nomeExame}>{exame.nome}</strong>
                <p style={styles.desc}>{exame.descricao}</p>
                {exame.jejum && (
                  <span style={styles.badge}>⏰ Requer jejum</span>
                )}
                <p style={styles.tempo}>
                   Resultado: {exame.tempo_resultado}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Extras */}
      {examesExtras.length > 0 && (
        <>
          <h2 style={styles.secao}>➕ Adicionar mais exames</h2>
          <div style={styles.grid}>
            {examesExtras.map(exame => (
              <div
                key={exame.id}
                onClick={() => toggleExame(exame)}
                style={{
                  ...styles.card,
                  ...(listaSelecionada.find(e => e.id === exame.id)
                    ? styles.cardSelecionado : {})
                }}
              >
                <strong style={styles.nomeExame}>{exame.nome}</strong>
                <p style={styles.desc}>{exame.descricao}</p>
                {exame.jejum && (
                  <span style={styles.badge}>⏰ Requer jejum</span>
                )}
                <p style={styles.tempo}>
                   Resultado: {exame.tempo_resultado}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Resumo final */}
      {listaSelecionada.length > 0 && (
        <div style={styles.resumo}>
          <h2 style={styles.secaoResumo}>
             Sua lista ({listaSelecionada.length} exames)
          </h2>
          <ul style={styles.lista}>
            {listaSelecionada.map(e => (
              <li key={e.id} style={styles.itemLista}>
                <strong>{e.nome}</strong>
                {e.jejum && <span style={styles.jejumTag}> • Jejum necessário</span>}
                {e.preparo && (
                  <p style={styles.preparo}>Preparo: {e.preparo}</p>
                )}
              </li>
            ))}
          </ul>

          <input
            value={nomeLista}
            onChange={e => setNomeLista(e.target.value)}
            style={styles.inputNome}
            placeholder="Nome da sua lista"
          />

          {salvo ? (
            <p style={styles.salvoMsg}>✅ Lista salva com sucesso!</p>
          ) : (
            <button
              onClick={salvarLista}
              style={styles.botaoSalvar}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : '💾 Salvar lista'}
            </button>
          )}

          <button
            onClick={() => window.print()}
            style={styles.botaoImprimir}
          >
             Imprimir lista
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' },
  voltar: { background: 'none', border: 'none', color: '#1a73e8', fontSize: '16px', cursor: 'pointer', marginBottom: '16px' },
  titulo: { fontSize: '28px', color: '#1a73e8', marginBottom: '8px' },
  subtitulo: { color: '#666', marginBottom: '32px' },
  secao: { color: '#333', marginBottom: '16px', fontSize: '20px' },
  secaoResumo: { color: '#333', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { padding: '16px', borderRadius: '12px', border: '2px solid #e0e0e0', cursor: 'pointer', backgroundColor: '#fff' },
  cardSelecionado: { border: '2px solid #1a73e8', backgroundColor: '#e8f0fe' },
  nomeExame: { fontSize: '15px', color: '#222', display: 'block', marginBottom: '6px' },
  desc: { fontSize: '13px', color: '#666', margin: '4px 0' },
  badge: { fontSize: '12px', backgroundColor: '#fff3e0', color: '#e65100', padding: '2px 8px', borderRadius: '10px', display: 'inline-block' },
  tempo: { fontSize: '12px', color: '#888', marginTop: '8px' },
  resumo: { backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '24px', marginTop: '16px' },
  lista: { listStyle: 'none', padding: 0, marginBottom: '16px' },
  itemLista: { padding: '10px 0', borderBottom: '1px solid #e0e0e0' },
  jejumTag: { color: '#e65100', fontSize: '13px' },
  preparo: { fontSize: '13px', color: '#666', margin: '4px 0 0' },
  inputNome: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  botaoSalvar: { width: '100%', padding: '14px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '8px' },
  botaoImprimir: { width: '100%', padding: '14px', backgroundColor: '#fff', color: '#1a73e8', border: '2px solid #1a73e8', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  salvoMsg: { color: '#2e7d32', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }
}

export default Resultado