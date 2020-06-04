import React from 'react';
import { StyledButton } from './styles';

const Button = ({ children, onClick, disabled }) => {
    return (
        <StyledButton onClick={onClick} disabled={disabled}>
            {children}
        </StyledButton>
    );
};

export default Button;
