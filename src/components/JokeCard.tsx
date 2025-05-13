import { Card, CardContent, Typography, Stack, Button, Box } from '@mui/material';
import React, { useState } from 'react';
import CustomButton from "./CustomButton";
import {Joke} from "../store/jokes/jokesTypes";

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
                color: '#fff',
                borderRadius: '20px',
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
                        <CustomButton
                            onClick={onDelete}
                            label="Delete"
                            variant="contained"
                            color="black"
                            backgroundColor="gray"
                        />
                        <CustomButton
                            onClick={onAdd}
                            label="ADD"
                            variant="contained"
                            color="black"
                            backgroundColor="gray"

                        />
                        <CustomButton
                            onClick={onRefresh}
                            label="Refresh"
                            variant="contained"
                            color="black"
                            backgroundColor="gray"
                        />
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default JokeCard;
