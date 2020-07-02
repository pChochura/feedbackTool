import React from 'react';
import { StyledWrapper, StyledStep, RowWrapper, StyledDot, StyledLine } from './styles';

const Stepper = ({ steps, currentStep }) => {
    return (
        <StyledWrapper>
            <RowWrapper key='losowystring'>
                {steps.map((step, index) =>
                    <StyledStep key={index * 123414} finished={currentStep >= index}>{step}</StyledStep>
                )}
            </RowWrapper>
            <RowWrapper key='innyString'>
                {steps.map((_, index) =>
                    <>
                        <StyledDot key={10 * (index + 1)} finished={currentStep >= index} />
                        {index < steps.length - 1 &&
                            <StyledLine key={20 * (index + 1) + steps.length} finished={currentStep - 1 >= index} width={125} />
                        }
                    </>
                )}
            </RowWrapper>
        </StyledWrapper>
    );
};

export default Stepper;
