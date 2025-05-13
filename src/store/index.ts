import { configureStore } from '@reduxjs/toolkit';
import jokesReducer from './jokesSlice';

export const store = configureStore({
    reducer: {
        jokes: jokesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
