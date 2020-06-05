import styled, { keyframes } from "styled-components";

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
        right: 50px;
        opacity: 1;
    }
    100% {
        right: 0px;
        opacity: 0;
    }
`;

export const StyledWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(5px);
    display: flex;
    z-index: 100;

    animation-name: ${({ exit }) => exit ? exitAnimation : enterAnimation};
    animation-duration: .5s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
`;

export const StyledCard = styled.div`
    width: 50%;
    max-width: 700px;
    border-radius: 5px;
    margin: auto;
    background-color: #ffffff;
    justify-self: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 75px 25px;
`;

export const StyledTitle = styled.p`
    font-size: 1.75rem;
    font-weight: 500;
    margin-block-end: 0;
    margin-block-start: 0;
`;

export const StyledParagraph = styled.p`
    font-size: 1rem;
    color: #ABABAB;
    font-weight: 300;
`;

export const StyledBox = styled.a`
    text-decoration: none;
    position: relative;
    border-radius: 5px;
    border-style: solid;
    border-color: #ABABAB;
    border-width: 1px;
    height: 50px;
    width: 80%;
    margin-top: 50px;
    display: flex;
    cursor: pointer;
    
    p {
        margin: auto;
        color: #515151;
        font-weight: 400;
    }

    img {
        align-self: center;
        top: unset;
    }
`;
