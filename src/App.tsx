import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './Layout/Layout'
import { Home } from './pages/Home'
import { Tunel1 } from './pages/Tunel1'
import { Tunel2 } from './pages/Tunel2'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} >
          <Route path="/" element={<Navigate to="/lectura/viewer" replace />} />
          <Route path="/lectura/viewer" element={<Home />} />
          <Route path="/lectura/viewer/1" element={<Tunel1 />} />
          <Route path="/lectura/viewer/2" element={<Tunel2 />} />
          {/* <Route path="/lectura/viewer/3" element={<Tunel3 />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
