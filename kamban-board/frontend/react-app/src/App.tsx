
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import BoardsPage from './pages/boards';
import NotFoundPage from './pages/non-found';

import { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/boards');
  }, []);
  return <div>Redirecting to Boards...</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );

}
export default App
