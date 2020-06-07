import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { StyledOptions, StyledOptionItem } from '../../components/PersonCard/styles';
import {
    StyledWrapper,
    StyledTitle,
    StyledListsWrapper,
    StyledList,
    StyledListTitle,
    StyledListNote,
    StyledNoteIndicator,
    StyledAddNoteButton,
    StyledAddNoteInput,
    AddNoteWrapper,
    StyledLine,
    NoteRatingWrapper,
    StyledParagraph,
    StyledImg,
    StyledOptionsIcon
} from './styles';
import Notification from '../../components/Notification/Notification';
import TopBar from '../../components/TopBar/TopBar';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import sadSelectedIcon from '../../assets/images/sad_selected.svg';
import sadIcon from '../../assets/images/sad_notSelected.svg';
import happySelectedIcon from '../../assets/images/happy_selected.svg';
import happyIcon from '../../assets/images/happy_notSelected.svg';
import closeIcon from '../../assets/images/close.svg';
import optionsIcon from '../../assets/images/options.svg';
import { useForceUpdate } from '../../components/hooks';
import socketIOClient from 'socket.io-client';


const Room = ({ history }) => {
    const [notifications, setNotifications] = useState([]);
    const [room, setRoom] = useState({ lists: [] });
    const [showingOptions, setShowingOptions] = useState();
    const [lists, setLists] = useState({});
    const { id } = useParams();
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

    const getRoom = useCallback(async () => {
        const room = await (await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}`, { credentials: 'include' })).json();
        if (!room.id) {
            history.push('/?reasonCode=3');
        }

        setRoom(room);
    }, [history, id]);

    const markRoomAsReady = async () => {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/ready`, { method: 'PATCH', credentials: 'include' });
        if (response.status !== 200) {
            postNotification({
                title: 'Error',
                description: 'We encountered some problems while marking this room as ready.',
            });
            return;
        }

        setRoom({
            ...room,
            ready: true,
        });

        postNotification({
            title: 'Success',
            description: 'We have successfully marked this room as ready.',
            success: true,
        });
    };

    const submitNote = async (listId, noteId) => {
        const note = lists[listId].note;
        const rate = lists[listId].negative ? -1 : 1;

        if (!note) {
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/submitNote`, {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({
                id: noteId,
                listId: listId,
                note,
                rate,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status !== 200) {
            postNotification({
                title: 'Error',
                description: 'We encountered some problems while adding a note.',
            });
            return;
        }
        getRoom();
        setLists((lists) => ({
            ...lists,
            [listId]: {
                ...lists[listId],
                note: '',
                adding: false,
                editedNoteId: undefined,
            },
        }));
    };

    const editNote = (listId, noteId) => {
        if (lists[listId] && lists[listId].adding && lists[listId].note !== '') {
            postNotification({
                title: 'Error',
                description: 'You have an unsaved note. Please add it before.',
            });
            return;
        }

        const note = (room.lists.find((list) => list.id === listId) || {})
            .notes.find((note) => note.id === noteId) || {};

        setLists((lists) => ({
            ...lists,
            [listId]: {
                ...lists[listId],
                adding: true,
                editedNoteId: noteId,
                negative: note.rate === -1,
                note: note.note,
            },
        }));
    };

    const removeNote = async (listId, noteId) => {
        const response = await fetch(`${process.env.REACT_APP_URL}/api/rooms/${id}/removeNote`, {
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({
                id: noteId,
                listId: listId,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status !== 200) {
            postNotification({
                title: 'Error',
                description: 'We encountered some problems while removing a note.',
            });
            return;
        }
        getRoom();
    };

    const discardNote = (listId) => {
        if (lists[listId]) {
            setLists((lists) => ({
                ...lists,
                [listId]: {
                    ...lists[listId],
                    adding: false,
                    note: '',
                    editedNoteId: undefined,
                },
            }));
        }
    };

    const setNote = (id, note) => {
        setLists((lists) => ({
            ...lists,
            [id]: {
                ...lists[id],
                note,
            },
        }));
    };

    const setNegative = (id, negative) => {
        setLists((lists) => ({
            ...lists,
            [id]: {
                ...lists[id],
                negative,
            },
        }));
    };

    useEffect(() => { getRoom(); }, [getRoom]);

    useEffect(() => {
        const io = socketIOClient(process.env.REACT_APP_URL);
        io.on('roomJoined', () => {
            getRoom();
        });

        io.on('roomRemoved', (room) => {
            if (id === room.id) {
                history.push('/?reasonCode=2');
            } else {
                setRoom((_room) => ({
                    ..._room,
                    lists: _room.lists.filter((list) => list.id !== room.id),
                }));
            }
        });

        io.on('roomChanged', (data) => {
            if (id === data.room.id) {
                setRoom((_room) => {
                    return {
                        ..._room,
                        ready: data.room.ready,
                    }
                });
                render();
            }
        });

        io.on('aggregateNotes', () => {
            window.location.reload();
        });

        io.on('endSession', () => {
            history.push('/?reasonCode=1');
        });

        return () => io.disconnect();
    }, [getRoom, history, id, render]);

    return (
        <StyledWrapper onClick={() => showingOptions && setShowingOptions({ ...showingOptions, exit: true })}>
            <TopBar buttonContent='Ready' buttonDisabled={room.ready} buttonCallback={() => markRoomAsReady()} />
            <StyledTitle>It's your room, <b>{room.name}</b></StyledTitle>
            <StyledListsWrapper>
                {room.lists.map((list) =>
                    <StyledList key={list.id}>
                        <StyledListTitle>{list.name}</StyledListTitle>
                        {list.notes.map((note) =>
                            <StyledListNote key={note.id}>
                                <StyledNoteIndicator positive={note.rate === 1} />
                                {note.note.replace('\n', '<br/>')}
                                {!room.ready && (lists[list.id] || {}).editedNoteId !== note.id &&
                                    <StyledOptionsIcon src={optionsIcon} onClick={(e) => {
                                        e.stopPropagation();
                                        setShowingOptions({
                                            x: document.body.clientWidth - e.target.x - e.target.width,
                                            y: e.target.y + e.target.height * 0.5 + window.pageYOffset,
                                            noteId: note.id,
                                            listId: list.id,
                                        });
                                    }} />
                                }
                            </StyledListNote>
                        )}
                        {!room.ready &&
                            <>
                                {(lists[list.id] || {}).adding ?
                                    <AddNoteWrapper>
                                        <StyledAddNoteInput
                                            placeholder='Your awesome note...'
                                            value={lists[list.id].note}
                                            onChange={(e) => setNote(list.id, e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.ctrlKey && e.key === 'Enter') {
                                                    submitNote(list.id, lists[list.id].editedNoteId);
                                                }
                                            }} />
                                        <StyledLine />
                                        <NoteRatingWrapper>
                                            <StyledParagraph>What are the feelings behind it?</StyledParagraph>
                                            <span>
                                                <StyledImg src={lists[list.id].negative ? sadSelectedIcon : sadIcon} onClick={() => setNegative(list.id, true)} />
                                                <StyledImg src={lists[list.id].negative ? happyIcon : happySelectedIcon} onClick={() => setNegative(list.id, false)} />
                                            </span>
                                        </NoteRatingWrapper>
                                        <StyledOptionsIcon src={closeIcon} onClick={(e) => discardNote(list.id)} />
                                    </AddNoteWrapper>
                                    :
                                    <StyledAddNoteButton
                                        onClick={() => setLists((lists) => ({
                                            ...lists,
                                            [list.id]: {
                                                ...lists[list.id],
                                                adding: true,
                                            },
                                        }))}>
                                        Add note
                                    </StyledAddNoteButton>
                                }
                            </>
                        }
                    </StyledList>
                )}
            </StyledListsWrapper>
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
            {showingOptions &&
                <StyledOptions
                    pos={{ x: showingOptions.x, y: showingOptions.y }}
                    exit={showingOptions.exit}
                    onAnimationEnd={() => showingOptions.exit && setShowingOptions()}>
                    <StyledOptionItem onClick={() => editNote(showingOptions.listId, showingOptions.noteId)}>Edit</StyledOptionItem>
                    <StyledOptionItem onClick={() => removeNote(showingOptions.listId, showingOptions.noteId)}>Remove</StyledOptionItem>
                </StyledOptions>
            }
        </StyledWrapper>
    );
};

export default Room;