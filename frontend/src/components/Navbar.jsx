import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const nome = localStorage.getItem('nome')

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nome')
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        GuideLab
      </Link>

      <div style={styles.links}>
        {token ? (
          <>
            <span style={styles.bemvindo}>Olá, {nome}!</span>
            <Link to="/minhas-listas" style={styles.link}>Minhas Listas</Link>
            <button onClick={sair} style={styles.botaoSair}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Entrar</Link>
            <Link to="/cadastro" style={styles.botaoCadastro}>Criar conta</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: '#1a73e8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  logo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '22px',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '15px',
  },
  bemvindo: {
    color: '#fff',
    fontSize: '15px',
  },
  botaoCadastro: {
    backgroundColor: '#fff',
    color: '#1a73e8',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  botaoSair: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: '1px solid #fff',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
  }
}

export default Navbar