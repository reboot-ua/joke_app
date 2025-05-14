import { Joke } from '../../store/jokes/jokesTypes';

export const useLocalStorageJokes = () => {
  const getStoredJokes = (limit = 10): Joke[] => {
    return JSON.parse(localStorage.getItem('userJokes') || '[]').slice(0, limit);
  };

  const setStoredJokes = (jokes: Joke[]) => {
    localStorage.setItem('userJokes', JSON.stringify(jokes));
  };

  return { getStoredJokes, setStoredJokes };
};
