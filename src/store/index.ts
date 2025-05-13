import { configureStore } from '@reduxjs/toolkit';
import jokesReducer from './jokes/jokesSlice';

export const store = configureStore({
    reducer: {
        jokes: jokesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
