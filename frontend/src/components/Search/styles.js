import styled from "styled-components";

export const StyledWrapper = styled.div`
    display: flex;
    position: relative;
    align-items: center;
`;

export const StyledSearch = styled.input`
    box-sizing: border-box;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    max-width: 300px;
    width: unset;
    padding: 10px;
    padding-right: 40px;
    height: 45px;
    outline-color: #3750DB;
    outline-width: 1px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-family: 'Montserrat';
    font-weight: 300;
    transition: .5s box-shadow;

    &::placeholder {
        color: #ABABAB;
    }

    &:focus {
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.05);
    }

    @media(min-width: 900px) {
        width: 300px;
    }
`;

export const StyledImg = styled.img`
    width: 24px;
    height: 24px;
    position: absolute;
    right: 10px;
`;
