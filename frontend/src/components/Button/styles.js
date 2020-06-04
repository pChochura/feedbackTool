import styled, { css } from "styled-components";

export const StyledButton = styled.button`
    background: #3750DB;
    color: #ffffff;
    outline: none;
    border: none;
    width: 150px;
    height: 40px;
    border-radius: 5px;
    font-size: 1.1rem;
    transition: .5s all;
    ${({ disabled }) => disabled ? css`filter: grayscale(.75);` : css`cursor: pointer;` }

    &:hover {
        filter: grayscale(.75);
    }
`;