import BoardList from './features/boards/BoardList';

function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Kanban — Demo</h1>
      <BoardList />
    </div>
  );
}

export default App;
