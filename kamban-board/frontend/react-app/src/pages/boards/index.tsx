import React, { useEffect, useState } from 'react';
import { apiService } from '../../utils/api.service';



function BoardsPage() {

  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardOwner, setNewBoardOwner] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data } = await apiService.getBoardsList();
        setBoards(data);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);
  return (
    <div>
      <h1>Boards</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ul>
            {boards.map((board) => (
              <li key={board._id}>
                {board.name} (Owner: {board.owner})
              </li>
            ))}
          </ul>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newBoardName || !newBoardOwner) return;
              setAdding(true);
              try {
                await apiService.addNewBoard({
                  name: newBoardName,
                  owner: newBoardOwner,
                });
                // Refresh the boards list after adding a new board
                const boardsRes = await apiService.getBoardsList();
                setBoards(boardsRes.data);
                setNewBoardName('');
                setNewBoardOwner('');
              } catch (error) {
                console.error('Failed to add board:', error);
              } finally {
                setAdding(false);
              }
            }}
            style={{ marginTop: 16 }}
          >
            <input
              type="text"
              placeholder="Board Name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Owner Name"
              value={newBoardOwner}
              onChange={(e) => setNewBoardOwner(e.target.value)}
              required
            />
            <button type="submit" disabled={adding}>
              {adding ? 'Adding...' : 'Add Board'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default BoardsPage;
