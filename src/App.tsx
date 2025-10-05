
import './App.css'

function App() {

  return (
    <>
      <h1>Welcome</h1>
      <div>
        <label>
         Please Enter Your Name :
          <input type="text" name="username" />
        </label>
     
      </div>
      <button
        onClick={() => {
          alert('Submit button clicked');
        }}
      >Submit</button>
    </>
  )
}

export default App
