import styled, { keyframes } from 'styled-components';

const enterAnimation = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const exitAnimation = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`;

export const StyledCard = styled.div`
	position: absolute;
	top: 75px;
	right: 30px;
	max-width: 500px;
	display: flex;
	flex-direction: column;
	box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
	background-color: #ffffff;
	z-index: 100;

	animation-name: ${({ exit }) => (exit ? exitAnimation : enterAnimation)};
	animation-duration: 0.3s;
	animation-timing-function: ease;
	animation-delay: 0s;
	animation-iteration-count: 1;
	animation-direction: normal;
	animation-fill-mode: forwards;
	animation-play-state: running;

	@media (min-width: 900px) {
		top: 100px;
		right: 100px;
	}

	@media (max-width: 450px) {
		right: 0;
		left: 0;
	}
`;

export const HeaderWrapper = styled.div`
	width: 100%;
	padding: 0 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;

	&::after {
		display: block;
		content: ' ';
		width: calc(100% + 20px);
		height: 1px;
		background-color: #efefef;
	}
`;

export const StyledTitle = styled.p`
	font-size: 1.5rem;
	font-weight: 400;
	text-align: center;
	margin-block-start: 0;
	margin-block-end: 0;
	margin-top: 50px;
`;

export const StyledSubtitle = styled.p`
	font-size: 1rem;
	font-weight: 300;
	color: #ababab;
	margin-block-start: 0;
	margin-block-end: 0;
	margin: 10px 0 50px 0;
	text-align: center;

	b {
		color: #3750db;
		font-weight: 400;
	}
`;

export const StyledOption = styled.div`
	margin: 10px 10px 0 10px;
	border-radius: 10px;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 10px;
	cursor: pointer;
	transition: 0.3s background-color;

	&:hover {
		background-color: #efefef;
	}
`;

export const StyledParagraph = styled.p`
	font-weight: 400;
	font-size: 0.9rem;
	margin-block-start: 0;
	margin-block-end: 0;
	color: ${({ negative }) => (negative ? '#FF5453' : '#515151')};

	b {
		color: #3750db;
		font-weight: 400;
	}
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding: 20px;
	box-sizing: border-box;
`;
