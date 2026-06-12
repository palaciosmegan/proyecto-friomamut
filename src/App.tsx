import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RootDataProvider } from './RootDataProvider'
import { Calibradores } from './pages/Calibradores'
import { Tuneles } from './pages/Tuneles'

function App() {
  return (
    <BrowserRouter>
      <RootDataProvider>
        <Routes>
          <Route path="/" element={<Tuneles />} />
          <Route path="/calibradores" element={<Calibradores />} />
        </Routes>
      </RootDataProvider>
    </BrowserRouter>
  )
}

export default App
