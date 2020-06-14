import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
	StyledOptions,
	StyledOptionItem,
} from '../../components/PersonCard/styles';
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
	StyledOptionsIcon,
	SubmitNoteWrapper,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import sadSelectedIcon from '../../assets/images/sad_selected.svg';
import sadIcon from '../../assets/images/sad_notSelected.svg';
import happySelectedIcon from '../../assets/images/happy_selected.svg';
import happyIcon from '../../assets/images/happy_notSelected.svg';
import closeIcon from '../../assets/images/close.svg';
import optionsIcon from '../../assets/images/options.svg';
import socketIOClient from 'socket.io-client';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import html2canvas from 'html2canvas';
import { table, getBorderCharacters } from 'table';
import { ModalButtonsWrapper } from '../main/styles';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';

const Room = ({ history }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [showingOptions, setShowingOptions] = useState();
	const [exportAsModal, setExportAsModal] = useState();
	const [room, setRoom] = useState({ lists: [] });
	const [lists, setLists] = useState({});
	const { id } = useParams();
	const ownNotesRef = useRef();

	const getRoom = useCallback(async () => {
		const room = await (
			await fetch(`${process.env.REACT_APP_URL}/api/v1/rooms/${id}`, {
				credentials: 'include',
			})
		).json();
		if (!room.id) {
			history.push('/?reasonCode=3');
		}

		setRoom(room);
	}, [history, id]);

	const markRoomAsReady = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/rooms/${id}/ready`,
			{
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({
					ready: true,
				}),
				headers: { 'Content-Type': 'application/json' },
			}
		);
		if (response.status !== 200) {
			notificationSystem.postNotification({
				title: 'Error',
				description:
					'We encountered some problems while marking this room as ready.',
			});
			return;
		}

		setRoom({
			...room,
			ready: true,
		});

		notificationSystem.postNotification({
			title: 'Success',
			description: 'We have successfully marked this room as ready.',
			success: true,
		});
	};

	const submitNote = async (listId, noteId) => {
		const note = lists[listId].note;

		if (!note) {
			return;
		}
		const response = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/rooms/${id}/note`,
			{
				method: 'PATCH',
				credentials: 'include',
				body: JSON.stringify({
					id: noteId,
					listId: listId,
					note,
					positive: !lists[listId].negative,
				}),
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (response.status !== 200) {
			notificationSystem.postNotification({
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
			notificationSystem.postNotification({
				title: 'Error',
				description: 'You have an unsaved note. Please add it before.',
			});
			return;
		}

		const note =
			(room.lists.find((list) => list.id === listId) || {}).notes.find(
				(note) => note.id === noteId
			) || {};

		setLists((lists) => ({
			...lists,
			[listId]: {
				...lists[listId],
				adding: true,
				editedNoteId: noteId,
				negative: !note.positive,
				note: note.content,
			},
		}));
	};

	const removeNote = async (listId, noteId) => {
		const response = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/rooms/${id}/note`,
			{
				method: 'DELETE',
				credentials: 'include',
				body: JSON.stringify({
					id: noteId,
					listId: listId,
				}),
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (response.status !== 200) {
			notificationSystem.postNotification({
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

	const saveAs = (data, name) => {
		const a = document.createElement('a');
		a.href = data;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const exportAs = (mode) => {
		switch (mode) {
			case 1:
				ownNotesRef.current.style.width = 'auto';
				ownNotesRef.current.style.maxWidth = 'unset';
				html2canvas(ownNotesRef.current, {
					backgroundColor: '#EFEFEF',
					width: ownNotesRef.current.offsetWidth,
					onclone: (document) => {
						document.querySelectorAll('textarea').forEach((textarea) => {
							textarea.outerHTML =
								'<div>' + textarea.value.replace(/\n/g, '<br/>') + '<div/>';
						});
					},
				}).then((canvas) => {
					ownNotesRef.current.style.width = 'unset';
					ownNotesRef.current.style.maxWidth = '100%';
					saveAs(
						canvas.toDataURL('image/jpeg', 1.0),
						'Your notes.jpeg',
						'image/jpeg'
					);
				});
				break;
			case 2:
				const notes = room.lists.reduce(
					(notes, list) => {
						const result = list.notes.reduce(
							(acc, note) => {
								if (note.positive) {
									acc.good.push(note.content);
								} else {
									acc.bad.push(note.content);
								}
								return acc;
							},
							{ good: [], bad: [] }
						);
						notes.good.push(...result.good);
						notes.bad.push(...result.bad);
						return notes;
					},
					{ good: [], bad: [] }
				);
				const maxLength = Math.max(notes.good.length, notes.bad.length);
				const data = [['           Positive', '           Negative']];
				for (let i = 0; i < maxLength; i++) {
					data.push([notes.good[i], notes.bad[i]]);
				}
				const result = table(data, {
					border: getBorderCharacters('ramac'),
					columnDefault: {
						width: 30,
					},
				});
				saveAs(
					URL.createObjectURL(
						new Blob([result], { type: 'text/plain;charset=utf-8' })
					),
					'Your notes.txt'
				);
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		getRoom();
	}, [getRoom]);

	useEffect(() => {
		const io = socketIOClient(process.env.REACT_APP_URL, {
			query: {
				sessionId: room.sessionId,
			},
		});

		io.on('roomCreated', () => {
			getRoom();
		});

		io.on('roomRemoved', (room) => {
			console.log(room);
			if (id === room.id) {
				history.push('/?reasonCode=2');
			} else {
				setRoom((_room) => ({
					..._room,
					lists: _room.lists.filter((list) => list.associatedRoomId !== room.id),
				}));
			}
		});

		io.on('roomChanged', (data) => {
			if (id === data.room.id) {
				setRoom((_room) => {
					return {
						..._room,
						ready: data.room.ready,
					};
				});
			}
		});

		io.on('aggregateNotes', () => {
			getRoom();
		});

		io.on('endSession', () => {
			history.push('/?reasonCode=1');
		});

		return () => io.disconnect();
	}, [getRoom, history, id, room]);

	return (
		<StyledWrapper
			onClick={() =>
				showingOptions && setShowingOptions({ ...showingOptions, exit: true })
			}
		>
			<TopBar
				buttonContent={
					room.ownNotes
						? 'Export as'
						: room.lists.length > 0
							? 'Ready'
							: undefined
				}
				buttonDisabled={!room.ownNotes && room.ready}
				buttonCallback={() => {
					if (room.ownNotes) {
						setExportAsModal({});
					} else {
						markRoomAsReady();
					}
				}}
			/>
			<StyledTitle>
				It's your room, <b>{room.name}</b>
			</StyledTitle>
			<StyledListsWrapper ref={ownNotesRef}>
				{room.lists.map((list) => (
					<StyledList key={list.id}>
						<StyledListTitle>{list.name}</StyledListTitle>
						{list.notes.map((note) => (
							<StyledListNote
								key={note.id}
								editing={(lists[list.id] || {}).editedNoteId === note.id}
							>
								<StyledNoteIndicator
									positive={note.positive}
									editing={(lists[list.id] || {}).editedNoteId === note.id}
								/>
								<StyledAddNoteInput readOnly value={note.content} />
								{!room.ready &&
									(lists[list.id] || {}).editedNoteId !== note.id && (
										<StyledOptionsIcon
											src={optionsIcon}
											onClick={(e) => {
												e.stopPropagation();
												setShowingOptions({
													noteId: note.id,
													listId: list.id,
												});
											}}
										/>
									)}
								{showingOptions && showingOptions.noteId === note.id && (
									<StyledOptions
										exit={showingOptions.exit}
										onAnimationEnd={() =>
											showingOptions.exit && setShowingOptions()
										}
									>
										<StyledOptionItem
											onClick={() =>
												editNote(showingOptions.listId, showingOptions.noteId)
											}
										>
											Edit
										</StyledOptionItem>
										<StyledOptionItem
											onClick={() =>
												removeNote(showingOptions.listId, showingOptions.noteId)
											}
										>
											Remove
										</StyledOptionItem>
									</StyledOptions>
								)}
							</StyledListNote>
						))}
						{list.notes.length === 0 && (
							<StyledParagraph centered>
								{room.ready
									? "You didn't write anything here"
									: 'Please describe things that you like and dislike about me.'}
							</StyledParagraph>
						)}
						{!room.ready && (
							<>
								{(lists[list.id] || {}).adding ? (
									<>
										<AddNoteWrapper>
											<StyledAddNoteInput
												placeholder="Your awesome note..."
												value={lists[list.id].note}
												onChange={(e) => setNote(list.id, e.target.value)}
												onKeyPress={(e) => {
													if (
														e.ctrlKey &&
														(e.which === 13 || e.keyCode === 13)
													) {
														submitNote(list.id, lists[list.id].editedNoteId);
													}
												}}
											/>
											<StyledLine />
											<NoteRatingWrapper>
												<StyledParagraph>
													What are the feelings behind it?
												</StyledParagraph>
												<span>
													<StyledImg
														src={
															lists[list.id].negative
																? sadSelectedIcon
																: sadIcon
														}
														onClick={() => setNegative(list.id, true)}
													/>
													<StyledImg
														src={
															lists[list.id].negative
																? happyIcon
																: happySelectedIcon
														}
														onClick={() => setNegative(list.id, false)}
													/>
												</span>
											</NoteRatingWrapper>
											<StyledOptionsIcon
												src={closeIcon}
												onClick={(e) => discardNote(list.id)}
											/>
										</AddNoteWrapper>
										<SubmitNoteWrapper>
											<StyledParagraph>
												Press ctrl + enter to submit
											</StyledParagraph>
											<Button
												small
												onClick={() =>
													submitNote(list.id, lists[list.id].editedNoteId)
												}
											>
												Submit
											</Button>
										</SubmitNoteWrapper>
									</>
								) : (
										<StyledAddNoteButton
											onClick={() =>
												setLists((lists) => ({
													...lists,
													[list.id]: {
														...lists[list.id],
														adding: true,
													},
												}))
											}
										>
											Add note
										</StyledAddNoteButton>
									)}
							</>
						)}
					</StyledList>
				))}
			</StyledListsWrapper>
			{exportAsModal && (
				<Modal
					title="Do you want to export all your notes?"
					description="It is advised to save the notes to not loose your feedback."
					onDismissCallback={() => setExportAsModal()}
					isExiting={(exportAsModal || {}).exit}
				>
					<ModalButtonsWrapper>
						<Button
							onClick={() => {
								setExportAsModal({ exit: true });
								exportAs(1);
							}}
						>
							Export as image
						</Button>
						<Button
							onClick={() => {
								setExportAsModal({ exit: true });
								exportAs(2);
							}}
						>
							Export as text
						</Button>
					</ModalButtonsWrapper>
				</Modal>
			)}
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</StyledWrapper>
	);
};

export default Room;
