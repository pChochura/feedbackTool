import React, { useState } from 'react';
import { StyledWrapper, StyledCard, StyledTitle, StyledParagraph, StyledBox } from './styles';
import { StyledImg } from '../PersonCard/styles';
import closeIcon from '../../assets/images/close.svg';
import copyIcon from '../../assets/images/copy.svg';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import Notification from '../Notification/Notification';

const Modal = ({ onDismissCallback, link }) => {
    const [exit, setExit] = useState(false);
    const [notification, setNotification] = useState();

    const goToLink = () => {
        window.location.href = link;
    };

    const copyLink = () => {
        navigator.clipboard.writeText(link).then(() => {
            setNotification({
                title: 'Success!',
                description: 'The link has been copied to the clipboard.',
                success: true,
            });
        }).catch(() => {
            setNotification({
                title: 'Error!',
                description: "We couldn't copy the link to the clipboard. Try again later.",
            });
        });
    };

    return (
        <StyledWrapper exit={exit} onAnimationEnd={() => exit && onDismissCallback && onDismissCallback()} >
            <StyledCard>
                <StyledImg src={closeIcon} clickable onClick={() => setExit(true)} />
                <StyledTitle>Invite someone to your team!</StyledTitle>
                <StyledParagraph>Everyone with this link can join</StyledParagraph>
                <StyledBox onClick={() => goToLink()}>
                    <StyledParagraph>{link}</StyledParagraph>
                    <StyledImg src={copyIcon} clickable onClick={(e) => {
                        copyLink();
                        e.stopPropagation();
                    }} />
                </StyledBox>
            </StyledCard>
            {notification &&
                <Notification 
                    icon={notification.success ? successIcon : warningIcon}
                    title={notification.title}
                    description={notification.description}
                    callback={() => setNotification()}
                />
            }
        </StyledWrapper>
    );
};

export default Modal;
