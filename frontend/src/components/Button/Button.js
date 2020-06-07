import React from 'react';
import { StyledButton } from './styles';

const Button = ({ children, onClick, disabled, small }) => {
    return (
        <StyledButton onClick={onClick} disabled={disabled} small={small}>
            {children}
        </StyledButton>
    );
};

export default Button;
