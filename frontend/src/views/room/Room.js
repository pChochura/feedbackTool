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
    const [rate, setRate] = useState(1);
    const { id } = useParams();
    const [noteId, setNoteId] = useState(0);
    const [noteText, setNoteText] = useState('');

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

    const submitNote = async (listId, note, rate) => {
        if (!note) return;
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/addNote`, {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({
                listId,
                note,
                rate,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status !== 200) {
            return;
        }
        getRoom();
        setNoteId(0);
        setNoteText('');
        setRate(0);
    };


    useEffect(() => {
        getRoom();
    }, [getRoom]);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('roomJoined', () => {
            getRoom();
        });
    }, [getRoom]);

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
                                            <div className={note.rate ? 'note positive' : 'note negative'} key={index}>
                                                {note.note}
                                            </div>
                                        ))
                                    }
                                    {
                                        !room.ready && (
                                            <div className="note">
                                                <textarea placeholder='Add new note'
                                                    value={noteText}
                                                    onChange={(e) => {
                                                        setNoteId(list.id);
                                                        setNoteText(e.target.value)
                                                    }}
                                                    onKeyPress={(e) => {

                                                        if (!e.shiftKey && e.key === 'Enter') {
                                                            e.preventDefault();
                                                            submitNote(noteId, noteText, rate ? rate : 1);
                                                            e.target.value = '';
                                                        }
                                                    }}>
                                                </textarea>
                                                <div className="buttons">
                                                    <div className="thumbUp" onClick={(e) => {
                                                            setRate(1);
                                                            submitNote(noteId, noteText, rate);

                                                        }}>
                                                        <FontAwesomeIcon icon={rate === 1 ? faThumbsUpFull : faThumbsUpEmpty} />
                                                    </div>
                                                    <div className="thumbDown" onClick={(e) => {
                                                            setRate(-1);
                                                            submitNote(noteId, noteText, rate);

                                                        }}>
                                                        <FontAwesomeIcon icon={rate === -1 ? faThumbsDownFull : faThumbsDownEmpty} />
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