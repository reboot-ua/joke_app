import axios from 'axios';
import { Joke } from '../jokesTypes';

const API_URL = 'https://official-joke-api.appspot.com/jokes';

export const fetchRandomJoke = async (): Promise<Joke | null> => {
    try {
        const response = await axios.get<Joke>(`${API_URL}/random`);
        return response.data;
    } catch (error) {
        console.error('Error fetching random joke:', error);
        return null;
    }
};

export const fetchTenJokes = async (): Promise<Joke[]> => {
    try {
        const response = await axios.get<Joke[]>(`${API_URL}/ten`);
        return response.data;
    } catch (error) {
        console.error('Error fetching 10 jokes:', error);
        return [];
    }
};
