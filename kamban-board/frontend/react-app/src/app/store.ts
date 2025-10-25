//Redux store setup

import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from '../features/boards/boardsSlice';
import columnsReducer from '../features/columns/columnsSlice';
import tasksReducer from '../features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    columns: columnsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
