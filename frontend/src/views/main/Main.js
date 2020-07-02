import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import {
	StyledWrapper,
	StyledTitle,
	DashboardWrapper,
	MainBarWrapper,
	CardsWrapper,
	ModalButtonsWrapper,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import Search from '../../components/Search/Search';
import PersonCard from '../../components/PersonCard/PersonCard';
import Modal from '../../components/Modal/Modal';
import moment from 'moment';
import Button from '../../components/Button/Button';
import Footer from '../../components/Footer/Footer';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';

const Main = ({ history }) => {
	const [expirationTimestamp, setExpirationTimestamp] = useState(0);
	const [notificationSystem, setNotificationSystem] = useState();
	const [endSessionModal, setEndSessionModal] = useState();
	const [extendPlanModal, setExtendPlanModal] = useState();
	const [maxNotesCount, setMaxNotesCount] = useState(0);
	const [showedRooms, setShowedRooms] = useState([]);
	const [joinModal, setJoinModal] = useState(false);
	const [time, setTime] = useState('01:00:00');
	const [addLink, setAddLink] = useState('');
	const [phase, setPhase] = useState(0);
	const [rooms, setRooms] = useState([]);
	const { id } = useParams();

	const getRooms = useCallback(async () => {
		const rooms = await (
			await fetch(`${process.env.REACT_APP_URL}/api/v1/rooms`, {
				credentials: 'include',
			})
		).json();
		setMaxNotesCount(
			rooms.reduce(
				(max, room) =>
					Math.max(
						max,
						room.lists.reduce(
							(acc, list) => (acc = Math.max(acc, list.count)),
							0
						)
					),
				0
			)
		);
		setRooms(rooms);
		setShowedRooms(rooms);
	}, []);

	const refreshTimer = useCallback(async () => {
		if (!expirationTimestamp) {
			return;
		}

		const millis = moment
			.duration(expirationTimestamp * 1000 - Date.now())
			.asMilliseconds();
		setTime(moment.utc(millis).format('HH:mm:ss'));
		if (millis <= 0) {
			await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions/end`, {
				method: 'POST',
				credentials: 'include',
			});
		}
	}, [expirationTimestamp, setTime]);

	const removeRoom = async (id) => {
		fetch(`${process.env.REACT_APP_URL}/api/v1/rooms/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		})
			.then(() => {
				getRooms();
				notificationSystem.postNotification({
					title: 'Sucess',
					description: 'The room has been succesfully removed.',
					success: true,
				});
			})
			.catch(() => {
				notificationSystem.postNotification({
					title: 'Error',
					description: 'We encountered some problems while removing this room.',
				});
			});
		getRooms();
	};

	const markRoomAsNotReady = async (id) => {
		fetch(`${process.env.REACT_APP_URL}/api/v1/rooms/${id}/ready`, {
			method: 'PATCH',
			credentials: 'include',
			body: JSON.stringify({
				ready: false,
			}),
			headers: { 'Content-Type': 'application/json' },
		})
			.then(() => {
				getRooms();
				notificationSystem.postNotification({
					title: 'Sucess',
					description: 'The room has been successfully marked as not ready.',
					success: true,
				});
			})
			.catch(() => {
				notificationSystem.postNotification({
					title: 'Error',
					description:
						'We encountered some problems while marking this room as not ready.',
				});
			});
	};

	const nextPhase = async (agreed) => {
		if (phase === 1) {
			if (agreed) {
				await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions/end`, {
					method: 'POST',
					credentials: 'include',
				});
			} else {
				setEndSessionModal({});
			}
		} else {
			if (rooms.length <= 1 || rooms.some((room) => !room.ready)) {
				return;
			}
			await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions/aggregate`, {
				method: 'PATCH',
				credentials: 'include',
			});
			getRooms();
			setPhase(1);
			notificationSystem.postNotification({
				title: 'Success',
				description: 'We have successfully aggregated all the notes.',
				success: true,
			});
		}
	};

	const filterCards = (name) => {
		setShowedRooms(
			rooms.filter((room) =>
				room.name.toLowerCase().includes(name.toLowerCase())
			)
		);
	};

	const getOptionsForRoom = (room) => {
		const options = [
			{
				name: 'Remove',
				id: 1,
			},
		];

		if (room.ready) {
			options.push({
				name: 'Mark as not ready',
				id: 2,
			});
		}

		if (room.own) {
			options.push({
				name: 'Open',
				id: 3,
			});
		}

		return options;
	};

	const onRoomCreated = useCallback((_) => {
		getRooms();
	}, [getRooms]);

	const onRoomChanged = useCallback((data) => {
		const tempRooms = rooms.map((room) =>
			room.id === data.room.id ? data.room : room
		);
		setMaxNotesCount((max) =>
			Math.max(
				max,
				(data.room.lists || []).reduce(
					(acc, list) => (acc = Math.max(acc, list.count)),
					0
				)
			)
		);
		setRooms(tempRooms);
		setShowedRooms(tempRooms);
	}, [rooms]);

	const onRoomLimit = useCallback((data) => {
		notificationSystem.postNotification({
			title: 'Warning',
			description: `You have a request from ${data.room.name} to join your session. `,
			success: true,
			persistent: true,
			action: 'Extend your plan',
			callback: () => {
				setExtendPlanModal({ name: data.room.name });
			},
		});
	}, [notificationSystem]);

	const onEndSession = useCallback(() => {
		history.push('/?reasonCode=1');
	}, [history]);

	useEffect(() => {
		const prepareMainPage = async () => {
			let mainPage = await (
				await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions`, {
					credentials: 'include',
				})
			).json();
			if (mainPage.id !== id) {
				history.push('/?reasonCode=3');
				return;
			}

			getRooms();
			setAddLink(mainPage.addLink);
			setPhase(mainPage.phase);
			setExpirationTimestamp(mainPage.expirationTimestamp);
		};

		prepareMainPage();
	}, [history, id, getRooms]);

	useEffect(() => {
		const timerInterval = setInterval(refreshTimer, 1000);
		refreshTimer();

		return () => clearTimeout(timerInterval);
	}, [refreshTimer]);

	useEffect(() => {
		const io = socketIOClient(process.env.REACT_APP_URL, {
			query: {
				sessionId: id,
			},
		});

		io.on('roomCreated', onRoomCreated);
		io.on('roomChanged', onRoomChanged);
		io.on('roomLimit', onRoomLimit);
		io.on('endSession', onEndSession);

		return () => io.disconnect();
	}, [id, onRoomCreated, onRoomChanged, onRoomLimit, onEndSession]);

	return (
		<StyledWrapper>
			<TopBar
				buttonContent={phase === 0 ? 'Continue' : 'End session'}
				buttonDisabled={rooms.length <= 1 || rooms.some((room) => !room.ready)}
				buttonCallback={() => nextPhase()}
				message={expirationTimestamp !== null ? time : ''}
			/>
			<DashboardWrapper>
				<MainBarWrapper>
					<StyledTitle>People joined</StyledTitle>
					<Search
						onChange={(e) => {
							filterCards(e.target.value);
						}}
					/>
				</MainBarWrapper>
				<CardsWrapper>
					{showedRooms.map((room, index) => (
						<PersonCard
							key={index}
							clickable={room.own}
							maxNotesCount={maxNotesCount}
							name={room.name}
							options={phase === 1 ? null : getOptionsForRoom(room)}
							isReady={room.ready}
							lists={phase === 1 ? [] : room.lists}
							clickCallback={() => room.own && window.open(`/room/${room.id}`, '_blank')}
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
					))}
					{phase === 0 && (
						<PersonCard
							clickable={true}
							adder={true}
							clickCallback={() => setJoinModal(true)}
						/>
					)}
				</CardsWrapper>
			</DashboardWrapper>
			<Footer />
			{joinModal && (
				<Modal
					onDismissCallback={() => setJoinModal(false)}
					link={`${window.location.origin}/add/${addLink}`}
				/>
			)}
			{extendPlanModal && (
				<Modal
					title={`New request from ${extendPlanModal.name}`}
					description='Your basic plan has reached a limit. To accept this request you have to extend your plan.'
					onDismissCallback={() => setExtendPlanModal()}
					isExiting={extendPlanModal.exit}
				/>
			)}
			{endSessionModal && (
				<Modal
					title='Are you sure you want to end this session?'
					description='This action cannot be undone. All notes will be discarded.'
					onDismissCallback={() => setEndSessionModal()}
					isExiting={endSessionModal.exit} >
					<ModalButtonsWrapper>
						<Button
							secondary
							onClick={() => setEndSessionModal({ exit: true })}
						>
							Take me back
						</Button>
						<Button
							onClick={() => {
								setEndSessionModal({ exit: true });
								nextPhase(true);
							}}
						>
							Yes, I'm sure
						</Button>
					</ModalButtonsWrapper>
				</Modal>
			)}
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</StyledWrapper>
	);
};

export default Main;
