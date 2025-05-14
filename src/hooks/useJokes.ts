import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { useLocalStorageJokes } from './utils/useLocalStorageJokes';
import { useJokesApi } from './utils/useJokesApi';
import { useJokesState } from './utils/useJokesState';
import { useHandleAdd } from './operations/useHandleAdd';
import { useHandleDelete } from './operations/useHandleDelete';
import { useHandleLoadMore } from './operations/useHandleLoadMore';
import { useHandleRefresh } from './operations/useHandleRefresh';
import { addJoke } from '../store/jokes/jokesSlice';

export const useJokes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jokes: reduxJokes, status } = useSelector((state: RootState) => state.jokes);

  const { getStoredJokes, setStoredJokes } = useLocalStorageJokes();
  const { fetchUniqueJokes, fetchNewRandomJoke } = useJokesApi(dispatch);
  const {
    loading,
    setLoading,
    localJokes,
    setLocalJokes,
    combinedJokes,
    setCombinedJokes
  } = useJokesState();

  const loadInitialData = async () => {
    setLoading(true);
    const storedJokes = getStoredJokes();
    setLocalJokes(storedJokes);

    if (storedJokes.length >= 10) {
      setCombinedJokes(storedJokes.slice(0, 10));
      setLoading(false);
      return;
    }
    const jokesNeeded = 10 - storedJokes.length;
    const existingIds = storedJokes.map(j => j.id);

    try {
      const uniqueApiJokes = await fetchUniqueJokes(existingIds, jokesNeeded);
      console.log(uniqueApiJokes.length);
      console.log(storedJokes);
      setCombinedJokes([...storedJokes, ...uniqueApiJokes].slice(0, 10));
      uniqueApiJokes.forEach(joke => dispatch(addJoke(joke)));
    } catch (error) {
      console.error('Failed to load jokes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCombinedJokes([...localJokes, ...reduxJokes]);
    console.log(localJokes, 'localJokes');
    console.log(reduxJokes, 'reduxJokes');
  }, [localJokes, reduxJokes]);

  useEffect(() => {
    if (status === 'idle') {
      loadInitialData();
    }
  }, [status]);

  const { handleAdd } = useHandleAdd(
    dispatch,
    localJokes,
    reduxJokes,
    setLocalJokes,
    setStoredJokes,
    fetchNewRandomJoke
  );

  const { handleDelete } = useHandleDelete(
    dispatch,
    localJokes,
    setLocalJokes,
    setStoredJokes
  );

  const { handleLoadMore } = useHandleLoadMore(
    dispatch,
    combinedJokes,
    fetchUniqueJokes,
    setCombinedJokes
  );

  const { handleRefresh } = useHandleRefresh(
    dispatch,
    localJokes,
    combinedJokes,
    setLocalJokes,
    setStoredJokes,
    setCombinedJokes,
    fetchNewRandomJoke
  );

  return {
    loading,
    combinedJokes,
    handleAdd,
    handleDelete,
    handleLoadMore,
    handleRefresh
  };
};
