import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import alone from '../../assets/images/alone.svg';
import socketIOClient from "socket.io-client";
import './style.css';

const Room = ({ history }) => {
    const [room, setRoom] = useState({ lists: [] });
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

    const submitNote = async (listId, note) => {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/addNote`, {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({
                listId,
                note,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status !== 200) {
            return;
        }
        getRoom();
    };

    useEffect(() => {
        getRoom();
    }, [getRoom]);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('roomJoined', () => {
            getRoom();
        });
    }, []);

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
                                            <div className='note' key={index}>
                                                {note}
                                            </div>
                                        ))
                                    }
                                    {
                                        !room.ready && (
                                            <textarea className='note' placeholder='Add new note'
                                                onKeyPress={(e) => {
                                                    if (!e.shiftKey && e.key === 'Enter') {
                                                        e.preventDefault();
                                                        submitNote(list.id, e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}></textarea>
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