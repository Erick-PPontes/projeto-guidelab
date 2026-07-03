import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const cadastrar = async () => {
    if (!nome || !email || !senha || !confirmar) {
      setErro('Preencha todos os campos')
      return
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setCarregando(true)
    setErro('')
    try {
      await api.post('/auth/cadastrar', { nome, email, senha })
      // Loga automaticamente após cadastro
      const res = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('nome', res.data.nome)
      navigate('/')
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao criar conta')
    }
    setCarregando(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.caixa}>
        <h1 style={styles.titulo}>🧪 GuideLab</h1>
        <p style={styles.subtitulo}>Crie sua conta</p>

        {erro && <p style={styles.erro}>{erro}</p>}

        <div style={styles.campo}>
          <label style={styles.label}>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome"
            style={styles.input}
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={styles.input}
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            style={styles.input}
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>Confirmar senha</label>
          <input
            type="password"
            value={confirmar}
            onChange={e => setConfirmar(e.target.value)}
            placeholder="Repita a senha"
            style={styles.input}
            onKeyDown={e => e.key === 'Enter' && cadastrar()}
          />
        </div>

        <button
          onClick={cadastrar}
          style={styles.botao}
          disabled={carregando}
        >
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p style={styles.rodape}>
          Já tem conta?{' '}
          <Link to="/login" style={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    fontFamily: 'sans-serif',
  },
  caixa: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  titulo: {
    textAlign: 'center',
    color: '#1a73e8',
    marginBottom: '4px',
  },
  subtitulo: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '24px',
  },
  erro: {
    backgroundColor: '#fce8e6',
    color: '#c62828',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
  campo: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    outline: 'none',
  },
  botao: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  rodape: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
  link: {
    color: '#1a73e8',
    fontWeight: 'bold',
    textDecoration: 'none',
  }
}

export default Cadastro