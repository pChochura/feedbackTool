import styled from 'styled-components';

export const StyledWrapper = styled.div`
	height: 100vh;
	width: 100%;
	margin: 0;
	padding: 0;
`;

export const DashboardWrapper = styled.div`
	display: flex;
	padding: 30px;
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
	margin-top: 20px;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	button {
		flex: none;
		margin: 10px 5px 5px 5px;
	}

	@media (min-width: 900px) {
		margin-top: 50px;
		flex-direction: row;

		button {
			margin: 0 20px;
		}
	}
`;
