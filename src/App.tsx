import React from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import JokeCard from './components/JokeCard';
import CustomButton from './components/CustomButton';
import useJokes from './hooks/useJokes';

const App = () => {
  const {
    loading,
    combinedJokes,
    handleAdd,
    handleDelete,
    handleLoadMore,
    handleRefresh,
  } = useJokes();

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome to the Joke App
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
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

          <CustomButton
            onClick={handleLoadMore}
            label="LOAD MORE"
            variant="contained"
            color="white"
            backgroundColor="gray"
            sx={{ mt: 5 }}
          />
        </>
      )}
    </Container>
  );
};

export default App;
