import styled, { css } from 'styled-components';

export const StyledWrapper = styled.div`
	background: #ffffff;
	box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
	width: 100%;
	height: 75px;
	display: flex;
	align-items: center;
	justify-content: end;
	padding: 0px 30px;
	box-sizing: border-box;

	@media (min-width: 900px) {
		padding: 0px 100px;
		height: 100px;
	}

	@media (max-width: 450px) {
		justify-content: ${({ onlyLogo }) =>
		onlyLogo ? 'center' : 'space-between'};

		button {
			margin-left: auto;
		}
	}
`;

export const LogoWrapper = styled.div`
	display: flex;
	margin-right: auto;
	cursor: pointer;

	@media (max-width: 450px) {
		${({ onlyLogo }) =>
		onlyLogo
			? css`
				margin-left: auto;
				margin-right: auto;
			`
			: css`
				display: none;
			`}
	}
`;

export const StyledLogo = styled.img`
	width: 21px;
	height: 17px;
	align-self: center;

	@media (min-width: 900px) {
		width: 31px;
		height: 26px;
	}
`;

export const StyledParagraph = styled.p`
	font-size: 0.8rem;
	margin: 0px 10px;
	align-self: center;

	@media (min-width: 900px) {
		font-size: 1.2rem;
	}
`;

export const LoggedBoxWrapper = styled.div`
	display: flex;
	align-items: center;
	border-radius: 10px;
	transition: .3s background-color;
	cursor: pointer;

	&:hover {
		background-color: #efefef;
	}
`;

export const StyledImg = styled.img`
	background-color: #efefef;
	border-radius: 50%;
	width: 48px;
	height: 48px;
	padding: 8px;
	box-sizing: border-box;
`;

export const StyledEmail = styled.p`
	font-size: 1rem;
	margin: 0 10px;
`;
