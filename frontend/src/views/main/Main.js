import React, { useState, useEffect, useCallback } from 'react';
import addImg from '../../assets/images/add.svg';
import { useParams } from "react-router-dom";
import './style.css'

const Main = ({ history }) => {
    const [phase, setPhase] = useState(1);
    const [addLink, setAddLink] = useState('');
    const [rooms, setRooms] = useState([]);
    const [time, setTime] = useState('01:00:00');
    const [expirationTimestamp, setExpirationTimestamp] = useState(0);
    const { id } = useParams();

    const getRooms = async () => {
        const rooms = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms`, { credentials: 'include' })).json();
        setRooms(rooms);
    };

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
        await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}`, { method: 'DELETE', credentials: 'include' });
        getRooms();
    };

    const nextPhase = async () => {
        if (phase === 1) {
            await fetch(`${process.env.REACT_APP_URL}/api/main/end`, { method: 'POST', credentials: 'include' });
            history.push('/notFound')
        } else {
            await fetch(`${process.env.REACT_APP_URL}/api/main/agregate`, { method: 'POST', credentials: 'include' });
            getRooms();
        }
    };

    const roomsArr = rooms.map((el, index) => (
        <div className="card" key={index}>
            <div className="title">{el.name}</div>
            {phase === 0 && <a className="more" onClick={() => removeRoom(el.id)}>&times;</a>}
            <ul className="lists">
                {el.lists.map((list, index2) =>
                    <li key={index2}>{list.name} ({list.count} notes)</li>
                )}
            </ul>
            {el.ready && <div className="ready">Ready</div>}
        </div>
    ));

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

    return (
        <>
            <div className="header">
                {rooms.length > 0 && phase === 0 ?
                    <p className="title">My rooms (<a target='_blank' href={`/add/${addLink}`}>Invite link</a>)</p>
                    :
                    <p className="title">My rooms</p>
                }
                <p className="timer">{time}</p>
                <button className="button" onClick={nextPhase} disabled={!(rooms.length > 1 && rooms.every(r => r.ready))}>
                    {phase === 0 ? 'Agregate notes' : 'End session'}
                </button>
            </div>
            {rooms.length > 0 ?
                <div className="cardContainer">
                    {roomsArr}
                </div>
                :
                <div className="emptyHolder">
                    <img src={addImg} alt="Add room" />
                    <span className="title">Send <a target='_blank' href={`/add/${addLink}`}>invite link</a> to your team</span>
                </div>
            }
        </>
    )
}

export default Main