import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RootDataProvider } from './RootDataProvider'
import { Calibradores } from './pages/Calibradores'
import { Tuneles } from './pages/Tuneles'
import { Balizas } from './pages/Balizas'

function App() {
  return (
    <BrowserRouter>
      <RootDataProvider>
        <Routes>
          <Route path="/" element={<Tuneles />} />
          <Route path="/calibradores" element={<Calibradores />} />
          <Route path="/balizas" element={<Balizas />} />
        </Routes>
      </RootDataProvider>
    </BrowserRouter>
  )
}

export default App
