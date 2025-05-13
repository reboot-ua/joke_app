import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {addJoke, deleteJoke, fetchRandomJokeThunk, fetchTenJokesThunk, refreshJoke} from '../store/jokes/jokesSlice';
import { Joke } from '../store/jokes/jokesTypes';

export const useJokes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {jokes, status} = useSelector((state: RootState) => state.jokes);
    const [loading, setLoading] = useState<boolean>(false);
    const [localJokes, setLocalJokes] = useState<Joke[]>([]);
    const [combinedJokes, setCombinedJokes] = useState<Joke[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const storedJokes: Joke[] = JSON.parse(localStorage.getItem('userJokes') || '[]').slice(0, 10);
            setLocalJokes(storedJokes);

            if (storedJokes.length >= 10) {
                setCombinedJokes(storedJokes);
                setLoading(false);
                return;
            }

            const jokesNeeded = 10 - storedJokes.length;

            try {
                let uniqueApiJokes: Joke[] = [];

                while (uniqueApiJokes.length < jokesNeeded) {
                    const apiJokes = await dispatch(fetchTenJokesThunk()).unwrap();
                    const newUniqueJokes = apiJokes.filter(
                        (apiJoke: Joke) => !storedJokes.some(storedJoke => storedJoke.id === apiJoke.id)
                    );
                    uniqueApiJokes = [...uniqueApiJokes, ...newUniqueJokes].slice(0, jokesNeeded);
                }

                uniqueApiJokes.forEach((joke: Joke) => {
                    dispatch(addJoke(joke));
                });

                setCombinedJokes([...storedJokes, ...uniqueApiJokes]);

            } catch (error) {
                console.error('Failed to load jokes:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'idle') {
            loadInitialData();
        }
    }, [dispatch, status]);

    useEffect(() => {
        setCombinedJokes([...localJokes, ...jokes]);
    }, [localJokes, jokes]);

    const handleAdd = async () => {
        try {
            const res = await dispatch(fetchRandomJokeThunk()).unwrap();

            if (res) {
                const isDuplicate = [...localJokes, ...jokes].some(joke => joke.id === res.id);

                if (!isDuplicate) {
                    dispatch(addJoke(res));
                    const updatedLocalJokes = [...localJokes, res];
                    localStorage.setItem('userJokes', JSON.stringify(updatedLocalJokes));

                    setLocalJokes(updatedLocalJokes);
                    setCombinedJokes(updatedLocalJokes);
                }
            }
        } catch (error) {
            console.error('Error adding joke:', error);
        } finally {
        }
    };

    const handleDelete = (id: number) => {
        const updatedJokes = localJokes.filter(joke => joke.id !== id);
        localStorage.setItem('userJokes', JSON.stringify(updatedJokes));
        setLocalJokes(updatedJokes);

        dispatch(deleteJoke(id));
    };

    const handleLoadMore = async () => {
        try {
            const neededJokes = 10;
            const allExistingJokes = combinedJokes;
            const existingIds = new Set(allExistingJokes.map(joke => joke.id));
            const newJokes: Joke[] = [];

            while (newJokes.length < neededJokes) {
                const response = await dispatch(fetchTenJokesThunk()).unwrap();

                for (const joke of response) {
                    if (!existingIds.has(joke.id)) {
                        newJokes.push(joke);
                        existingIds.add(joke.id);
                        if (newJokes.length === neededJokes) break;
                    }
                }
            }
            if (newJokes.length > 0) {
                newJokes.forEach(joke => dispatch(addJoke(joke)));
                setCombinedJokes([...allExistingJokes, ...newJokes]);
            }
        } catch (error) {
            console.error('error:', error);
        } finally {
        }
    };
    const handleRefresh = async (id: number) => {

        try {
            console.log(combinedJokes, 'local JOKES');

            const storedJokes: Joke[] = JSON.parse(localStorage.getItem('userJokes') || '[]');
            const jokeIndexInLocalStorage = storedJokes.findIndex((joke: Joke) => joke.id === id);
            const jokeIndexInState = combinedJokes.findIndex((joke: Joke) => joke.id === id);

            console.log(jokeIndexInLocalStorage, 'jokeIndexInLocalStorage');
            console.log(jokeIndexInState, 'jokeIndexInState');

            const newJoke = await dispatch(fetchRandomJokeThunk()).unwrap();
            console.log(newJoke, 'new joke add');

            if (newJoke) {
                if (jokeIndexInState !== -1) {
                    dispatch(deleteJoke(id));
                }

                dispatch(addJoke(newJoke));

                if (jokeIndexInLocalStorage !== -1) {
                    storedJokes.splice(jokeIndexInLocalStorage, 1);
                    storedJokes.splice(jokeIndexInLocalStorage, 0, newJoke);
                    localStorage.setItem('userJokes', JSON.stringify(storedJokes));
                    setLocalJokes(storedJokes);
                } else {
                    storedJokes.push(newJoke);
                    localStorage.setItem('userJokes', JSON.stringify(storedJokes));
                    setLocalJokes(storedJokes);
                }
                setCombinedJokes(prevState => {
                    const updatedJokes = prevState.map(joke => (joke.id === id ? newJoke : joke));
                    return updatedJokes;
                });
            }
        } catch (error) {
            console.error('Error fetching new joke:', error);
        } finally {
            console.log('refresh complete');
        }
    };
    return {
        loading,
        combinedJokes,
        handleAdd,
        handleDelete,
        handleLoadMore,
        handleRefresh,
    };
};

export default useJokes;
