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
      <Link to="/">
        <img src="/logo.png" alt="GuideLab" style={styles.logo} />
      </Link>

      <div style={styles.links}>
        {token ? (
          <>
            <Link to="/minhas-listas" style={styles.linkNav}>
               Minhas Listas
            </Link>
            <div style={styles.usuario}>
              <div style={styles.avatar}>
                {nome?.charAt(0).toUpperCase()}
              </div>
              <span style={styles.nomeUsuario}>{nome}</span>
            </div>
            <button onClick={sair} style={styles.botaoSair}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.linkNav}>Entrar</Link>
            <Link to="/cadastro" style={styles.botaoCadastro}>
              Criar conta
            </Link>
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
    padding: '0 48px',
    height: '72px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 8px rgba(0,0,0,0.09)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxSizing: 'border-box', 
  },
  logo: {
    height: '100px',
    width: 'auto',
    display: 'block',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', 
  },
  linkNav: {
    color: '#2C3060',
    fontSize: '15px',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none', 
    fontFamily: "'Inter', sans-serif",
  },
  usuario: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#E0F7F8',
    padding: '6px 14px 6px 6px',
    borderRadius: '20px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#1AB5BB',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },
  nomeUsuario: {
    color: '#2C3060',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'Inter', sans-serif",
  },
  botaoCadastro: {
    backgroundColor: '#C41E2C',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    textDecoration: 'none', 
    fontFamily: "'Inter', sans-serif",
    display: 'inline-block',
  },
  botaoSair: {
    backgroundColor: 'transparent',
    color: '#C41E2C',
    border: '1.5px solid #C41E2C',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer', 
    fontFamily: "'Inter', sans-serif",
  }
}

export default Navbar