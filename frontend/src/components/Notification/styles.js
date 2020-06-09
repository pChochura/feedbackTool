import styled, { keyframes } from "styled-components";

const enterAnimation = (wide) => wide ? 
keyframes`
    0% {
        right: 0;
        opacity: 0;
    }
    100% {
        right: 50px;
        opacity: 1;
    }
` : keyframes`
    0% {
        right: 0;
        opacity: 0;
    }
    100% {
        right: 5px;
        opacity: 1;
    }
`;

const exitAnimation = (wide) => wide ? 
keyframes`
    0% {
        right: 50px;
        opacity: 1;
    }
    100% {
        right: 0px;
        opacity: 0;
    }
` : keyframes`
    0% {
        right: 5px;
        opacity: 1;
    }
    100% {
        right: 0px;
        opacity: 0;
    }
`;

export const StyledNotification = styled.div`
    position: absolute;
    right: 5px;
    max-width: 300px;
    width: 90%;
    bottom: calc(${({ index, offset }) => index + ' * 125px + 5px - ' + offset + 'px'});
    min-height: 60px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 15px 15px 5px 15px;
    transition: .5s bottom;
    z-index: 100;

    animation-name: ${({ exit }) => exit ? exitAnimation(false) : enterAnimation(false)};
    animation-duration: .5s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;

    @media(min-width: 900px) {
        width: 300px;
        right: 50px;
        bottom: calc(${({ index, offset }) => index + ' * 125px + 50px - ' + offset + 'px'});
        animation-name: ${({ exit }) => exit ? exitAnimation(true) : enterAnimation(true)};
    }
`;

export const TitleWrapper = styled.div`
    display: flex;
    justify-contnet: center;
`;

export const StyledImg = styled.img`
    width: 24px;
    height: 24px;
    color: #ff0000;
`;

export const StyledTitle = styled.p`
    display: inline-block;
    margin-block-end: 0;
    margin-block-start: 0;
    font-size: 1.2rem;
    justify-self: center;
    margin-left: 5px;
    font-weight: 600;
`;

export const StyledDescription = styled.p`
    font-weight: 300;
`;
