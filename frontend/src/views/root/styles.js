import styled from 'styled-components';

export const StyledWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    max-height: 100vh;
    max-width: 100vw;
    margin: 0;
    padding: 0;
`;

export const LandingWrapper = styled.div`
    height: calc(100% - 100px);
    widht: 100%;
    display: flex;
    padding: 0 100px;
    justify-content: space-between;
    align-content: center;
    align-items: center;
`;

export const LandingLeft = styled.div`
    font-size: 1.5rem;
    align-self: center;
    line-height: 3rem;
`;

export const StyledImg = styled.img`
    max-width: 40%;
`;

export const StyledParagraph = styled.p`
    font-size: 1rem;
    font-weight: 300;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    height: 60px;

    p {
        margin-left: 10px;
    }
`;
