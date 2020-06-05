import styled from "styled-components";

export const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100%;
    padding-bottom: 100px;
`;

export const StyledTitle = styled.p`
    margin-block-start: 0;
    margin-block-end: 0;
    font-weight: 600;
    font-size: 2rem;
    margin-top: 100px;
`;

export const StyledParagraph = styled.p`
    margin-block-start: 0;
    margin-block-end: 0;
    margin: 25px 0;
    text-align: center;
    font-size: 1.1rem;
    line-height: 2rem;
    font-weight: 300;
`;

export const StyledBox = styled.div`
    width: 40%;
    max-width: 700px;
    padding: 25px 50px;
    box-sizing: border-box;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
`;

export const StyledInput = styled.input`
    background-color: #EFEFEF;
    border: none;
    width: 100%;
    align-self: center;
    padding: 10px;
    outline-color: #3750DB;
    outline-width: 1px;
    box-sizing: border-box;
    font-family: 'Montserrat';
    color: #515151;
`;

export const StyledLabel = styled.label`
    font-weight: 300;
    font-size: 1rem;
    color: #ABABAB;
    margin: 10px 0;
`;

export const ButtonWrapper = styled.div`
    align-self: center;
    margin-top: 40px;
    margin-bottom: 25px;
`;
