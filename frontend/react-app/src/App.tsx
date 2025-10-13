
import { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';

function Home() {
  const [name, setName] = useState<string | undefined>(undefined)
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome</h1>
      <div>
        <label>
          Please Enter Your Name :
          <input
            type="text"
            name="username"
            value={name ?? ''}
            onChange={e => setName(e.target.value)}
          />
        </label>

      </div>
      <button
        onClick={() => {
          if (!name) {
            alert('Kindly enter your name');
            return;
          }

          alert(`Vanakkam ${name} , 
            Ungalai Sridhar Anbudan varaverkiraar`);
            navigate('/dashboard');
        }}
      >Submit</button>
    </>
  )
}

function App(){
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );

}
export default App
