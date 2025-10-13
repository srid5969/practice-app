
import { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import BoardsPage from './pages/boards';

function Home() {
  const navigate = useNavigate();
  navigate('/boards');
  return <div>Redirecting to Boards...</div>;
}

function App(){
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<BoardsPage />} />
      </Routes>
    </Router>
  );

}
export default App
