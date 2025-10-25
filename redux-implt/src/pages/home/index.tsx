import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { decrement, increment } from "../../features/counter/counterSlice";


const Home = () => {

  const dispatch = useAppDispatch();
  const appSelector = useAppSelector(t=>t.counter.value);
  console.log('Home page - current redux state:', appSelector);
  return (
    <>


      {/* test redux counter increment */}

      <h1>Home Page</h1>
      <p>This is the home page content.</p>

      {/* test redux counter increment */}
      <div>
        <h2>Counter Value:</h2>
        <p>{appSelector}</p>
      </div>


      <button onClick={() => dispatch(increment())}>
        Increment Counter
      </button>
      <span style={{ display: 'inline-block', width: 12 }} />

      <button onClick={() => dispatch(decrement())}>
        Decrement Counter
      </button>

    </>
  )
}


export default Home;