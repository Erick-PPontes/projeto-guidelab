import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  
  const entrar = async (e) => {
    e.preventDefault()
    
    if (!email || !senha) { setErro('Preencha todos os campos'); return }
    setCarregando(true)
    setErro('')
    
    try {
      const res = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('nome', res.data.nome)
      navigate('/')
    } catch {
      setErro('Email ou senha incorretos')
    }
    setCarregando(false)
  }

  return (
    <div style={styles.pagina}>
      <div style={styles.caixa}>
        <div style={styles.topo}>
          <img src="/logo.png" alt="GuideLab" style={styles.logo} />
          <h1 style={styles.titulo}>Bem-vindo de volta</h1>
          <p style={styles.subtitulo}>Entre na sua conta para acessar suas listas</p>
        </div>

        {erro && <div style={styles.erro}>{erro}</div>}

        <form onSubmit={entrar}>
          <div style={styles.campo}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={styles.input}
              autoComplete="email" // sugerir o email
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              autoComplete="current-password" // sugerir a senha
            />
          </div>

          <button type="submit" style={styles.botao} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={styles.divisor}>
          <span style={styles.divisorTexto}>Não tem uma conta?</span>
        </div>

        <Link to="/cadastro" style={styles.botaoSecundario}>
          Criar conta gratuita
        </Link>

        <p style={styles.aviso}>
           Suas informações são mantidas em segurança
        </p>
      </div>
    </div>
  )
}

const styles = {
  pagina: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FB',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box'
  },
  caixa: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #E5E7EB',
    boxSizing: 'border-box'
  },
  topo: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    height: '150px',
    width: 'auto',
    marginBottom: '16px',
  },
  titulo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '22px',
    color: '#2C3060',
    marginBottom: '6px',
  },
  subtitulo: {
    color: '#6B7280',
    fontSize: '14px',
  },
  erro: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
    border: '1px solid #FECACA',
  },
  campo: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #E5E7EB',
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    transition: 'border 0.2s',
    width: '100%',
    boxSizing: 'border-box' 
  },
  botao: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#C41E2C',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(196,30,44,0.25)',
    boxSizing: 'border-box'
  },
  divisor: {
    textAlign: 'center',
    margin: '20px 0',
  },
  divisorTexto: {
    color: '#9CA3AF',
    fontSize: '14px',
  },
  botaoSecundario: {
    display: 'block',
    width: '100%',
    padding: '13px',
    backgroundColor: 'transparent',
    color: '#1AB5BB',
    border: '2px solid #1AB5BB',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  aviso: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: '12px',
    marginTop: '20px',
  }
}

export default Login