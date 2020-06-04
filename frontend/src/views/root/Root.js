import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import socketIOClient from "socket.io-client";
import { useCookies } from 'react-cookie';
import { StyledWrapper, LandingWrapper, LandingLeft, StyledImg, StyledParagraph, ButtonWrapper } from './styles';
import TopBar from '../../components/TopBar/TopBar';
import landing from '../../assets/images/landing.svg';
import Button from '../../components/Button/Button';
import Notification from '../../components/Notification/Notification';

const Root = ({ history }) => {
    const [locked, setLocked] = useState(false);
    const [date, setDate] = useState('');
    const [cookies, setCookie] = useCookies(['seed']);
    const [notification, setNotification] = useState({});

    const postNoitifcation = useCallback((title, description) => {
        if (notification.exit === false) {
            return;
        }

        setNotification({
            title: title,
            description: description,
            exit: false,
        });

        setTimeout(() => {
            setNotification({
                title,
                description,
                exit: true,
            });
        }, 3000);
    }, [notification]);

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
            postNoitifcation('Error', "There's been a problem with getting the main page. Please try later.");
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
    }, [setLocked, setDate]);

    return (
        <StyledWrapper>
            <TopBar buttonAction={locked ? '' : 'Start'} buttonCallback={() => startSession()} />
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
                {(notification.title && notification.description) &&
                    <Notification title={notification.title} description={notification.description} exit={notification.exit} />
                }
            </LandingWrapper>
        </StyledWrapper>
    );
};

export default Root;