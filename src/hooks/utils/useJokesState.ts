import { useState, useEffect } from 'react';
import { Joke } from '../../store/jokes/jokesTypes';

export const useJokesState = () => {
  const [loading, setLoading] = useState(false);
  const [localJokes, setLocalJokes] = useState<Joke[]>([]);
  const [combinedJokes, setCombinedJokes] = useState<Joke[]>([]);
  return {
    loading,
    setLoading,
    localJokes,
    setLocalJokes,
    combinedJokes,
    setCombinedJokes
  };
};
