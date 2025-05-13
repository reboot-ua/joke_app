export interface Joke {
    id: number;
    type: string;
    setup: string;
    punchline: string;
}

export interface JokesState {
    jokes: Joke[];
    userJokes: Joke[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export type AddJokePayload = Joke;
export type DeleteJokePayload = number;
export type RefreshJokePayload = number;