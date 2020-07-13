import styled, { keyframes, css } from 'styled-components';

export const StyledWrapper = styled.div`
	width: 100%;
	margin: 0;
	padding: 0;
	background-image: url(${({ background }) => background});
	background-size: cover;
`;

export const LandingWrapper = styled.div`
	box-sizing: border-box;
	min-height: calc(200% - 100px);
	width: 100%;
	display: flex;
	flex-direction: column;
`;

export const LandingTop = styled.div`
	box-sizing: border-box;
	display: flex;
	height: calc(100vh - 100px);
	width: 100%;
	display: flex;
	padding: 50px 10px;
	flex-direction: column-reverse;
	justify-content: center;
	align-content: center;
	align-items: center;

	@media (min-width: 900px) {
		padding: 0 100px;
		flex-direction: row;
		justify-content: space-between;
	}
`;

export const LandingLeft = styled.div`
	font-size: 1.8rem;
	align-self: center;
	line-height: 3rem;
	text-align: center;
	margin-top: 50px;
	flex: none;

	b {
		position: relative;
		z-index: 2;

		&::before {
			position: absolute;
			left: -10px;
			top: 20px;
			display: block;
			content: ' ';
			background-color: #3750db;
			width: 115px;
			height: 20px;
			opacity: 0.2;
			z-index: 1;
		}
	}

	@media (min-width: 900px) {
		text-align: left;
		font-size: 2.4rem;

		b::before {
			left: -5px;
			top: 30px;
			width: 145px;
		}
	}
`;

export const StyledImg = styled.img`
	height: 50%;
	align-self: center;
	flex: none;
	${({ widthScale }) =>
		widthScale &&
		css`
			width: 60%;
		`}

	@media (min-width: 900px) {
		margin: 50px 100px 20px 100px;
		max-width: 40%;
	}
`;

export const StyledParagraph = styled.p`
	font-size: 1rem;
	font-weight: 300;
	line-height: 1.2rem;
`;

export const ButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: left;
	flex-direction: column;
	height: 60px;

	p {
		z-index: 10;
		margin-left: 10px;
		margin-right: 10px;
	}

	button {
		z-index: 10;
		flex: none;
	}

	@media (min-width: 900px) {
		justify-content: left;
		flex-direction: row;
	}
`;

export const StyledLink = styled.a`
	color: #3750db;
	font-weight: 400;
	cursor: pointer;
`;

export const ScrollIndicator = styled.div`
	cursor: pointer;
	box-sizing: border-box;
	position: absolute;
	top: calc(100vh - 70px);
	width: 100%;
	display: flex;
	justify-content: flex-start;
	padding: 10px;
	align-items: center;
	font-weight: 300;

	@media (min-width: 900px) {
		justify-content: center;
		top: calc(100vh - 100px);
	}

	> * {
		padding: 10px;
	}
`;

const scroll = keyframes`
	0%, 20%, 30%, 50% {
		transform: translateY(0);
	}
	10%, 40% {
		transform: translateY(10px);
	}
`;

export const ScrollImg = styled.img`
	width: 10px;
	height: 20px;
	animation: ${scroll} 5s infinite ease-in-out;
`;

export const LandingPage = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 70px;
	height: 100%;
	overflow: hidden;

	span {
		margin-top: 50px;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	@media (max-width: 900px) {
		padding: 50px;

		span {
			flex-wrap: wrap;
		}
	}
`;

export const StyledTitle = styled.h1`
	font-weight: 800;
	font-size: 1.8rem;
	text-align: center;
	padding: 10px;

	@media (min-width: 900px) {
		font-size: 2.4rem;
	}
`;

export const StyledSubtitle = styled.h3`
	font-weight: 300;
	font-size: 1.3rem;
	max-width: 600px;
	margin-block-end: 0;
	margin-block-start: 0;
	text-align: center;
`;

export const Watermark = styled.p`
	margin-block-end: 0;
	margin-block-start: 0;
	font-size: calc(40px + (70 - 40) * ((100vw - 300px) / (1600 - 300)));
	opacity: 0.1;
	font-weight: 800;
	position: absolute;
	top: 0;
	${({ left }) =>
		left
			? css`
					left: -10px;
			  `
			: css`
					right: -10px;
			  `};

	@media (min-width: 900px) {
		font-size: calc(70px + (120 - 70) * ((100vw - 300px) / (1600 - 300)));
		${({ left }) =>
			left
				? css`
						left: -30px;
				  `
				: css`
						right: -30px;
				  `};
	}
`;

export const FeedbackContainer = styled.div`
	background: linear-gradient(110.22deg, #3750db 0%, #2d41b3 100%);
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
	border-radius: 5px;
	width: 70%;
	height: 30%;
	margin: 100px 50px;
	overflow: hidden;
	padding: 30px;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;

	&::before {
		content: ' ';
		display: block;
		width: 120px;
		height: 120px;
		left: -30px;
		bottom: -30px;
		position: absolute;
		background: #ababab;
		border-radius: 50%;
		opacity: 0.1;
	}

	&::after {
		content: ' ';
		display: block;
		width: 30px;
		height: 30px;
		left: 50px;
		top: -10px;
		position: absolute;
		background: #ababab;
		border-radius: 50%;
		opacity: 0.1;
	}

	img {
		position: absolute;
		right: -10px;
		top: -10px;
	}

	h1,
	h3 {
		color: #ffffff;
		text-align: center;
	}

	h1 {
		font-weight: 600;
	}

	button {
		margin: 50px;
	}

	@media (max-width: 900px) {
		width: 100%;
		margin: 100px 0;
	}
`;
