import React, { useState, useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import TopBar from '../../components/TopBar/TopBar';
import {
	StyledWrapper,
	StyledTitle,
	StyledParagraph,
	StyledBox,
	StyledInput,
	StyledLabel,
	ButtonWrapper,
} from './styles';
import Button from '../../components/Button/Button';
import { useParams } from 'react-router-dom';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';

const Add = ({ history }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [seed] = useState(
		`${Math.random().toString(36).slice(2)}${Math.random()
			.toString(36)
			.slice(2)}`.slice(0, 16)
	);
	const [cookies, setCookie] = useCookies(['seed']);
	const [name, setName] = useState('');
	const { id } = useParams();

	const join = useCallback(async () => {
		fetch(`${process.env.REACT_APP_URL}/api/v1/rooms`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				seed: cookies.seed || seed,
				name,
				addLink: id,
			}),
			headers: { 'Content-Type': 'application/json' },
		})
			.then(async (data) => {
				if (data.status !== 201) {
					notificationSystem.postNotification({
						title: 'Error',
						description: (await data.json()).message,
					});
					return;
				}

				const room = await data.json();
				setCookie('seed', cookies.seed || seed, { path: '/' });
				history.push(`/room/${room.id}`);
			})
			.catch(() => {
				notificationSystem.postNotification({
					title: 'Error',
					description:
						'We encountered some problems while joining you with your team.',
				});
			});
	}, [history, seed, cookies, setCookie, name, notificationSystem, id]);

	useEffect(() => {
		const checkAddPage = async () => {
			const isAddPage = await (
				await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions/checkAdd`, {
					method: 'POST',
					credentials: 'include',
					body: JSON.stringify({ addLink: id }),
					headers: { 'Content-Type': 'application/json' },
				})
			).json();

			if (!(isAddPage || {}).status) {
				history.push('/?reasonCode=3');
			}
		};

		checkAddPage();
	}, [history, id]);

	return (
		<StyledWrapper>
			<TopBar />
			<StyledTitle>You were invited!</StyledTitle>
			<StyledParagraph>
				Help your team by giving them a meanigful feedback.
				<br />
				Even if it’s anonymous your friends may still
				<br />
				recognise that it might be written by you!
			</StyledParagraph>
			<StyledBox>
				<StyledParagraph>
					To help identify you by your friends,
					<br />
					please enter a name
				</StyledParagraph>
				<StyledLabel>Your name</StyledLabel>
				<StyledInput
					autoFocus
					onChange={(e) => setName(e.target.value)}
					value={name}
					onKeyPress={(e) => e.key === 'Enter' && join()}
				/>
				<ButtonWrapper>
					<Button onClick={() => join()}>Join</Button>
				</ButtonWrapper>
			</StyledBox>
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</StyledWrapper>
	);
};

export default Add;
