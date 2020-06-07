import React, { useState, useEffect } from 'react';
import { StyledWrapper, StyledCard, StyledTitle, StyledParagraph, StyledBox } from './styles';
import { StyledImg } from '../PersonCard/styles';
import closeIcon from '../../assets/images/close.svg';
import copyIcon from '../../assets/images/copy.svg';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import Notification from '../Notification/Notification';
import { useForceUpdate } from '../hooks';

const Modal = ({ title = 'Invite someone to your team!', description = 'Everyone with this link can join', children, onDismissCallback, link, isExiting }) => {
    const [exit, setExit] = useState(isExiting);
    const [notifications, setNotifications] = useState([]);
    const render = useForceUpdate();

    const copyLink = () => {
        const dummyElement = document.createElement('input');
        dummyElement.value = link;
        document.body.appendChild(dummyElement);
        dummyElement.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(dummyElement);
        if (successful) {
            postNotification({
                title: 'Success!',
                description: 'The link has been copied to the clipboard.',
                success: true,
            });
        } else {
            postNotification({
                title: 'Error!',
                description: "We couldn't copy the link to the clipboard. Try again later.",
            });
        }
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

    useEffect(() => {
        setExit(isExiting);
    }, [isExiting]);

    return (
        <StyledWrapper exit={exit} onAnimationEnd={() => exit && onDismissCallback && onDismissCallback()} >
            <StyledCard>
                <StyledImg src={closeIcon} clickable onClick={() => setExit(true)} />
                <StyledTitle>{title}</StyledTitle>
                <StyledParagraph>{description}</StyledParagraph>
                {children ?
                    children
                    :
                    <StyledBox onClick={() => window.open(link, '_blank')}>
                        <StyledParagraph>{link}</StyledParagraph>
                        <StyledImg src={copyIcon} clickable onClick={(e) => {
                            e.nativeEvent.stopImmediatePropagation();
                            e.stopPropagation();
                            e.preventDefault();
                            copyLink();
                        }} />
                    </StyledBox>
                }
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
