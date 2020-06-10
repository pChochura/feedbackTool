import styled from 'styled-components';

export const StyledWrapper = styled.div`
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
`;

export const LandingWrapper = styled.div`
    box-sizing: border-box;
    min-height: calc(100% - 100px);
    width: 100%;
    display: flex;
    padding: 50px 10px;
    flex-direction: column-reverse;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex: none;

    @media(min-width: 900px) {
        padding: 0 100px;
        flex-direction: row;
        justify-content: space-between;
    }
`;

export const LandingLeft = styled.div`
    font-size: 1.5rem;
    align-self: center;
    line-height: 3rem;
    text-align: center;
    margin-top: 50px;
    flex: none;

    @media(min-width: 900px) {
        text-align: left;
    }
`;

export const StyledImg = styled.img`
    width: 50%;
    align-self: center;
    flex: none;

    @media(min-width: 900px) {
        max-width: 40%;
    }
`;

export const StyledParagraph = styled.p`
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.2rem;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    flex-direction: column;
    height: 60px;

    p {
        margin-left: 10px;
    }

    button {
        flex: none;
    }

    @media(min-width: 900px) {
        justify-content: left;
        flex-direction: row;
    }
`;

export const StyledLink = styled.a`
    color: #3750DB;
    font-weight: 400;
    cursor: pointer;
`;
