import { AppDispatch } from '../../store';
import { fetchRandomJokeThunk, fetchTenJokesThunk } from '../../store/jokes/jokesSlice';
import { Joke } from '../../store/jokes/jokesTypes';

export const useJokesApi = (dispatch: AppDispatch) => {
  const fetchUniqueJokes = async (existingIds: number[], count: number): Promise<Joke[]> => {
    let result: Joke[] = [];
    while (result.length < count) {
      const jokes = await dispatch(fetchTenJokesThunk()).unwrap();
      const unique = jokes.filter(joke => !existingIds.includes(joke.id));
      result = [...result, ...unique].slice(0, count);
    }
    return result;
  };

  const fetchNewRandomJoke = async (existingIds: number[]): Promise<Joke | null> => {
    const joke = await dispatch(fetchRandomJokeThunk()).unwrap();
    return joke && !existingIds.includes(joke.id) ? joke : null;
  };

  return { fetchUniqueJokes, fetchNewRandomJoke };
};
