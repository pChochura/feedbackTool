import styled from "styled-components";

export const StyledWrapper = styled.div`
    display: flex;
    position: relative;
    align-items: center;
`;

export const StyledSearch = styled.input`
    box-sizing: border-box;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
    width: 300px;
    padding: 10px;
    padding-right: 40px;
    height: 45px;
    outline-color: #3750DB;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-family: 'Montserrat';
    font-weight: 300;

    &::placeholder {
        color: #ABABAB;
    }
`;

export const StyledImg = styled.img`
    width: 24px;
    height: 24px;
    position: absolute;
    right: 10px;
`;
