import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-4xl font-bold">Admin Dashboard</div>} />
      </Routes>
    </Router>
  )
}

export default App
