import React from 'react';
import { StyledButton, StyledButtonText } from './styles';

const Button = ({
	children,
	onClick,
	disabled,
	small,
	secondary,
	color = '#3750DB',
	backgroundColor = '#ffffff',
	loading,
}) => {
	return (
		<StyledButton
			secondary={secondary}
			onClick={onClick}
			disabled={disabled}
			small={small}
			color={color}
			backgroundColor={backgroundColor}
		>
			<StyledButtonText loading={loading ? 'true' : 'false'} color={color}>
				{loading ? '◓' : children}
			</StyledButtonText>
		</StyledButton>
	);
};

export default Button;
