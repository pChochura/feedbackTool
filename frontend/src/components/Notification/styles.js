import styled, { keyframes, css } from 'styled-components';

const enterAnimation = (wide) =>
	wide
		? keyframes`
    0% {
        right: 0;
        opacity: 0;
    }
    100% {
        right: 50px;
        opacity: 1;
    }
`
		: keyframes`
    0% {
        right: 0;
        opacity: 0;
    }
    100% {
        right: 5px;
        opacity: 1;
    }
`;

const exitAnimation = (wide) =>
	wide
		? keyframes`
    0% {
        right: 50px;
        opacity: 1;
    }
    100% {
        right: 0px;
        opacity: 0;
    }
`
		: keyframes`
    0% {
        right: 5px;
        opacity: 1;
    }
    100% {
        right: 0px;
        opacity: 0;
    }
`;

export const StyledNotification = styled.div`
	position: fixed;
	right: 5px;
	max-width: 300px;
	width: 90%;
	bottom: calc(${({ index }) => index + ' * 125px + 30px'});
	min-height: 60px;
	background: #ffffff;
	box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	padding: 15px 15px 5px 15px;
	transition: 0.5s bottom;
	z-index: 100;

	animation-name: ${({ exit }) =>
		exit ? exitAnimation(false) : enterAnimation(false)};
	animation-duration: 0.5s;
	animation-timing-function: ease;
	animation-delay: 0s;
	animation-iteration-count: 1;
	animation-direction: normal;
	animation-fill-mode: forwards;
	animation-play-state: running;

	@media (min-width: 900px) {
		width: 300px;
		right: 50px;
		bottom: calc(
			${({ index, offset }) => index + ' * 125px + 50px - ' + offset + 'px'}
		);
		animation-name: ${({ exit }) =>
			exit ? exitAnimation(true) : enterAnimation(true)};
	}
`;

export const TitleWrapper = styled.div`
	display: flex;
	width: 100%;
`;

export const StyledAction = styled.a`
	color: #3750db;
	font-weight: 400;
	cursor: pointer;
`;

export const StyledIcon = styled.img`
	width: 24px;
	height: 24px;
	color: #ff0000;
`;

export const StyledImg = styled.img`
	width: 24px;
	height: 24px;
	position: absolute;
	right: 10px;
	top: 10px;
	border-radius: 50%;
	padding: 5px;
	background-color: ${({ background }) => background || 'unset'};
	transition: 0.5s background-color;

	${({ clickable }) =>
		clickable &&
		css`
			&:hover {
				background-color: #efefef;
				cursor: pointer;
			}
		`}
`;

export const StyledTitle = styled.p`
	display: inline-block;
	margin-block-end: 0;
	margin-block-start: 0;
	font-size: 0.9em;
	justify-self: center;
	margin-left: 5px;
	font-weight: 600;
	margin: auto 5px;

	@media (min-width: 900px) {
		font-size: 1.2rem;
	}
`;

export const StyledDescription = styled.p`
	font-weight: 300;
	font-size: 0.8rem;

	@media (min-width: 900px) {
		font-size: 1rem;
	}
`;
