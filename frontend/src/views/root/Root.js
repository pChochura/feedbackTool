import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
	StyledWrapper,
	LandingWrapper,
	LandingLeft,
	StyledImg,
	StyledParagraph,
	ButtonWrapper,
	StyledLink,
	FeedbackDescription,
	StyledLabel,
	StyledInput,
	FeedbackSendButtonWrapper,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import landing from '../../assets/images/landing.svg';
import Button from '../../components/Button/Button';
import queryParser from 'query-string';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';
import Modal from '../../components/Modal/Modal';

const Root = ({ history, location }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [feedbackSent, setFeedbackSent] = useState(false);
	const [feedbackModal, setFeedbackModal] = useState();
	const [matching, setMatching] = useState();
	const [, setCookie] = useCookies(['seed']);
	const [feedback, setFeedback] = useState();
	const [email, setEmail] = useState();

	const startSession = async () => {
		if (matching) {
			if (matching.session) {
				history.push(`/${matching.session.id}`);
				return;
			}

			if (matching.room) {
				history.push(`/room/${matching.room.id}`);
				return;
			}
		}

		const seed = `${Math.random()
			.toString(36)
			.slice(2)}${Math.random().toString(36).slice(2)}`.slice(0, 16);
		setCookie('seed', seed, { maxAge: 60 * 60 }, { path: '/' });
		fetch(`${process.env.REACT_APP_URL}/api/v1/sessions`, {
			method: 'POST',
			body: JSON.stringify({
				seed,
			}),
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		})
			.then(async (res) => {
				history.push(`/${(await res.json()).id}`);
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
		if (!matching || !matching.session) {
			notificationSystem.postNotification({
				title: 'Error',
				description:
					'We encountered some problems while canceling the session.',
			});
			return;
		}

		await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions/end`, {
			credentials: 'include',
			method: 'POST',
		});
		setMatching();
		history.push('/?reasonCode=1');
	};

	const sendFeedback = async () => {
		if (!feedback || feedback === '') {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'You have to enter the feedback field.',
			});

			return;
		}

		setFeedbackSent(true);

		notificationSystem.postNotification({
			title: 'Success',
			description: 'Thank your for your feedback!',
			success: true,
		});

		await fetch(`${process.env.REACT_APP_URL}/api/feedback`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				from: email,
				content: feedback,
			}),
			headers: { 'Content-Type': 'application/json' },
		});

		setFeedbackModal({ exit: true });
		setFeedbackSent();
		setEmail();
		setFeedback();
	};

	useEffect(() => {
		const reasonCode = queryParser.parse(location.search).reasonCode;
		if (!notificationSystem || !reasonCode) {
			return;
		}

		switch (reasonCode) {
			case '1':
				notificationSystem.postNotification({
					title: 'Error',
					description:
						'Your session has ended. Now we ask you to tell us how can we ',
					action: 'improve',
					callback: () => setFeedbackModal(true),
				});
				break;
			case '2':
				notificationSystem.postNotification({
					title: 'Warning',
					description: 'Your room has been removed.',
				});
				break;
			case '3':
				notificationSystem.postNotification({
					title: 'Warning',
					description: 'You cannot access this site.',
				});
				break;
			default:
				notificationSystem.postNotification({
					title: 'Error',
					description: "There's been an undefined error.",
				});
				break;
		}

		// Avoid showing the same notification after the page reloads
		window.history.replaceState({}, document.title, '/');
	}, [location, notificationSystem]);

	useEffect(() => {
		const getData = async () => {
			const session = await (
				await fetch(`${process.env.REACT_APP_URL}/api/v1/sessions`, {
					credentials: 'include',
				})
			).json();

			const room = await (
				await fetch(`${process.env.REACT_APP_URL}/api/v1/rooms/find`, {
					credentials: 'include',
				})
			).json();
			if (room.id || session.id) {
				setMatching({
					room: room.id ? { id: room.id } : undefined,
					session: session.id ? { id: session.id } : undefined,
				});
				notificationSystem.postNotification({
					title: 'Success',
					description: 'We found an opened session or room waiting for you!',
					success: true,
				});
			}
		};

		notificationSystem && getData();
	}, [notificationSystem]);

	return (
		<StyledWrapper>
			<TopBar
				buttonContent={matching ? 'Continue' : 'Start'}
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
						<Button onClick={() => startSession()}>
							{matching ? 'Continue' : 'Start'}
						</Button>
						{matching &&
							(matching.session ? (
								<StyledParagraph>
									Or{' '}
									<StyledLink onClick={() => cancelSession()}>
										cancel
									</StyledLink>{' '}
									the session
								</StyledParagraph>
							) : (
								<StyledParagraph>You have a room</StyledParagraph>
							))}
					</ButtonWrapper>
				</LandingLeft>
				<StyledImg src={landing} />
				{feedbackModal && (
					<Modal
						title="How can we improve?"
						description="Please describe things you liked and disliked about FeedbackTool."
						onDismissCallback={() => setFeedbackModal()}
						isExiting={(feedbackModal || {}).exit}
					>
						<FeedbackDescription>
							If you want to hear about improvements you suggested, please give
							us a way to contact you.
						</FeedbackDescription>
						<StyledLabel>
							Your feedback<b>*</b>
						</StyledLabel>
						<StyledInput
							minRows={5}
							maxRows={5}
							autoFocus
							onChange={(e) => setFeedback(e.target.value)}
							value={feedback}
						/>
						<StyledLabel>Your email</StyledLabel>
						<StyledInput
							maxRows={1}
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									if (!e.shiftKey && !e.ctrlKey) {
										sendFeedback();
									}
								}
							}}
						/>
						<FeedbackSendButtonWrapper>
							<Button
								disabled={feedbackSent}
								loading={feedbackSent}
								onClick={() => sendFeedback()}
							>
								Send
							</Button>
						</FeedbackSendButtonWrapper>
					</Modal>
				)}
				<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
			</LandingWrapper>
		</StyledWrapper>
	);
};

export default Root;
