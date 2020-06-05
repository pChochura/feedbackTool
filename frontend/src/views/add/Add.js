import React, { useState, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import TopBar from '../../components/TopBar/TopBar';
import { StyledWrapper, StyledTitle, StyledParagraph, StyledBox, StyledInput, StyledLabel, ButtonWrapper } from './styles';
import Button from '../../components/Button/Button';
import { useForceUpdate } from '../../components/hooks';
import Notification from '../../components/Notification/Notification';

const Add = ({ history }) => {
    const [cookies, setCookie] = useCookies(['seed']);
    const [seed] = useState(Math.random().toString(36).slice(2));
    const [name, setName] = useState('');
    const [notifications, setNotifications] = useState([]);
    const render = useForceUpdate();

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

    const join = useCallback(async () => {
        fetch(`${process.env.REACT_APP_URL}/api/rooms`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                seed: cookies.seed || seed,
                name
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(async (data) => {
            if (data.status !== 201) {
                postNotification({
                    title: 'Error',
                    description: 'You have input a valid name.',
                });
                return;
            }

            const room = await data.json();
            setCookie('seed', cookies.seed || seed, { path: '/' });
            history.push(`/room/${room.id}`);
        }).catch(() => {
            postNotification({
                title: 'Error',
                description: 'We encountered some problems while joining you with your team.',
            });
        });
    }, [history, seed, cookies, setCookie, name]);

    return (
        <StyledWrapper>
            <TopBar />
            <StyledTitle>You were invited!</StyledTitle>
            <StyledParagraph>
                Help your team by giving them a meanigful feedback.<br />
                Even if it’s anonymous your friends may still<br />
                recognise that it might be written by you!
            </StyledParagraph>
            <StyledBox>
                <StyledParagraph>
                    To help identify you by your friends,<br />
                    please enter a name
                </StyledParagraph>
                <StyledLabel>Your name</StyledLabel>
                <StyledInput onChange={(e) => setName(e.target.value)} value={name} />
                <ButtonWrapper>
                    <Button onClick={() => join()}>Join</Button>
                </ButtonWrapper>
            </StyledBox>
            {notifications &&
                notifications.slice(0, 3).map((notification, index) =>
                    <Notification
                        key={notification.id}
                        index={Math.min(notifications.length, 3) - index - 1}
                        title={notification.title}
                        description={notification.description}
                        callback={() => requeueNotification()}
                    />
                )
            }
        </StyledWrapper>
    )
}

export default Add