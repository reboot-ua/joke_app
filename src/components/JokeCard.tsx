import { Card, CardContent, Typography, Stack, Button, Box } from '@mui/material';
import { Joke } from '../store/jokesSlice';
import { useState } from 'react';

type Props = {
    joke: Joke;
    onDelete: () => void;
    onAdd: () => void;
    onRefresh: () => void;
};

const JokeCard: React.FC<Props> = ({ joke, onDelete, onAdd, onRefresh }) => {
    const [hover, setHover] = useState(false);

    return (
        <Card
            variant="outlined"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#aaa',
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle2" fontWeight="bold">
                        Type: <span style={{ color: 'blue' }}>{joke.type}</span>
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                        ID <span style={{ color: 'blue' }}>#{joke.id}</span>
                    </Typography>
                </Stack>

                <Typography fontWeight="bold" mt={2}>Setup:</Typography>
                <Typography fontStyle="italic">{joke.setup}</Typography>

                <Typography fontWeight="bold" mt={2}>Punchline:</Typography>
                <Typography fontStyle="italic">{joke.punchline}</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box mt={2}>
                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        sx={{
                            visibility: hover ? 'visible' : 'hidden',
                        }}
                    >
                        <Button variant="outlined" color="error" onClick={onDelete}>
                            Delete
                        </Button>
                        <Button variant="contained" onClick={onAdd}>
                            Add
                        </Button>
                        <Button variant="outlined" onClick={onRefresh}>
                            Refresh
                        </Button>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default JokeCard;
