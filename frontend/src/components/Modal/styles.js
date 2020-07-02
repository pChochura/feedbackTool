import styled, { keyframes } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

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
        right: 50px;
        opacity: 1;
    }
    100% {
        right: 0px;
        opacity: 0;
    }
`;

export const StyledWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.15);
	backdrop-filter: blur(5px);
	display: flex;
	z-index: 100;

	animation-name: ${({ exit }) => (exit ? exitAnimation : enterAnimation)};
	animation-duration: 0.5s;
	animation-timing-function: ease;
	animation-delay: 0s;
	animation-iteration-count: 1;
	animation-direction: normal;
	animation-fill-mode: forwards;
	animation-play-state: running;
`;

export const StyledCard = styled.div`
	width: 80%;
	max-width: 600px;
	border-radius: 5px;
	margin: auto;
	background-color: #ffffff;
	justify-self: center;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 25px;

	@media (min-width: 900px) {
		width: 50%;
		padding: 50px 25px;
	}
`;

export const StyledTitle = styled.p`
	font-size: 1.2rem;
	font-weight: 500;
	margin-block-end: 0;
	margin-block-start: 0;
	text-align: center;

	@media (min-width: 900px) {
		font-size: 1.75rem;
	}
`;

export const StyledParagraph = styled.p`
	font-size: 0.8rem;
	color: #ababab;
	font-weight: 300;
	text-align: center;

	@media (min-width: 900px) {
		font-size: 1rem;
	}
`;

export const StyledBox = styled.div`
	position: relative;
	border-radius: 5px;
	border-style: solid;
	border-color: #ababab;
	border-width: 1px;
	height: 50px;
	width: 95%;
	margin-top: 50px;
	display: flex;
	cursor: pointer;

	p {
		margin: auto 40px auto 10px;
		color: #515151;
		font-weight: 400;
		font-size: 0.75rem;
		word-break: break-all;
		text-align: left;
	}

	img {
		align-self: center;
		top: unset;
	}

	@media (min-width: 900px) {
		width: 80%;

		p {
			font-size: 1rem;
		}
	}
`;

export const FeedbackDescription = styled.p`
	color: #ababab;
	font-weight: 300;
	text-align: center;
	font-size: 0.8rem;

	@media (min-width: 900px) {
		font-size: 1rem;
	}
`;

export const StyledLabel = styled.label`
	font-weight: 300;
	font-size: 0.8rem;
	color: #ababab;
	margin: 10px;
	align-self: flex-start;

	b {
		color: #ff5453;
	}

	@media (min-width: 900px) {
		font-size: 1rem;
	}
`;

export const StyledTextArea = styled(TextareaAutosize)`
	background-color: #efefef;
	border: none;
	width: 100%;
	align-self: center;
	padding: 5px;
	outline-color: #3750db;
	outline-width: 1px;
	box-sizing: border-box;
	font-family: 'Montserrat';
	font-size: 1rem;
	font-weight: 300;
	color: #515151;
	resize: none;

	@media (min-width: 900px) {
		padding: 15px 10px;
	}
`;

export const StyledInput = styled.input`
	background-color: #efefef;
	border: ${({ error }) =>
		error ? '1px solid #FF5453' : '1px solid #00000000'};
	width: 100%;
	align-self: center;
	padding: 5px;
	outline-color: #3750db;
	outline-width: 1px;
	box-sizing: border-box;
	font-family: 'Montserrat';
	font-size: 1rem;
	font-weight: 300;
	color: #515151;

	@media (min-width: 900px) {
		padding: 15px 10px;
	}
`;

export const FeedbackSendButtonWrapper = styled.div`
	margin-top: 50px;
`;
