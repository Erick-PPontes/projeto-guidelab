import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Resultado from './pages/Resultado'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MinhasListas from './pages/MinhasListas'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/minhas-listas" element={<MinhasListas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App