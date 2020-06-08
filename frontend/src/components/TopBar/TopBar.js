import React from 'react';
import { StyledWrapper, StyledImg, StyledParagraph, LogoWrapper } from './styles';
import logo from '../../assets/images/logo.svg';
import Button from '../Button/Button';

const TopBar = ({ buttonDisabled, buttonContent, buttonCallback, message }) => {
    return (
        <StyledWrapper>
            <LogoWrapper onClick={() => window.location.href = '/'}>
                <StyledImg src={logo} />
                <StyledParagraph>FeedbackTool</StyledParagraph>
            </LogoWrapper>
            {message &&
                <StyledParagraph>{message}</StyledParagraph>
            }
            {buttonContent &&
                <Button onClick={buttonCallback} disabled={buttonDisabled}>{buttonContent}</Button>
            }
        </StyledWrapper>
    );
};

export default TopBar;