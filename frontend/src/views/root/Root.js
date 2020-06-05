import React, { useState, useEffect } from 'react';
import moment from 'moment';
import socketIOClient from "socket.io-client";
import { useCookies } from 'react-cookie';
import { StyledWrapper, LandingWrapper, LandingLeft, StyledImg, StyledParagraph, ButtonWrapper } from './styles';
import TopBar from '../../components/TopBar/TopBar';
import landing from '../../assets/images/landing.svg';
import Button from '../../components/Button/Button';
import Notification from '../../components/Notification/Notification';
import { useForceUpdate } from '../../components/hooks';

const Root = ({ history }) => {
    const [locked, setLocked] = useState(false);
    const [date, setDate] = useState('');
    const [, setCookie] = useCookies(['seed']);
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

    const startSession = async () => {
        const seed = Math.random().toString(36).slice(2);
        setCookie('seed', seed, { maxAge: 60 * 60 }, { path: '/' });
        fetch(`${process.env.REACT_APP_URL}/api/main`, {
            method: 'POST',
            body: JSON.stringify({
                seed,
            }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }).then((res) => {
            return res.json();
        }).then((json) => {
            history.push(`/${json.id}`);
        }).catch(() => {
            postNotification({
                title: 'Error',
                description: "There's been a problem with getting the main page. Please try later.",
            });
        });
    };

    useEffect(() => {
        const getData = async () => {
            const mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`, { credentials: 'include' })).json();

            if (mainPage.locked) {
                setLocked(true);
                setDate(moment.unix(mainPage.expirationTimestamp).format('HH:mm:ss'));
            }
        }

        getData();
    }, []);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('mainLocked', (data) => {
            setLocked(true);
            setDate(moment.unix(data.until).format('HH:mm:ss'));
        });

        return () => io.disconnect();
    }, [setLocked, setDate]);

    return (
        <StyledWrapper>
            <TopBar buttonContent={locked ? '' : 'Start'} buttonCallback={() => startSession()} />
            <LandingWrapper>
                <LandingLeft>
                    <b>Send</b> feedback<br />
                    <b>Receive</b> feedback
                    <StyledParagraph>Share your thoughts with your team <b>anonymously</b></StyledParagraph>
                    <ButtonWrapper>
                        <Button onClick={() => startSession()} disabled={locked}>Start</Button>
                        {locked &&
                            <StyledParagraph>Locked up to {date}</StyledParagraph>
                        }
                    </ButtonWrapper>
                </LandingLeft>
                <StyledImg src={landing} />
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
            </LandingWrapper>
        </StyledWrapper>
    );
};

export default Root;