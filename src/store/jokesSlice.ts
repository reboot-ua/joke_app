import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

export interface Joke {
    id: number;
    type: string;
    setup: string;
    punchline: string;
}

interface JokesState {
    jokes: Joke[];
    userJokes: Joke[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: JokesState = {
    jokes: [],
    userJokes: JSON.parse(localStorage.getItem('userJokes') || '[]'),
    status: 'idle',
    error: null,
};

export const fetchTenJokes = createAsyncThunk('jokes/fetchTenJokes', async (_, { getState }) => {
    const response = await axios.get<Joke[]>('https://official-joke-api.appspot.com/jokes/ten');
    const currentState = getState() as RootState;

    const existingIds = [
        ...currentState.jokes.jokes.map(joke => joke.id),
        ...currentState.jokes.userJokes.map(joke => joke.id),
    ];

    const uniqueJokes = response.data.filter(joke => !existingIds.includes(joke.id));

    return uniqueJokes;
});

export const fetchRandomJoke = createAsyncThunk('jokes/fetchRandomJoke', async (_, { getState }) => {
    const response = await axios.get<Joke>('https://official-joke-api.appspot.com/jokes/random');
    const currentState = getState() as RootState;

    const storedJokes = JSON.parse(localStorage.getItem('userJokes') || '[]');
    const existingIds = [
        ...currentState.jokes.jokes.map((joke: Joke) => joke.id),
        ...storedJokes.map((joke: Joke) => joke.id),
    ];

    // Якщо жарт дублюється, повертаємо null
    if (existingIds.includes(response.data.id)) {
        return null;
    }

    return response.data;
});

const jokesSlice = createSlice({
    name: 'jokes',
    initialState,
    reducers: {
        addJoke(state, action: PayloadAction<Joke>) {
            const existingIds = state.userJokes.map((joke: Joke) => joke.id);
            if (!existingIds.includes(action.payload.id)) {
                localStorage.setItem('userJokes', JSON.stringify(state.userJokes));
            }
        },

        deleteJoke(state, action: PayloadAction<number>) {
            state.jokes = state.jokes.filter((joke: Joke) => joke.id !== action.payload);
            state.userJokes = state.userJokes.filter((joke: Joke) => joke.id !== action.payload);
            localStorage.setItem('userJokes', JSON.stringify(state.userJokes)); // Оновлюємо localStorage
        },

        refreshJoke(state, action: PayloadAction<number>) {
            state.jokes = state.jokes.filter((j: Joke) => j.id !== action.payload);
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTenJokes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTenJokes.fulfilled, (state, action) => {
                const ids = new Set([...state.jokes, ...state.userJokes].map((j: Joke) => j.id));
                const uniqueJokes = action.payload.filter((j: Joke) => !ids.has(j.id));
                state.jokes.push(...uniqueJokes);
                state.status = 'succeeded';
            })
            .addCase(fetchTenJokes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch jokes';
            });
    },
});

export const { addJoke, deleteJoke, refreshJoke } = jokesSlice.actions;
export default jokesSlice.reducer;
