import styled, { css } from "styled-components";

export const StyledButton = styled.button`
    background: #3750DB;
    color: #ffffff;
    outline: none;
    border: none;
    width: ${({ small }) => small ? '100px' : '150px'};
    height: ${({ small }) => small ? '30px' : '40px'};
    border-radius: 5px;
    font-size: ${({ small }) => small ? '0.8rem' : '1.1rem'};
    transition: .5s all;
    ${({ disabled }) => disabled ? css`filter: grayscale(.75);` : css`cursor: pointer;` }

    &:hover {
        filter: grayscale(.75);
        ${({ disabled }) => disabled && css`cursor: not-allowed;` }
    }
`;