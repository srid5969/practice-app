
import { useState } from 'react';
import './App.css'

function App() {
  const [name, setName] = useState<string | undefined>(undefined)

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
        }}
      >Submit</button>
    </>
  )
}

export default App
