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

const Main = ({ history }) => {
    const [notification, setNotification] = useState();
    const [joinModalShowed, setJoinModalShowed] = useState(false);
    const [phase, setPhase] = useState(1);
    const [addLink, setAddLink] = useState('');
    const [rooms, setRooms] = useState([]);
    const [time, setTime] = useState('01:00:00');
    const [expirationTimestamp, setExpirationTimestamp] = useState(0);
    const [maxNotesCount, setMaxNotesCount] = useState(0);
    const { id } = useParams();

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
    }, [maxNotesCount]);

    const refreshTimer = useCallback(async () => {
        const diff = expirationTimestamp - Date.now() / 1000;
        let hours = Math.floor(diff / (60 * 60));
        let minutes = Math.floor((diff - hours * 60 * 60) / 60);
        let seconds = Math.floor(diff - minutes * 60 - hours * 60 * 60);
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        setTime(`${hours}:${minutes}:${seconds}`);

        if (seconds + minutes + hours <= 0) {
            await fetch(`${process.env.REACT_APP_URL}/api/main/end`, { method: 'POST', credentials: 'include' });
            history.push('/notFound')
        }
    }, [expirationTimestamp, history, setTime]);

    const removeRoom = async (id) => {
        fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}`, { method: 'DELETE', credentials: 'include' })
            .then(() => {
                getRooms();
                setNotification({
                    title: 'Sucess',
                    description: 'The room has been succesfully removed.',
                    success: true,
                });
            }).catch(() => {
                setNotification({
                    title: 'Error',
                    description: 'We encountered some problems with removing this room.',
                });
            });
        getRooms();
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
        console.log(name);
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
    }, [history, id]);

    useEffect(() => {
        const timerInterval = setInterval(refreshTimer, 1000);
        refreshTimer();

        return () => {
            clearTimeout(timerInterval);
        }
    }, [refreshTimer]);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('roomJoined', (_) => {
            getRooms();
        });

        io.on('roomChanged', (data) => {
            Object.assign(rooms.find(room => room.id === data.room.id) || {}, data.room);
            let temp = 0;
            data.room.lists.forEach((list) => {
                temp = temp > list.count ? temp : list.count;
            });
            setMaxNotesCount(maxNotesCount > temp ? maxNotesCount : temp);
            setRooms(rooms);
        });

        return () => io.disconnect();
    }, [rooms, setRooms]);

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
                    {rooms.map((room, index) =>
                        <PersonCard
                            key={index}
                            maxNotesCount={maxNotesCount}
                            name={room.name}
                            options={room.ready ? ['Remove', 'Mark as not ready'] : ['Remove']}
                            isReady={room.ready}
                            lists={room.lists}
                            optionClickCallback={(index) => {
                                if (index === 0) {
                                    removeRoom(room.id);
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
}

export default Main;