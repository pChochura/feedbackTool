import styled, { keyframes } from "styled-components";

const enterAnimation = keyframes`
    0% {
        right: 0px;
        opacity: 0;
    }
    100% {
        right: 50px;
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

export const StyledNotification = styled.div`
    position: absolute;
    right: 50px;
    bottom: 50px;
    width: 300px;
    min-height: 60px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 15px 15px 5px 15px;

    animation-name: ${({ exit }) => exit ? exitAnimation : enterAnimation};
    animation-duration: .5s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
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
