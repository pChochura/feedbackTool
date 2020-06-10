import React, { useState, useEffect } from 'react';
import moment from 'moment';
import socketIOClient from 'socket.io-client';
import { useCookies } from 'react-cookie';
import {
	StyledWrapper,
	LandingWrapper,
	LandingLeft,
	StyledImg,
	StyledParagraph,
	ButtonWrapper,
	StyledLink,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import landing from '../../assets/images/landing.svg';
import Button from '../../components/Button/Button';
import queryParser from 'query-string';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';

const Root = ({ history, location }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [matching, setMatching] = useState({});
	const [locked, setLocked] = useState(false);
	const [, setCookie] = useCookies(['seed']);
	const [date, setDate] = useState('');

	const startSession = async () => {
		if (matching.session) {
			history.push(`/${matching.session.id}`);
			return;
		}

		if (matching.room) {
			history.push(`/room/${matching.room.id}`);
			return;
		}

		const seed = Math.random().toString(36).slice(2);
		setCookie('seed', seed, { maxAge: 60 * 60 }, { path: '/' });
		fetch(`${process.env.REACT_APP_URL}/api/main`, {
			method: 'POST',
			body: JSON.stringify({
				seed,
			}),
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		})
			.then((res) => {
				return res.json();
			})
			.then((json) => {
				history.push(`/${json.id}`);
			})
			.catch(() => {
				notificationSystem.postNotification({
					title: 'Error',
					description:
						"There's been a problem with getting the main page. Please try later.",
				});
			});
	};

	const cancelSession = async () => {
		if (!matching.session) {
			notificationSystem.postNotification({
				title: 'Error',
				description:
					'We encountered some problems while canceling the session.',
			});
			return;
		}

		await fetch(`${process.env.REACT_APP_URL}/api/main/end`, {
			credentials: 'include',
			method: 'POST',
		});
		setMatching({});
		history.push('/?reasonCode=1');
	};

	useEffect(() => {
		const reasonCode = queryParser.parse(location.search).reasonCode;
		let title, description;
		switch (reasonCode) {
			case '1':
				title = 'Warning';
				description = "Your team's session has ended.";
				break;
			case '2':
				title = 'Warning';
				description = 'Your room has been removed.';
				break;
			case '3':
				title = 'Warning';
				description = 'You cannot access this site.';
				break;
			default:
				title = 'Error';
				description = "There's been an undefined error.";
				break;
		}
		if (reasonCode) {
			notificationSystem.postNotification({
				title,
				description,
			});
		}

		// Avoid showing the same notification after the page reloads
		window.history.replaceState({}, document.title, '/');
	}, [location, notificationSystem]);

	useEffect(() => {
		const getData = async () => {
			const mainPage = await (
				await fetch(`${process.env.REACT_APP_URL}/api/main`, {
					credentials: 'include',
				})
			).json();

			if (mainPage.locked) {
				setLocked(true);
				setDate(moment.unix(mainPage.expirationTimestamp).format('HH:mm:ss'));

				const matchingRoom = await (
					await fetch(`${process.env.REACT_APP_URL}/api/rooms/find`, {
						credentials: 'include',
					})
				).json();
				const matchingSession = await (
					await fetch(`${process.env.REACT_APP_URL}/api/main/find`, {
						credentials: 'include',
					})
				).json();
				if (matchingRoom.id || matchingSession.id) {
					setMatching({
						room: matchingRoom.id ? { id: matchingRoom.id } : undefined,
						session: matchingSession.id
							? { id: matchingSession.id }
							: undefined,
					});
					notificationSystem.postNotification({
						title: 'Success',
						description: 'We found an opened session or room waiting for you!',
						success: true,
					});
				}
			}
		};

		getData();
	}, [notificationSystem]);

	useEffect(() => {
		const io = socketIOClient(process.env.REACT_APP_URL);
		io.on('mainLocked', (data) => {
			setLocked(true);
			setDate(moment.unix(data.until).format('HH:mm:ss'));
		});

		io.on('endSession', () => {
			setLocked(false);
		});

		return () => io.disconnect();
	}, [setLocked, setDate]);

	return (
		<StyledWrapper>
			<TopBar
				buttonContent={
					locked
						? matching.session || matching.room
							? 'Continue'
							: ''
						: 'Start'
				}
				buttonCallback={() => startSession()}
			/>
			<LandingWrapper>
				<LandingLeft>
					<b>Send</b> feedback
					<br />
					<b>Receive</b> feedback
					<StyledParagraph>
						Share your thoughts with your team <b>anonymously</b>
					</StyledParagraph>
					<ButtonWrapper>
						<Button
							onClick={() => startSession()}
							disabled={locked && !matching.session && !matching.room}
						>
							{matching.session || matching.room ? 'Continue' : 'Start'}
						</Button>
						{locked &&
							(matching.session ? (
								<StyledParagraph>
									Or{' '}
									<StyledLink onClick={() => cancelSession()}>
										cancel
									</StyledLink>{' '}
									the session
								</StyledParagraph>
							) : (
									<StyledParagraph>
										{matching.room ? 'You have a room' : `Locked up to ${date}`}
									</StyledParagraph>
								))}
					</ButtonWrapper>
				</LandingLeft>
				<StyledImg src={landing} />
				<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
			</LandingWrapper>
		</StyledWrapper>
	);
};

export default Root;
