import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {addJoke, deleteJoke, fetchRandomJokeThunk, fetchTenJokesThunk} from '../store/jokes/jokesSlice';
import { Joke } from '../store/jokes/jokesTypes';

export const useJokes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { jokes, status } = useSelector((state: RootState) => state.jokes);
    const [loading, setLoading] = useState(false);
    const [localJokes, setLocalJokes] = useState<Joke[]>([]);
    const [combinedJokes, setCombinedJokes] = useState<Joke[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const storedJokes: Joke[] = JSON.parse(localStorage.getItem('userJokes') || '[]');
            setLocalJokes(storedJokes);

            const jokesNeeded = Math.max(0, 10 - storedJokes.length);

            if (jokesNeeded > 0) {
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
                } catch (error) {
                    console.error('Failed to load jokes:', error);
                }
            }
            setLoading(false);
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
                    const updatedJokes = [...localJokes, res];
                    localStorage.setItem('userJokes', JSON.stringify(updatedJokes));
                    setLocalJokes(updatedJokes);
                }
            }
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
            const jokeIndex = combinedJokes.findIndex((joke: Joke) => joke.id === id);
            const updatedLocalJokes: Joke[] = combinedJokes.filter((joke: Joke) => joke.id !== id);
            localStorage.setItem('userJokes', JSON.stringify(updatedLocalJokes));
            dispatch(deleteJoke(id));

            const newJoke = await dispatch(fetchRandomJokeThunk()).unwrap();
            if (newJoke) {
                dispatch(addJoke(newJoke));
                if (jokeIndex !== -1) {
                    updatedLocalJokes.splice(jokeIndex, 0, newJoke);
                } else {
                    updatedLocalJokes.push(newJoke);
                }

                localStorage.setItem('userJokes', JSON.stringify(updatedLocalJokes));
                setCombinedJokes(updatedLocalJokes);
            }
        } catch (error) {
            console.error('Error fetching new joke:', error);
        } finally {
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