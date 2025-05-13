import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRandomJoke, fetchTenJokes } from './api/jokesApi';
import { JokesState, Joke } from './jokesTypes';

const initialState: JokesState = {
    jokes: [],
    userJokes: JSON.parse(localStorage.getItem('userJokes') || '[]'),
    status: 'idle',
    error: null,
};

export const fetchTenJokesThunk = createAsyncThunk(
    'jokes/fetchTenJokes',
    async (_, { getState }) => {
        const state = getState() as { jokes: JokesState };
        const existingIds = [...state.jokes.jokes, ...state.jokes.userJokes].map(j => j.id);
        const jokes = await fetchTenJokes();
        return jokes.filter(joke => !existingIds.includes(joke.id));
    }
);

export const fetchRandomJokeThunk = createAsyncThunk(
    'jokes/fetchRandomJoke',
    async (_, { getState }) => {
        const state = getState() as { jokes: JokesState };
        const existingIds = [...state.jokes.jokes, ...state.jokes.userJokes].map(j => j.id);
        const joke = await fetchRandomJoke();
        return joke && !existingIds.includes(joke.id) ? joke : null;
    }
);

const jokesSlice = createSlice({
    name: 'jokes',
    initialState,
    reducers: {
        addJoke: (state, action) => {
            if (!state.userJokes.some(j => j.id === action.payload.id)) {
                state.userJokes.push(action.payload);
            }
        },
        deleteJoke: (state, action) => {
            state.jokes = state.jokes.filter(j => j.id !== action.payload);
            state.userJokes = state.userJokes.filter(j => j.id !== action.payload);
            localStorage.setItem('userJokes', JSON.stringify(state.userJokes));
        },
        refreshJoke: (state, action) => {
            state.jokes = state.jokes.filter(j => j.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenJokesThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTenJokesThunk.fulfilled, (state, action) => {
                state.jokes.push(...action.payload);
                state.status = 'succeeded';
            })
            .addCase(fetchTenJokesThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch jokes';
            });
    },
});

export const { addJoke, deleteJoke, refreshJoke } = jokesSlice.actions;
export default jokesSlice.reducer;