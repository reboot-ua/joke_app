import axios from 'axios';
import { Joke } from '../jokesTypes';

const API_URL = 'https://official-joke-api.appspot.com/jokes';

/**
 * Функція для отримання одного випадкового жарту.
 * @returns Promise з жартом або null, якщо жарт не вдалося отримати
 */
export const fetchRandomJoke = async (): Promise<Joke | null> => {
    try {
        const response = await axios.get<Joke>(`${API_URL}/random`);
        return response.data;
    } catch (error) {
        console.error('Error fetching random joke:', error);
        return null; // Повертаємо null, якщо виникла помилка
    }
};

/**
 * Функція для отримання 10 жартів.
 * @returns Promise з масивом жартів
 */
export const fetchTenJokes = async (): Promise<Joke[]> => {
    try {
        const response = await axios.get<Joke[]>(`${API_URL}/ten`);
        return response.data;
    } catch (error) {
        console.error('Error fetching 10 jokes:', error);
        return []; // Повертаємо порожній масив, якщо виникла помилка
    }
};