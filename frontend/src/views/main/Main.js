import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './style.css'
import addImg from '../../assets/images/add.svg'

const Main = () => {

    const [phase, setPhase] = useState(1)
    const [addLink, setAddLink] = useState('')
    const [rooms, setRooms] = useState([])
    const [list, setList] = useState([])
    const [expirationTimestamp, setExpirationTimestamp] = useState(0)

    let history = useHistory()

    const APIfoo = async () => {

        let mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`)).json();
        console.log(mainPage);
        //if (mainPage.id !== req.params.id) {
        if (mainPage.id === 'sdfdgds') {
            history.push('/notFound')
            return;
        }
        if (!mainPage.locked) {
            await fetch(`${process.env.REACT_APP_URL}/api/main`, { method: 'PATCH' });
            mainPage = await (await fetch(`${process.env.REACT_APP_URL}/api/main`)).json();
        }
        const rooms = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms`)).json();
        setRooms(rooms);
        setAddLink(mainPage.addLink);
        setPhase(mainPage.phase);
        setExpirationTimestamp(mainPage.expirationTimestamp)
    }

    console.log(window.location);

    const refreshTimer = async () => {
        const diff = expirationTimestamp - Date.now() / 1000;
        let hours = Math.floor(diff / (60 * 60));
        let minutes = Math.floor((diff - hours * 60 * 60) / 60);
        let seconds = Math.floor(diff - minutes * 60 - hours * 60 * 60);
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        document.querySelector('.timer').textContent = `${hours}:${minutes}:${seconds}`;

        if (seconds + minutes + hours <= 0) {
            await fetch(`${process.env.REACT_APP_URL}/api/main/end`, { method: 'POST' });
            window.location = '/notFound';
        }
    }

    const removeRoom = async (id) => {
        await fetch(`${process.env.REACT_APP_URL}/${id}`, { method: 'DELETE' });
        window.location.reload();
    };

    const nextPhase = async () => {
        if (phase === 1) {
            await fetch(`${process.env.REACT_APP_URL}/api/main/end`, { method: 'POST' });
            //window.location = '/notFound';
        } else {
            await fetch(`${process.env.REACT_APP_URL}/api/main/agregate`, { method: 'POST' });
            window.location.reload();
        }
    };

    const listArr = list.map(el => (
        <li>{el.name} ({el.notes.length} notes)</li>
    ))

    const roomsArr = rooms.map(el => (
        <div className="card">
            <div className="title">{el.name}</div>
            {phase === 0 && <a className="more" onClick={() => removeRoom(el.id)}>&times;</a>}
            <ul className="lists">
                {listArr}
            </ul>
            {el.ready && <div className="ready">Ready</div>}
        </div>
    ))

    useEffect(() => {
        APIfoo()
    }, [])

    setInterval(refreshTimer, 1000);

    return(
        <>
            <div className="header">
                {phase ?
                    <p className="title">My rooms (<a target='_blank' href={`/add/${addLink}`}>Invite link</a>)</p>
                :
                    <p className="title">My rooms</p>
                }
                <p className="timer">01:00:00</p>
                <button className="button" onClick={nextPhase} disabled={!(rooms.length > 1 && rooms.every(r => r.ready))}>
                    {phase === 0 ? 'Agregate notes' : 'End session' }
                </button>
            </div>
            {rooms.lenght > 0 ?
                    <div className="cardContainer">
                        {roomsArr}
                    </div>
                :
                    <div className="emptyHolder">
                        <img src={addImg} alt="Add room"/>
                        <span className="title">Send <a target='_blank' href={`/add/${addLink}`}>invite link</a> to your team</span>
                    </div>
                }
        </>
    )
}

export default Main