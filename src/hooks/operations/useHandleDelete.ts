import { AppDispatch } from '../../store';
import { deleteJoke } from '../../store/jokes/jokesSlice';
import { Joke } from '../../store/jokes/jokesTypes';

export const useHandleDelete = (
  dispatch: AppDispatch,
  localJokes: Joke[],
  setLocalJokes: (jokes: Joke[]) => void,
  setStoredJokes: (jokes: Joke[]) => void
) => {
  const handleDelete = (id: number) => {
    const updatedJokes = localJokes.filter(joke => joke.id !== id);
    setStoredJokes(updatedJokes);
    setLocalJokes(updatedJokes);
    dispatch(deleteJoke(id));
  };

  return { handleDelete };
};