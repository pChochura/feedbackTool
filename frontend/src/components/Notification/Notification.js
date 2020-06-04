import React from 'react';
import { StyledNotification, StyledTitle, StyledDescription, StyledImg, TitleWrapper } from './styles';
import warningIcon from '../../assets/images/warning.svg';

const Notification = ({ title, description, exit }) => {
    return (
        <StyledNotification exit={exit}>
            <TitleWrapper>
                <StyledImg src={warningIcon} />
                <StyledTitle>{title}</StyledTitle>
            </TitleWrapper>
            <StyledDescription>{description}</StyledDescription>
        </StyledNotification>
    );
};

export default Notification;
