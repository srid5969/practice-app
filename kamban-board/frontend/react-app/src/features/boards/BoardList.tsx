import { useAppSelector } from '../../app/hooks';

export default function BoardList() {
  const boards = useAppSelector((s) =>
    s.boards.allIds.map((id:string) => s.boards.byId[id]),
  );

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Boards</h2>
      {boards.length === 0 ? (
        <p>No boards yet. We'll create one in the next step.</p>
      ) : (
        <ul>
          {boards.map((b) => (
            <li key={b.id} style={{ padding: 8, border: '1px solid #ddd', marginBottom: 6 }}>
              {b.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
