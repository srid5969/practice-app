import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order?: number;
}

interface TasksState {
  byId: Record<string, Task>;
  allIds: string[];
}

const initialState: TasksState = { byId: {}, allIds: [] };

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.byId[action.payload.id] = action.payload;
      state.allIds.push(action.payload.id);
    },
  },
});

export const { addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
