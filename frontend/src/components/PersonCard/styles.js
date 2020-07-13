import styled, { css, keyframes } from 'styled-components';

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
	width: 200px;
	min-height: 200px;
	position: relative;
	background: #ffffff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	transition: 0.3s box-shadow;
	margin: 0 20px 40px 20px;
	padding: 30px 0px;
	box-sizing: border-box;

	${({ clickable }) =>
		clickable &&
		css`
			&:hover {
				cursor: pointer;
				box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.05);
			}
		`}

	@media(min-width: 900px) {
		width: 300px;
		min-height: 300px;
	}
`;

export const IconWrapper = styled.div`
	position: relative;
	padding: 12px;
`;

export const StyledIcon = styled.img`
	background-color: #efefef;
	border-radius: 50%;
	width: 100px;
	height: 100px;
	padding: 25px;
	box-sizing: border-box;
`;

export const StyledName = styled.p`
	font-size: 1.2rem;
	font-weight: ${({ dimmed }) => (dimmed ? '300' : '400')};
	color: ${({ dimmed }) => (dimmed ? '#ABABAB' : '#515151')};
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
	transition: 0.3s background-color;

	${({ clickable }) =>
		clickable &&
		css`
			&:hover {
				background-color: #efefef;
				cursor: pointer;
			}
		`}
`;

export const StyledListItem = styled.div`
	width: 80%;
	height: 30px;
	border-radius: 5px;
	background-color: #efefef;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 5px 10px;
	padding: 5px 10px;
	position: relative;
`;

export const ListItemFill = styled.div`
	position: absolute;
	width: ${({ progress }) => progress + '%'};
	height: 100%;
	left: 0;
	background-color: #81b800;
	border-radius: 5px;
`;

export const StyledParagraph = styled.p`
	font-weight: 400;
	font-size: 1rem;
	padding: 0;
	z-index: 1;
	margin-block-start: 0;
	margin-block-end: 0;
`;

export const StyledOptions = styled.div`
	position: absolute;
	top: ${({ pos }) => (pos ? pos.y + 'px' : '15px')};
	right: ${({ pos }) => (pos ? pos.x + 'px' : '15px')};
	padding: 10px 0;
	background-color: #ffffff;
	box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
	z-index: 50;

	animation-name: ${({ exit }) => (exit ? exitAnimation : enterAnimation)};
	animation-duration: 0.3s;
	animation-timing-function: ease;
	animation-delay: 0s;
	animation-iteration-count: 1;
	animation-direction: normal;
	animation-fill-mode: forwards;
	animation-play-state: running;
`;

export const StyledOptionItem = styled.p`
	margin-block-start: 0;
	margin-block-end: 0;
	padding: 5px 10px;
	cursor: pointer;
	background-color: #ffffff;
	transition: 0.3s background-color;

	&:hover {
		background-color: #efefef;
	}
`;
