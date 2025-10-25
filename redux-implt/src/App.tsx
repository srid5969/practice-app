import './App.css'
import store from './app/store'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { SignUp } from './pages/sign-up';
import Home from './pages/home';
function App() {
  const state = store.getState()
  console.log('Current counter value:', state.counter.value)
  return (

    <BrowserRouter>

      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/home" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

