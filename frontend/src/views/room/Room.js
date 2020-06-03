import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import alone from '../../assets/images/alone.svg';
import socketIOClient from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp as faThumbsUpEmpty, faThumbsDown as faThumbsDownEmpty } from '@fortawesome/free-regular-svg-icons'
import { faThumbsUp as faThumbsUpFull, faThumbsDown as faThumbsDownFull } from '@fortawesome/free-solid-svg-icons'
import './style.css';

const Room = ({ history }) => {
    const [room, setRoom] = useState({ lists: [] });
    const [rate, setRate] = useState({});
    const { id } = useParams();

    const getRoom = useCallback(async () => {
        const room = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}`, { credentials: 'include' })).json();
        if (!room.id) {
            history.push('/notFound');
        }

        setRoom(room);
    }, [history, id]);

    const markRoomAsReady = async () => {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/ready`, { method: 'PATCH', credentials: 'include' });
        if (response.status !== 200) {
            return;
        }

        setRoom({
            ...room,
            ready: true,
        });
    };

    const submitNote = async (listId, note, _rate) => {
        if (!note) return;
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/addNote`, {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({
                listId,
                note,
                rate: _rate,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status !== 200) {
            return;
        }
        getRoom();
        const temp = {};
        room.lists.forEach((list) => {
            temp[list.id] = rate[list.id] === -1 ? -1 : 1;
        });
        setRate(temp);
    };

    useEffect(() => {
        const temp = {};
        room.lists.forEach((list) => {
            temp[list.id] = rate[list.id] === -1 ? -1 : 1;
        });
        setRate(temp);
    }, [room]);

    useEffect(() => {
        getRoom();
    }, [getRoom]);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('roomJoined', () => {
            getRoom();
        });

        io.on('roomRemoved', (room) => {
            if (id === room.id) {
                history.push('/notFound');
            }
        });

        io.on('aggregateNotes', () => {
            window.location.reload();
        });

        io.on('endSession', () => {
            history.push('/notFound');
        });
    }, [getRoom, history, id]);

    return (
        <div className="wrapper">
            <div className="header">
                <p className="title">{room.name}</p>
                <button className="button" id="markReady" disabled={room.ready} onClick={() => markRoomAsReady()}>Ready</button>
            </div>

            {
                room.lists.length <= 0 ?
                    <div className="emptyHolder">
                        <img src={alone} alt="Alone" />
                        <span className="title">You're here alone. Wait for others to join</span>
                    </div>
                    :
                    <div className="listsContainer" id="listsContainer">
                        {room.lists.map((list) => (
                            <div className='list' key={list.id}>
                                <h3 className='list__title'>{list.name}</h3>
                                <div className='notesContainer'>
                                    {
                                        list.notes.map((note, index) => (
                                            <div className={`${note.rate === 1 ? 'positive' : 'negative'} animNote note`} key={index}>
                                                {note.note}
                                            </div>
                                        ))
                                    }
                                    {
                                        !room.ready && (
                                            <div className="note addNote">
                                                <textarea placeholder='Add new note'
                                                    onKeyPress={(e) => {
                                                        if (!e.shiftKey && e.key === 'Enter') {
                                                            e.preventDefault();
                                                            submitNote(list.id, e.target.value, rate[list.id]);
                                                            e.target.value = '';
                                                        }
                                                    }}>
                                                </textarea>
                                                <div className="buttons">
                                                    <div className="thumbUp" onClick={(_) => {
                                                            setRate({
                                                                ...rate,
                                                                [list.id]: 1,
                                                            });
                                                        }}>
                                                        <FontAwesomeIcon icon={rate[list.id] === 1 ? faThumbsUpFull : faThumbsUpEmpty} />
                                                    </div>
                                                    <div className="thumbDown" onClick={(_) => {
                                                            setRate({
                                                                ...rate,
                                                                [list.id]: -1,
                                                            });
                                                        }}>
                                                        <FontAwesomeIcon icon={rate[list.id] === -1 ? faThumbsDownFull : faThumbsDownEmpty} />
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </div>
    );
};

export default Room;