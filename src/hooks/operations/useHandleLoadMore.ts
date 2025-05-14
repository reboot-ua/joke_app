import { AppDispatch } from '../../store';
import { addJoke } from '../../store/jokes/jokesSlice';
import { Joke } from '../../store/jokes/jokesTypes';

export const useHandleLoadMore = (
  dispatch: AppDispatch,
  combinedJokes: Joke[],
  fetchUniqueJokes: (existingIds: number[], count: number) => Promise<Joke[]>
) => {
  const handleLoadMore = async () => {
    try {
      const neededJokes = 10;
      const existingIds = combinedJokes.map(joke => joke.id);
      
      // Отримуємо нові унікальні жарти
      const newJokes = await fetchUniqueJokes(existingIds, neededJokes);
      
      // Перевіряємо, що всі жарти унікальні
      const uniqueNewJokes = newJokes.filter(
        newJoke => !existingIds.includes(newJoke.id)
      );

      // Додаємо тільки унікальні жарти
      uniqueNewJokes.forEach(joke => dispatch(addJoke(joke)));
    } catch (error) {
      console.error('Error loading more jokes:', error);
    }
  };

  return { handleLoadMore };
};
