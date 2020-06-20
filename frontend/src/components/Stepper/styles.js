import styled from 'styled-components';

export const StyledWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px;

    > * {
        text-align: center;

        &:first-child {
            text-align: start;
        }

        &:last-child {
            text-align: end;
        }
    }
`;

export const StyledStep = styled.p`
    color: ${({ finished }) => finished ? '#3750DB' : '#ABABAB'};
    font-weight: 300;
    font-size: 0.8rem;
    margin: 0 20px;
    width: 100px;
`;

export const StyledDot = styled.span`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ finished }) => finished ? '#3750DB' : '#ABABAB'};
`;

export const StyledLine = styled.span`
    width: ${({ width }) => width + 'px'};
    height: 1px;
    margin: 0 10px;
    background-color: ${({ finished }) => finished ? '#3750DB' : '#ABABAB'};
`;
