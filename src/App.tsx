import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from './store';
import {fetchTenJokes, fetchRandomJoke, addJoke, Joke, deleteJoke} from './store/jokesSlice';
import {Button, Container, Box, CircularProgress} from '@mui/material';
import JokeCard from './components/JokeCard';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {jokes, status} = useSelector((state: RootState) => state.jokes);
    const [loading, setLoading] = useState<boolean>(false);
    const [localJokes, setLocalJokes] = useState<Joke[]>([]);
    const [combinedJokes, setCombinedJokes] = useState<Joke[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const storedJokes: Joke[] = JSON.parse(localStorage.getItem('userJokes') || '[]');
            console.log(storedJokes, 'stored')
            setLocalJokes(storedJokes);

            const jokesNeeded = Math.max(0, 10 - storedJokes.length);
            if (jokesNeeded > 0) {
                console.log(jokesNeeded, ' need');

                try {
                    let uniqueApiJokes: Joke[] = [];

                    while (uniqueApiJokes.length < jokesNeeded) {
                        const apiJokes = await dispatch(fetchTenJokes()).unwrap();
                        console.log(apiJokes, 'api')
                        const newUniqueJokes = apiJokes.filter(
                            (apiJoke: Joke) => !storedJokes.some(storedJoke => storedJoke.id === apiJoke.id)
                        );

                        uniqueApiJokes = [...uniqueApiJokes, ...newUniqueJokes].slice(0, jokesNeeded);
                    }
                    console.log(uniqueApiJokes, 'unique')
                    uniqueApiJokes.forEach((joke: Joke) => {

                        dispatch(addJoke(joke));
                    });
                    setCombinedJokes([...storedJokes, ...uniqueApiJokes].slice(0, 10)); // Завжди відображаємо тільки перші 10

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
            const res = await dispatch(fetchRandomJoke()).unwrap();
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
                const response = await dispatch(fetchTenJokes()).unwrap();

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
        setLoading(true);
        try {
            const jokeIndex = combinedJokes.findIndex((joke: Joke) => joke.id === id);
            const updatedLocalJokes: Joke[] = combinedJokes.filter((joke: Joke) => joke.id !== id);
            localStorage.setItem('userJokes', JSON.stringify(updatedLocalJokes));
            dispatch(deleteJoke(id));
            const newJoke = await dispatch(fetchRandomJoke()).unwrap();
            if (newJoke) {
                dispatch(addJoke(newJoke));
                if (jokeIndex !== -1) {
                    updatedLocalJokes.splice(jokeIndex, 0, newJoke);
                } else {
                    updatedLocalJokes.push(newJoke);
                }
                localStorage.setItem('userJokes', JSON.stringify(newJoke));
                setCombinedJokes(updatedLocalJokes);
            }
        } catch (error) {
            console.error('Error fetching new joke:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container sx={{mt: 5}}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress/>
                </Box>
            ) : (
                <>
                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                        gap={3}
                    >
                        {combinedJokes.map((joke) => (
                            <Box key={joke.id}>
                                <JokeCard
                                    joke={joke}
                                    onDelete={() => handleDelete(joke.id)}
                                    onAdd={handleAdd}
                                    onRefresh={() => handleRefresh(joke.id)}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 4}}
                        onClick={handleLoadMore}
                    >
                        LOAD MORE
                    </Button>
                </>
            )}
        </Container>
    );
};

export default App;
