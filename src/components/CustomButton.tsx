import React from 'react';
import {Button} from '@mui/material';

interface CustomButtonProps {
    onClick: () => void;
    label: string;
    variant: 'contained' | 'outlined' | 'text';
    color: string;
    backgroundColor: string;
    sx?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       onClick,
                                                       label,
                                                       variant,
                                                       color,
                                                       backgroundColor,
                                                       sx,
                                                   }) => {
    return (
        <Button
            variant={variant}
            sx={{
                mt: 2,
                backgroundColor: backgroundColor,
                color: color,
                width: 'auto',
                display: 'flex',
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                ...sx,
            }}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
