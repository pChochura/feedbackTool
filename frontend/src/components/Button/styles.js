import styled, { css, keyframes } from 'styled-components';

const rotation = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

export const StyledButton = styled.button`
	background: ${({ secondary, color }) => (secondary ? '#ffffff' : color)};
	color: ${({ secondary, color }) => (secondary ? color : '#ffffff')};
	outline: none;
	border: ${({ secondary, color }) =>
		secondary ? color + ' 1px solid' : 'none'};
	width: ${({ small }) => (small ? '100px' : '150px')};
	height: ${({ small }) => (small ? '30px' : '40px')};
	border-radius: 5px;
	font-size: ${({ small }) => (small ? '0.8rem' : '1.1rem')};
	font-weight: ${({ secondary }) => (secondary ? '300' : '400')};
	font-family: 'Montserrat';
	transition: 0.5s all;

	${({ disabled }) =>
		disabled
			? css`
					filter: grayscale(0.75);
			  `
			: css`
					cursor: pointer;
			  `}

	&:hover {
		filter: grayscale(0.75);
		${({ disabled }) =>
			disabled &&
			css`
				cursor: not-allowed;
			`}
	}
`;

export const StyledButtonText = styled.p`
	margin-block-start: 0;
	margin-block-end: 0;
	${({ loading }) =>
		loading === 'true' &&
		css`
			animation-name: ${rotation};
			animation-duration: 0.5s;
			animation-timing-function: ease;
			animation-delay: 0s;
			animation-iteration-count: infinite;
			animation-direction: normal;
			animation-fill-mode: forwards;
			animation-play-state: running;
		`}
`;
