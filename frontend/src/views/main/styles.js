import styled from 'styled-components';

export const StyledWrapper = styled.div`
	height: 100vh;
	width: 100%;
	margin: 0;
	padding: 0;
`;

export const DashboardWrapper = styled.div`
	box-sizing: border-box;
	display: flex;
	padding: 30px;
	min-height: calc(100vh - 150px);
	flex-direction: column;

	@media (min-width: 900px) {
		padding: 100px;
	}
`;

export const MainBarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	flex-direction: column;

	@media (min-width: 900px) {
		flex-direction: row;
	}
`;

export const StyledTitle = styled.p`
	font-weight: 600;
	font-size: 2rem;
	text-align: center;

	@media (min-width: 900px) {
		text-align: left;
	}
`;

export const CardsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
	margin-top: 20px;
`;

export const ModalButtonsWrapper = styled.span`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	button {
		flex: none;
		margin: 10px 5px 5px 5px;
	}

	@media (min-width: 900px) {
		margin-top: 30px;
		flex-direction: row;

		button {
			margin: 0 20px;
		}
	}
`;

export const StyledDropdown = styled.div`
	text-align: center;
	padding: 10px 50px 10px 30px;
	border: solid 1px #ababab;
	border-radius: 5px;
	color: #515151;
	position: relative;
	cursor: pointer;
	transition: filter 0.5s;

	&:hover {
		filter: grayscale(0.5);
	}

	img {
		position: absolute;
		right: 20px;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 24px;
		height: 24px;
	}

	div {
		top: 100%;
		right: 0;
		left: 0;
		width: 100%;
		box-shadow: none;
		border: 1px solid #ababab;
		border-radius: 5px;
	}
`;
