import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: 0 };

export type CounterState = typeof initialState;

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state: CounterState) => {
            state.value += 1;
        },
        decrement: (state: CounterState) => {
            state.value -= 1;
        }
    },
});
export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;

