import styled from 'styled-components';

export const ButtonWrapper = styled.div`
	margin-top: 50px;
`;

export const StyledParagraph = styled.p`
	font-weight: 300;
	text-align: center;
	margin: 10px 30px;

	b {
		color: #3750db;
		cursor: pointer;
		font-weight: 300;
	}

	em {
		font-weight: 800;
		font-style: normal;
	}
`;

export const RowWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 50px;
	flex-direction: column;
`;

export const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 50px;
	margin-bottom: 30px;
	align-content: center;
	justify-items: center;
	flex-wrap: wrap;
	justify-content: center;
`;

export const PlanButton = styled.img`
	width: 36px;
	height: 36px;
	justify-self: center;
	align-self: center;
	border-radius: 50%;
	transition: 0.3s background-color;
	opacity: ${({ disabled }) => (disabled ? '1' : '0.2')};

	&:hover {
		cursor: pointer;
		background-color: #efefef;
	}

	&:first-child {
		margin-right: 30px;
	}

	&:last-child {
		margin-left: 30px;
	}
`;

export const PlanBox = styled.div`
	box-sizing: border-box;
	border-radius: 5px;
	border: solid 1px #ababab;
	padding: 30px 10px 10px 10px;
	width: 150px;
	height: 150px;
	display: flex;
	flex-direction: column;
	justify-items: center;
	align-items: center;

	p {
		margin-block-start: 0;
		margin-block-end: 0;
	}
`;

export const PlanAmount = styled.p`
	font-weight: 300;
	font-size: 2rem;
	color: #515151;
`;

export const PlanDescription = styled.p`
	font-weight: 300;
	font-size: 0.8rem;
	color: #ababab;
`;

export const PlanPrice = styled.p`
	font-weight: 600;
	font-size: 1.2rem;
	color: #3750db;
	margin-top: 10px !important;
`;
