import { AppDispatch } from '../../store';
import { addJoke } from '../../store/jokes/jokesSlice';
import { Joke } from '../../store/jokes/jokesTypes';

export const useHandleLoadMore = (
  dispatch: AppDispatch,
  combinedJokes: Joke[],
  fetchUniqueJokes: (existingIds: number[], count: number) => Promise<Joke[]>,
  setCombinedJokes: (jokes: Joke[]) => void
) => {
  const handleLoadMore = async () => {
    try {
      const neededJokes = 10;
      const existingIds = combinedJokes.map(joke => joke.id);

      const newJokes = await fetchUniqueJokes(existingIds, neededJokes);
      const uniqueNewJokes = newJokes.filter(newJoke => !existingIds.includes(newJoke.id));

      if (uniqueNewJokes.length > 0) {
        uniqueNewJokes.forEach(joke => dispatch(addJoke(joke)));
        setCombinedJokes([...combinedJokes, ...uniqueNewJokes]);
      }
    } catch (error) {
      console.error('Error loading more jokes:', error);
    }
  };

  return { handleLoadMore };
};
