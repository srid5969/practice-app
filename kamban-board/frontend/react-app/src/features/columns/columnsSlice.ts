import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Column {
  id: string;
  boardId: string;
  title: string;
  taskIds: string[];
}

interface ColumnsState {
  byId: Record<string, Column>;
  allIds: string[];
}

const initialState: ColumnsState = { byId: {}, allIds: [] };

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<Column>) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
    },
  },
});

export const { addColumn } = columnsSlice.actions;
export default columnsSlice.reducer;
