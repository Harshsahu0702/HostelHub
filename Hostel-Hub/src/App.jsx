import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DesktopLogin from "./pages/DesktopLogin";

function App() {


  return (<BrowserRouter>
      <Routes>
        <Route path="/" element={<DesktopLogin/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
