import { AppDispatch } from '../../store';
import { deleteJoke, addJoke } from '../../store/jokes/jokesSlice';
import { Joke } from '../../store/jokes/jokesTypes';

export const useHandleRefresh = (
  dispatch: AppDispatch,
  localJokes: Joke[],
  combinedJokes: Joke[],
  setLocalJokes: (jokes: Joke[]) => void,
  setStoredJokes: (jokes: Joke[]) => void,
  setCombinedJokes: (jokes: Joke[]) => void,
  fetchNewRandomJoke: (existingIds: number[]) => Promise<Joke | null>
) => {
  const handleRefresh = async (id: number) => {
    try {
      const isLocalJoke = localJokes.some(j => j.id === id);

      const jokeIndexInCombined = combinedJokes.findIndex(j => j.id === id);
      const updatedCombinedJokes = combinedJokes.filter(j => j.id !== id);
      if (isLocalJoke) {
        const updatedLocalJokes = localJokes.filter(j => j.id !== id);
        localStorage.setItem('userJokes', JSON.stringify(updatedLocalJokes));
        setStoredJokes(updatedLocalJokes);
        setLocalJokes(updatedLocalJokes);
      }
      dispatch(deleteJoke(id));
      const newJoke = await fetchNewRandomJoke(localJokes.map(j => j.id));

      if (!newJoke) return;
      dispatch(addJoke(newJoke));
      setCombinedJokes([...updatedCombinedJokes, newJoke]);
      if (isLocalJoke) {
        const updatedLocalJokes = [...localJokes.filter(j => j.id !== id), newJoke];
        localStorage.setItem('userJokes', JSON.stringify(updatedLocalJokes));
        setStoredJokes(updatedLocalJokes);
        setLocalJokes(updatedLocalJokes);
      }

    } catch (error) {
      console.error('Error refreshing joke:', error);
    }
  };

  return { handleRefresh };
};
