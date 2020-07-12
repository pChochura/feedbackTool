import styled, { css } from 'styled-components';

export const StyledCard = styled.div`
	width: 250px;
	${({ highlighted }) =>
		highlighted
			? css`
					box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
			  `
			: css`
					box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
			  `}
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	border-radius: 5px;
	overflow: hidden;
	margin: 30px;
	padding-bottom: 50px;

	@media (min-width: 900px) {
		width: 350px;
	}
`;

export const Header = styled.div`
	height: 80px;
	align-items: center;
	justify-content: center;
	display: flex;
	background-color: ${({ highlighted }) =>
		highlighted ? '#3750DB' : '#ffffff'};
`;

export const StyledTitle = styled.p`
	margin-block-start: 0;
	margin-block-end: 0;
	font-weight: ${({ highlighted }) => (highlighted ? '500' : '300')};
	font-size: 1.5rem;
	color: ${({ highlighted }) => (highlighted ? '#ffffff' : '#515151')};
`;

export const StyledList = styled.ul`
	font-weight: 300;
	padding: 0;
	width: 80%;
	align-self: center;
`;

export const StyledListItem = styled.li`
	margin: 10px 0;
	list-style: none;
	align-items: center;
	display: inline-flex;
	font-size: ${({ bigger }) => (bigger ? '1.2rem' : '0.9rem')};

	&::before {
		display: block;
		content: url(${({ img }) => img});
		${({ bigger }) =>
			bigger &&
			css`
				zoom: 2;
			`}
		width: 24px;
		height: 24px;
		margin-right: ${({ bigger }) => (bigger ? '10px' : '5px')};
	}

	span,
	b {
		margin: 0;
		display: inline;
	}

	b {
		color: #3750db;
		font-weight: 400;
	}

	@media (max-width: 900px) {
		font-size: ${({ bigger }) => (bigger ? '1rem' : '0.9rem')};

		b::before {
			${({ bigger }) =>
				bigger &&
				css`
					zoom: 1.5;
				`}
		}
	}
`;

export const DetailsWrapper = styled.div`
	align-self: center;
	margin-top: auto;

	> * {
		font-size: 0.9rem;
	}

	b {
		color: #3750db;
		font-weight: 800;
	}
`;

export const StyledPrice = styled.div`
	font-weight: 400;
	font-size: 1.3rem;
	display: flex;
	justify-content: center;

	span {
		margin: 0;
		display: inline;
	}
`;

export const StyledDetails = styled.div`
	display: flex;
	flex-direction: column;
	align-content: center;
	color: #ababab;
	font-weight: 300;
	margin: 10px 0;

	span {
		margin: 0;
		display: inline;
	}
`;
