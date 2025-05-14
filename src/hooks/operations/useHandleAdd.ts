import { Joke } from '../../store/jokes/jokesTypes';
import { AppDispatch } from '../../store';
import { addJoke } from '../../store/jokes/jokesSlice';

export const useHandleAdd = (
  dispatch: AppDispatch,
  localJokes: Joke[],
  reduxJokes: Joke[],
  setLocalJokes: (jokes: Joke[]) => void,
  setStoredJokes: (jokes: Joke[]) => void,
  fetchNewRandomJoke: (existingIds: number[]) => Promise<Joke | null>
) => {
  const handleAdd = async () => {
    const existingIds = [...localJokes, ...reduxJokes].map(j => j.id);
    const newJoke = await fetchNewRandomJoke(existingIds);

    if (!newJoke) return;

    const updatedJokes = [...localJokes, newJoke];
    setStoredJokes(updatedJokes);
    setLocalJokes(updatedJokes);
    dispatch(addJoke(newJoke));
  };

  return { handleAdd };
};
