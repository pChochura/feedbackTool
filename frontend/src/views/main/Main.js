import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { StyledWrapper, StyledTitle, DashboardWrapper, MainBarWrapper, CardsWrapper, ModalButtonsWrapper } from './styles';
import TopBar from '../../components/TopBar/TopBar';
import Search from '../../components/Search/Search';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import PersonCard from '../../components/PersonCard/PersonCard';
import Modal from '../../components/Modal/Modal';
import Notification from '../../components/Notification/Notification';
import { useForceUpdate } from '../../components/hooks';
import moment from 'moment';
import Button from '../../components/Button/Button';

const Main = ({ history }) => {
    const [expirationTimestamp, setExpirationTimestamp] = useState(0);
    const [joinModalShowed, setJoinModalShowed] = useState(false);
    const [endSessionModal, setEndSessionModal] = useState();
    const [notifications, setNotifications] = useState([]);
    const [maxNotesCount, setMaxNotesCount] = useState(0);
    const [showedRooms, setShowedRooms] = useState([]);
    const [time, setTime] = useState('01:00:00');
    const [addLink, setAddLink] = useState('');
    const [phase, setPhase] = useState(0);
    const [rooms, setRooms] = useState([]);
    const { id } = useParams();
    const render = useForceUpdate();

    const getRooms = useCallback(async () => {
        const rooms = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms`, { credentials: 'include' })).json();
        setMaxNotesCount(rooms.reduce((max, room) =>
            Math.max(
                max,
                room.lists.reduce((acc, list) =>
                    acc = Math.max(acc, list.count), 0
                )
            ), 0
        ));
        setRooms(rooms);
        setShowedRooms(rooms);
    }, []);

    const refreshTimer = useCallback(async () => {
        if (!expirationTimestamp) {
            return;
        }

        const millis = moment.duration(expirationTimestamp * 1000 - Date.now()).asMilliseconds();
        setTime(moment.utc(millis).format('HH:mm:ss'));
        if (millis <= 0) {
            await fetch(`${process.env.REACT_APP_URL}/api/session/end`, { method: 'POST', credentials: 'include' });
            history.push('/?reasonCode=1');
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
                    description: 'We encountered some problems while removing this room.',
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
                    description: 'We encountered some problems while marking this room as not ready.',
                });
            });
    };

    const nextPhase = async (agreed) => {
        if (phase === 1) {
            if (agreed) {
                await fetch(`${process.env.REACT_APP_URL}/api/session/end`, { method: 'POST', credentials: 'include' });
                history.push('/?reasonCode=1');
            } else {
                setEndSessionModal({});
            }
        } else {
            if (rooms.length <= 1 || rooms.some((room) => !room.ready)) {
                return;
            }
            await fetch(`${process.env.REACT_APP_URL}/api/session/aggregate`, { method: 'POST', credentials: 'include' });
            getRooms();
            setPhase(1);
            postNotification({
                title: 'Success',
                description: 'We have successfully aggregated all the notes.',
                success: true,
            })
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

    const getOptionsForRoom = (room) => {
        const options = [{
            name: 'Remove',
            id: 1,
        }];

        if (room.ready) {
            options.push({
                name: 'Mark as not ready',
                id: 2,
            })
        }

        if (room.own) {
            options.push({
                name: 'Open',
                id: 3,
            });
        }

        return options;
    }

    useEffect(() => {
        const prepareMainPage = async () => {
            let mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/session`, { credentials: 'include' })).json();
            if (mainPage.id !== id) {
                history.push('/?reasonCode=3');
                return;
            }
            if (!mainPage.locked) {
                await fetch(`${process.env.REACT_APP_URL}/api/session`, { method: 'PATCH', credentials: 'include' });
                mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/session`, { credentials: 'include' })).json();
            }
            getRooms();
            setAddLink(mainPage.addLink);
            setPhase(mainPage.phase);
            setExpirationTimestamp(mainPage.expirationTimestamp);
        }

        prepareMainPage();
    }, [history, id, getRooms]);

    useEffect(() => {
        const checkMatchingRoom = async () => {
            const matchingRoom = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms/find`, { credentials: 'include' })).json();
            if (matchingRoom.id) {
                (rooms.find((room) => room.id === matchingRoom.id) || {}).own = true;
            }
        };

        checkMatchingRoom();
    }, [rooms]);

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
                    (acc, list) => acc = Math.max(acc, list.count), 0
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
                buttonContent={phase === 0 ? 'Continue' : 'End session'}
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
                            options={phase === 1 ? null : getOptionsForRoom(room)}
                            isReady={room.ready}
                            lists={phase === 1 ? [] : room.lists}
                            optionClickCallback={(index) => {
                                switch (index) {
                                    case 1:
                                        removeRoom(room.id);
                                        break;
                                    case 2:
                                        markRoomAsNotReady(room.id);
                                        break;
                                    case 3:
                                        window.open(`/room/${room.id}`, '_blank');
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        />
                    )}
                    {phase === 0 &&
                        <PersonCard isAdder={true} clickCallback={() => setJoinModalShowed(true)} />
                    }
                </CardsWrapper>
            </DashboardWrapper>
            {joinModalShowed && <Modal onDismissCallback={() => setJoinModalShowed(false)} link={`${window.location.origin}/add/${addLink}`} />}
            {endSessionModal &&
                <Modal
                    title='Are you sure you want to end this session?'
                    description='This action cannot be undone. All notes will be discarded.'
                    onDismissCallback={() => setEndSessionModal()}
                    isExiting={(endSessionModal || {}).exit}>
                    <ModalButtonsWrapper>
                        <Button secondary onClick={() => setEndSessionModal({ exit: true })}>Take me back</Button>
                        <Button onClick={() => {
                            setEndSessionModal({ exit: true });
                            nextPhase(true);
                        }}>Yes, I'm sure</Button>
                    </ModalButtonsWrapper>
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