import React from 'react';
import { StyledWrapper, StyledImg, StyledParagraph, LogoWrapper } from './styles';
import logo from '../../assets/images/logo.svg';
import Button from '../Button/Button';

const TopBar = ({ buttonDisabled, buttonAction, buttonCallback }) => {
    return (
        <StyledWrapper>
            <LogoWrapper>
                <StyledImg src={logo} />
                <StyledParagraph>FeedbackTool</StyledParagraph>
            </LogoWrapper>
            {buttonAction &&
                <Button onClick={buttonCallback} disabled={buttonDisabled}>{buttonAction}</Button>
            }
        </StyledWrapper>
    );
};

export default TopBar;