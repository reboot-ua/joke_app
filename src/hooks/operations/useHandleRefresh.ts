// src/hooks/operations/useHandleRefresh.ts
import { AppDispatch } from '../../store';
import { deleteJoke, addJoke } from '../../store/jokes/jokesSlice';
import { Joke } from '../../store/jokes/jokesTypes';

export const useHandleRefresh = (
  dispatch: AppDispatch,
  localJokes: Joke[],
  setLocalJokes: (jokes: Joke[]) => void,
  setStoredJokes: (jokes: Joke[]) => void,
  fetchNewRandomJoke: (existingIds: number[]) => Promise<Joke | null>
) => {
  const handleRefresh = async (id: number) => {
    try {
      const isLocalJoke = localJokes.some(j => j.id === id);
      
      // Спочатку видаляємо старий жарт
      if (isLocalJoke) {
        const updatedJokes = localJokes.filter(j => j.id !== id);
        setStoredJokes(updatedJokes);
        setLocalJokes(updatedJokes);
      }
      dispatch(deleteJoke(id));

      // Потім отримуємо новий жарт
      const newJoke = await fetchNewRandomJoke([...localJokes.map(j => j.id)]);
      if (!newJoke) return;

      // Додаємо новий жарт на місце старого
      if (isLocalJoke) {
        const updatedJokes = [...localJokes, newJoke];
        setStoredJokes(updatedJokes);
        setLocalJokes(updatedJokes);
      }
      dispatch(addJoke(newJoke));
    } catch (error) {
      console.error('Error refreshing joke:', error);
    }
  };

  return { handleRefresh };
};