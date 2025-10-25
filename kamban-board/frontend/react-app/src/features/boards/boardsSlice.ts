import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Board {
  id: string;
  name: string;
  columnIds: string[];
}

interface BoardsState {
  byId: Record<string, Board>;
  allIds: string[];
}

const initialState: BoardsState = { byId: {}, allIds: [] };

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
    },
  },
});

export const { addBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
