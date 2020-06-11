import React from 'react';
import { StyledButton, StyledButtonText } from './styles';

const Button = ({ children, onClick, disabled, small, secondary, loading }) => {
	return (
		<StyledButton
			secondary={secondary}
			onClick={onClick}
			disabled={disabled}
			small={small}>
			<StyledButtonText loading={loading}>
				{loading ? '◓' : children}
			</StyledButtonText>
		</StyledButton>
	);
};

export default Button;
