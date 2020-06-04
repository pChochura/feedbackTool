import React, { useState, useEffect } from 'react';
import { StyledNotification, StyledTitle, StyledDescription, StyledImg, TitleWrapper } from './styles';
import warningIcon from '../../assets/images/warning.svg';

const Notification = ({ title, description, icon, callback, duration = 3000 }) => {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setExit(true), duration);

        return () => clearTimeout(timeout);
    }, [duration]);

    return (
        <StyledNotification exit={exit} onAnimationEnd={() => exit && callback && callback()}>
            <TitleWrapper>
                <StyledImg src={icon || warningIcon} />
                <StyledTitle>{title}</StyledTitle>
            </TitleWrapper>
            <StyledDescription>{description}</StyledDescription>
        </StyledNotification>
    );
};

export default Notification;
