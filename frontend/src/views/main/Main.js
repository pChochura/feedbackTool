import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { StyledWrapper, StyledTitle, DashboardWrapper, MainBarWrapper, CardsWrapper } from './styles';
import TopBar from '../../components/TopBar/TopBar';
import Search from '../../components/Search/Search';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import PersonCard from '../../components/PersonCard/PersonCard';
import Modal from '../../components/Modal/Modal';
import Notification from '../../components/Notification/Notification';
import { useForceUpdate } from '../../components/hooks';
import moment from 'moment';

const Main = ({ history }) => {
    const [expirationTimestamp, setExpirationTimestamp] = useState(0);
    const [joinModalShowed, setJoinModalShowed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [maxNotesCount, setMaxNotesCount] = useState(0);
    const [showedRooms, setShowedRooms] = useState([]);
    const [time, setTime] = useState('01:00:00');
    const [addLink, setAddLink] = useState('');
    const [phase, setPhase] = useState(1);
    const [rooms, setRooms] = useState([]);
    const { id } = useParams();
    const render = useForceUpdate();

    const getRooms = useCallback(async () => {
        const rooms = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms`, { credentials: 'include' })).json();
        let temp = 0;
        rooms.forEach((room) => {
            room.lists.forEach((list) => {
                temp = temp > list.count ? temp : list.count;
            });
        });
        setMaxNotesCount(maxNotesCount > temp ? maxNotesCount : temp);
        setRooms(rooms);
        setShowedRooms(rooms);
    }, [maxNotesCount]);

    const refreshTimer = useCallback(async () => {
        if (!expirationTimestamp) {
            return;
        }

        const millis = moment.duration(expirationTimestamp * 1000 - Date.now()).asMilliseconds();
        setTime(moment.utc(millis).format('HH:mm:ss'));
        if (millis <= 0) {
            await fetch(`${process.env.REACT_APP_URL}/api/main/end`, { method: 'POST', credentials: 'include' });
            history.push('/notFound');
        }
    }, [expirationTimestamp, history, setTime]);

    const removeRoom = async (id) => {
        fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}`, { method: 'DELETE', credentials: 'include' })
            .then(() => {
                getRooms();
                postNotification({
                    title: 'Sucess',
                    description: 'The room has been succesfully removed.',
                    success: true,
                });
            }).catch(() => {
                postNotification({
                    title: 'Error',
                    description: 'We encountered some problems with removing this room.',
                });
            });
        getRooms();
    };

    const markRoomAsNotReady = async (id) => {
        fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/notReady`, { method: 'PATCH', credentials: 'include' })
            .then(() => {
                getRooms();
                postNotification({
                    title: 'Sucess',
                    description: 'The room has been succesfully marked as not ready.',
                    success: true,
                });
            }).catch(() => {
                postNotification({
                    title: 'Error',
                    description: 'We encountered some problems with marking this room as not ready.',
                });
            });
    };

    const nextPhase = async () => {
        if (phase === 1) {
            await fetch(`${process.env.REACT_APP_URL}/api/main/end`, { method: 'POST', credentials: 'include' });
            history.push('/notFound');
        } else {
            if (rooms.length <= 1 || rooms.some((room) => !room.ready)) {
                return;
            }
            await fetch(`${process.env.REACT_APP_URL}/api/main/aggregate`, { method: 'POST', credentials: 'include' });
            getRooms();
            setPhase(1);
        }
    };

    const filterCards = (name) => {
        setShowedRooms(rooms.filter((room) => room.name.toLowerCase().includes(name.toLowerCase())));
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
        const prepareMainPage = async () => {
            let mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`, {
                credentials: 'include',
            })).json();
            if (mainPage.id !== id) {
                history.push('/notFound')
                return;
            }
            if (!mainPage.locked) {
                await fetch(`${process.env.REACT_APP_URL}/api/main`, { method: 'PATCH', credentials: 'include' });
                mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`, { credentials: 'include' })).json();
            }
            getRooms();
            setAddLink(mainPage.addLink);
            setPhase(mainPage.phase);
            setExpirationTimestamp(mainPage.expirationTimestamp)
        }

        prepareMainPage();
    }, [history, id, getRooms]);

    useEffect(() => {
        const timerInterval = setInterval(refreshTimer, 1000);
        refreshTimer();

        return () => clearTimeout(timerInterval);
    }, [refreshTimer]);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('roomJoined', (_) => {
            getRooms();
        });

        io.on('roomChanged', (data) => {
            Object.assign(rooms.find(room => room.id === data.room.id) || {}, data.room);
            setMaxNotesCount((max) =>
                Math.max(max, (data.room.lists || []).reduce(
                    (acc, list) => acc = acc > list.count ? acc : list.count, 0
                ))
            );
            setRooms(rooms);
            setShowedRooms(rooms);
        });

        return () => io.disconnect();
    }, [rooms, getRooms, maxNotesCount]);

    return (
        <StyledWrapper>
            <TopBar
                buttonContent='Continue'
                buttonDisabled={rooms.length <= 1 || rooms.some((room) => !room.ready)}
                buttonCallback={() => nextPhase()}
                message={time} />
            <DashboardWrapper>
                <MainBarWrapper>
                    <StyledTitle>People joined</StyledTitle>
                    <Search onChange={(e) => {
                        filterCards(e.target.value);
                    }} />
                </MainBarWrapper>
                <CardsWrapper>
                    {showedRooms.map((room, index) =>
                        <PersonCard
                            key={index}
                            maxNotesCount={maxNotesCount}
                            name={room.name}
                            options={room.ready ? ['Remove', 'Mark as not ready'] : ['Remove']}
                            isReady={room.ready}
                            lists={room.lists}
                            optionClickCallback={(index) => {
                                switch (index) {
                                    case 0:
                                        removeRoom(room.id);
                                        break;
                                    case 1:
                                        markRoomAsNotReady(room.id);
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        />
                    )}
                    <PersonCard isAdder={true} clickCallback={() => setJoinModalShowed(true)} />
                </CardsWrapper>
            </DashboardWrapper>
            {joinModalShowed &&
                <Modal onDismissCallback={() => setJoinModalShowed(false)} link={`${window.location.origin}/add/${addLink}`}>
                </Modal>
            }
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
}

export default Main;