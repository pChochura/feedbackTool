import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import {
	StyledWrapper,
	LandingWrapper,
	LandingLeft,
	LandingTop,
	StyledImg,
	StyledParagraph,
	ButtonWrapper,
	StyledLink,
	ScrollIndicator,
	ScrollImg,
	LandingBottom,
	StyledTitle,
	StyledSubtitle,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import landing from '../../assets/images/landing.svg';
import Button from '../../components/Button/Button';
import queryParser from 'query-string';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';
import scrollIcon from '../../assets/images/scroll.svg';
import backgroundImg from '../../assets/images/background.png';
import PlanCard from '../../components/PlanCard/PlanCard';
import Footer from '../../components/Footer/Footer';
import LoginModal from '../../components/LoginModal/LoginModal';
import RegisterModal from '../../components/RegisterModal/RegisterModal';

const Root = ({ history, location }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [registerModal, setRegisterModal] = useState({});
	const [loginModal, setLoginModal] = useState();
	const [matching, setMatching] = useState();
	const [, setCookie] = useCookies(['seed']);
	const [footer, setFooter] = useState();
	const landingBottomRef = useRef();

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

	const scrollBottom = () => {
		window.scrollTo(0, landingBottomRef.current.offsetTop);
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
					callback: () => footer.showFeedbackModal(),
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
	}, [location, notificationSystem, footer]);

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
		<StyledWrapper background={backgroundImg}>
			<TopBar
				buttonContent={'Log in'}
				buttonSecondary={true}
				buttonCallback={() => setLoginModal({})}
			/>
			<LandingWrapper>
				<LandingTop>
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
				</LandingTop>
				<LandingBottom ref={landingBottomRef}>
					<StyledTitle>Pick your plan</StyledTitle>
					<StyledSubtitle>Only pay for what you’re using</StyledSubtitle>
					<span>
						<PlanCard
							title="Basic"
							action="Try for free"
							items={[
								{
									type: 0,
									content: 'Up to <b>5</b> people in a session',
								},
								{
									type: 0,
									content: 'Session duration up to <b>an hour</b>',
								},
								{
									type: -1,
									content: 'Possibility to <b>export</b> notes',
								},
								{
									type: 1,
									content: 'Fully <b>anonymous</b> feedback system',
								},
								{
									type: 1,
									content: 'Does not require you to create an <b>account</b>',
								},
							]}
						></PlanCard>
						<PlanCard
							title="Premium"
							highlighted={true}
							action="Buy now"
							price="Only <b>9.99</b>PLN"
							details="For every 10 sessions"
							items={[
								{
									type: 1,
									content: '<b>Unlimited</b> number of people in a session',
								},
								{
									type: 1,
									content: '<b>Unlimited</b> session duration',
								},
								{
									type: 1,
									content: 'Possibility to <b>export</b> notes',
								},
								{
									type: 1,
									content: 'Fully <b>anonymous</b> feedback system',
								},
							]}
						></PlanCard>
					</span>
				</LandingBottom>
				<Footer ref={(footer) => setFooter(footer)} />
				<ScrollIndicator onClick={() => scrollBottom()}>
					<ScrollImg src={scrollIcon} /> Scroll down
				</ScrollIndicator>
				{loginModal && <LoginModal input={{ email: loginModal.email, password: loginModal.password }} callback={(data) => {
					setLoginModal();
					if (data.createAccount) {
						setRegisterModal({ email: data.email, password: data.password });
					}
				}} />}
				{registerModal && <RegisterModal input={{ email: registerModal.email, password: registerModal.password }} callback={(data) => {
					setRegisterModal();
					if (data.login) {
						setLoginModal({ email: data.email, password: data.password });
					}
				}} />}
				<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
			</LandingWrapper>
		</StyledWrapper>
	);
};

export default Root;
