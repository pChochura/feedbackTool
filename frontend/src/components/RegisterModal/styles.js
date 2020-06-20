import styled from 'styled-components';

export const ButtonWrapper = styled.div`
    margin-top: 50px;
`;

export const StyledParagraph = styled.p`
    font-weight: 300;
    text-align: center;
    margin: 10px 30px;

    b {
        color: #3750DB;
        cursor: pointer;
        font-weight: 300;
    }

    em {
        font-weight: 800;
        font-style: normal;
    }
`;

export const RowWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
`;

export const PlanButton = styled.button`
    width: 150px;
    height: 150px;
    padding: 0;
    outline-color: #3750DB;
    outline-width: 1px;
    border: ${({ active }) => active ? '1px solid #3750DB' : 'none'};
    border-radius: 5px;
    margin: 0 20px;
`;

export const StyledPlanImg = styled.img`
    ${({ active }) => !active && 'filter: grayscale(1) opacity(0.5)'};
`;

export const StyledPlanText = styled.p`
    font-weight: 300;
    font-family: 'Montserrat';
    font-size: 1rem;
    color: ${({ active }) => active ? '#3750DB' : '#ABABAB'};
`;
