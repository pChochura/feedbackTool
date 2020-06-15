import styled from 'styled-components';

export const StyledFooter = styled.footer`
	box-sizing: border-box;
	width: 100%;
	height: 50px;
	background-color: #515151;
	padding: 0 30px;
	display: flex;
	justify-content: center;
	color: #ffffff;
	align-items: center;
	font-weight: 300;
	font-size: 0.8rem;

	span {
		&:last-child {
			display: none;
		}

		> * {
			margin: 0 10px;
		}
	}

	em {
		font-style: normal;
		color: #ababab;
		margin: 0;
	}

	button {
		font-size: 0.7rem;
		background: none;
		padding: 0;
	}

	@media(min-width: 900px) {
		padding: 0 100px;
	}

	@media(min-width: 450px) {
		justify-content: space-between;
		span {
			&:last-child {
				display: inline;
			}
		}
	}
`;
