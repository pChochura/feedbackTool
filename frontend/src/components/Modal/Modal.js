import React, { useState } from 'react';
import { StyledWrapper, StyledCard, StyledTitle, StyledParagraph, StyledBox } from './styles';
import { StyledImg } from '../PersonCard/styles';
import closeIcon from '../../assets/images/close.svg';
import copyIcon from '../../assets/images/copy.svg';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import Notification from '../Notification/Notification';
import { useForceUpdate } from '../hooks';

const Modal = ({ onDismissCallback, link }) => {
    const [exit, setExit] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const render = useForceUpdate();

    const copyLink = () => {
        navigator.clipboard.writeText(link).then(() => {
            postNotification({
                title: 'Success!',
                description: 'The link has been copied to the clipboard.',
                success: true,
            });
        }).catch(() => {
            postNotification({
                title: 'Error!',
                description: "We couldn't copy the link to the clipboard. Try again later.",
            });
        });
    };

    const postNotification = (_notification) => {
        setNotifications((n) => [
            ...n,
            {
                ..._notification,
                id: Math.random(),
            },
        ]);
    };

    const requeueNotification = () => {
        setNotifications((n) => { 
            n.shift();
            return notifications;
        });
        render();
    };

    return (
        <StyledWrapper exit={exit} onAnimationEnd={() => exit && onDismissCallback && onDismissCallback()} >
            <StyledCard>
                <StyledImg src={closeIcon} clickable onClick={() => setExit(true)} />
                <StyledTitle>Invite someone to your team!</StyledTitle>
                <StyledParagraph>Everyone with this link can join</StyledParagraph>
                <StyledBox onClick={() => window.open(link, '_blank')}>
                    <StyledParagraph>{link}</StyledParagraph>
                    <StyledImg src={copyIcon} clickable onClick={(e) => {
                        copyLink();
                        e.stopPropagation();
                        e.preventDefault();
                    }} />
                </StyledBox>
            </StyledCard>
            {notifications &&
                notifications.slice(0, 3).map((notification, index) =>
                    <Notification
                        key={notification.id}
                        icon={notification.success ? successIcon : warningIcon}
                        index={Math.min(notifications.length, 3) - index - 1}
                        title={notification.title}
                        description={notification.description}
                        callback={() => requeueNotification()}
                    />
                )
            }
        </StyledWrapper>
    );
};

export default Modal;
