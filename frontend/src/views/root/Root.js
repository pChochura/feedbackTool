import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import socketIOClient from 'socket.io-client';
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
	LandingPage,
	StyledTitle,
	StyledSubtitle,
	Watermark,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import landing from '../../assets/images/landing.svg';
import landing_2 from '../../assets/images/landing_2.svg';
import landing_3 from '../../assets/images/landing_3.svg';
import listPositiveIcon from '../../assets/images/list_positive.svg';
import Button from '../../components/Button/Button';
import queryParser from 'query-string';
import NotificationSystem from '../../components/NotificationSystem/NotificationSystem';
import scrollIcon from '../../assets/images/scroll.svg';
import backgroundImg from '../../assets/images/background.png';
import PlanCard from '../../components/PlanCard/PlanCard';
import Footer from '../../components/Footer/Footer';
import LoginModal from '../../components/LoginModal/LoginModal';
import RegisterModal from '../../components/RegisterModal/RegisterModal';
import { ModalButtonsWrapper } from '../main/styles';
import Modal from '../../components/Modal/Modal';
import {
	ColumnWrapper,
	RowWrapper,
} from '../../components/RegisterModal/styles';
import { StyledListItem } from '../../components/PlanCard/styles';

const Root = ({ history, location }) => {
	const [cookies, setCookie] = useCookies(['seed', 'cookies-agree']);
	const [notificationSystem, setNotificationSystem] = useState();
	const [registerModal, setRegisterModal] = useState();
	const [confirmModal, setConfirmModal] = useState();
	const [loginModal, setLoginModal] = useState();
	const [infoModal, setInfoModal] = useState();
	const [loggedIn, setLoggedIn] = useState();
	const [matching, setMatching] = useState();
	const [loading, setLoading] = useState();
	const [footer, setFooter] = useState();
	const landingPageRef = useRef();

	const startSession = async (forceFree = false) => {
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
		setCookie('seed', seed, { path: '/' });
		fetch(`${process.env.REACT_APP_URL}/api/v1/sessions`, {
			method: 'POST',
			body: JSON.stringify({
				seed,
				forceFree,
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
		window.scrollTo(0, landingPageRef.current.offsetTop);
	};

	const downloadUser = async () => {
		const result = await fetch(`${process.env.REACT_APP_URL}/api/v1/users`, {
			credentials: 'include',
		});

		if (result.status === 200) {
			setLoggedIn(await result.json());
		}
	};

	const tryForFree = () => {
		startSession(true);
	};

	const purchase = async () => {
		setLoading(true);

		const result = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/users/order`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			}
		);
		setLoading(false);

		if (result.status !== 200) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'We encoutered some problems while creating your order',
			});

			return;
		}

		const { link } = await result.json();
		window.open(link, '_self');

		setConfirmModal({ exit: true });
	};

	const buyNow = () => {
		if (loggedIn) {
			setConfirmModal({
				description:
					'Do you want to purchase a bundle consisting of 10 premium sessions?',
				confirmMessage: 'Purchase',
				callback: () => purchase(),
			});

			return;
		}

		setRegisterModal({});
	};

	useEffect(() => {
		if (!notificationSystem || location.pathname !== '/order') {
			return;
		}

		const query = queryParser.parse(location.search);
		// eslint-disable-next-line
		const cancel = query.cancel == 'true';
		const token = decodeURIComponent(query.id);
		if (token) {
			const finalizePurchase = async () => {
				const result = await fetch(
					`${process.env.REACT_APP_URL}/api/v1/users/order`,
					{
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							token,
							cancel,
						}),
					}
				);

				if (result.status !== 200) {
					notificationSystem.postNotification({
						title: 'Error',
						description:
							'We encountered some problems while finalizing your order',
					});

					return;
				}

				notificationSystem.postNotification({
					title: 'Success',
					description: `Your order has been ${
						cancel ? 'canceled' : 'completed'
					} succesfully`,
					success: true,
				});

				downloadUser();
			};
			finalizePurchase();
		}

		window.history.replaceState({}, document.title, '/');
	}, [location, notificationSystem]);

	useEffect(() => {
		if (!notificationSystem || location.pathname !== '/email') {
			return;
		}

		const query = queryParser.parse(location.search);
		const token = decodeURIComponent(query.id);
		if (token) {
			const confirmEmail = async () => {
				const result = await fetch(
					`${process.env.REACT_APP_URL}/api/v1/users/email/confirm`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ token }),
					}
				);

				if (result.status !== 200) {
					notificationSystem.postNotification({
						title: 'Error',
						description:
							'We encountered some problems while confirming your email address',
					});

					return;
				}

				notificationSystem.postNotification({
					title: 'Success',
					description: 'Your email address has been confirmed successfully. ',
					action: 'Get discount',
					success: true,
					persistent: true,
					callback: () => {
						setRegisterModal({
							currentStep: 1,
							sessionToken: token,
						});
					},
				});
			};
			confirmEmail();
		}

		window.history.replaceState({}, document.title, '/');
	}, [location, notificationSystem]);

	useEffect(() => {
		const reasonCode = queryParser.parse(location.search).reasonCode;
		if (!notificationSystem || !reasonCode) {
			return;
		}

		switch (reasonCode) {
			case '1':
				notificationSystem.postNotification({
					title: 'Warning',
					success: true,
					description:
						'Your session has ended. Now we ask you to tell us how can we ',
					action: 'improve',
					persistent: true,
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
		const getSession = async () => {
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
					room: room.id
						? { id: room.id, sessionId: room.sessionId }
						: undefined,
					session: session.id ? { id: session.id } : undefined,
				});
				notificationSystem.postNotification({
					title: 'Success',
					description: 'We found an opened session or room waiting for you!',
					success: true,
				});
			}
		};

		notificationSystem && getSession();
	}, [notificationSystem]);

	useEffect(() => {
		downloadUser();
	}, []);

	useEffect(() => {
		if (!notificationSystem) {
			return;
		}

		if (!cookies['cookies-agree']) {
			notificationSystem.postNotification({
				title: 'Warning',
				description: 'We use cookies to not require you to create an account. ',
				action: 'Read more',
				persistent: true,
				callback: () =>
					setInfoModal({
						title: 'We have to use cookies',
						description: `We store information about who is the owner of the current room so nobody else can access it.
						Data stored there is unique and random so it won't leak your personal info.
						Additionally we have to store information if you are currently logged in which is also uniqe and random.
						By using this site you agree to this terms.`,
						callback: () => setCookie('cookies-agree', true),
					}),
			});
		}
	}, [notificationSystem, cookies, setCookie]);

	useEffect(() => {
		if (!matching || (!matching.session && !matching.room)) {
			return;
		}
		const id = matching.session ? matching.session.id : matching.room.sessionId;

		const io = socketIOClient(process.env.REACT_APP_URL, {
			query: { sessionId: id },
		});

		io.on('endSession', () => {
			window.location.reload();
		});

		return () => io.disconnect();
	}, [matching]);

	return (
		<StyledWrapper background={backgroundImg}>
			<TopBar
				buttonContent={'Log in'}
				buttonSecondary={true}
				buttonCallback={() => setLoginModal({})}
				loggedIn={loggedIn}
			/>
			<LandingWrapper>
				<LandingTop>
					<LandingLeft>
						<b>Exchange feedback</b>
						<StyledParagraph>
							Share your thoughts with your team <strong>anonymously</strong>
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
				<LandingPage ref={landingPageRef}>
					<Watermark left={true}>SHARING</Watermark>
					<StyledTitle>Scared of being honest?</StyledTitle>
					<StyledSubtitle>
						Don’t be afraid of telling your coworkers how you feel about them
						any longer
					</StyledSubtitle>
					<ColumnWrapper>
						<StyledImg src={landing_2} widthScale={true} />
						<RowWrapper style={{ maxWidth: '400px' }}>
							<StyledListItem img={listPositiveIcon} bigger={true}>
								<span>
									Whole process is fully <b>anonymous</b>
								</span>
							</StyledListItem>
							<StyledListItem img={listPositiveIcon} bigger={true}>
								<span>
									Your notes are <b>never stored</b> after the session finishes
								</span>
							</StyledListItem>
							<StyledListItem img={listPositiveIcon} bigger={true}>
								<span>
									Notes written by you <b>are visible only by you</b> and person
									you have written about
								</span>
							</StyledListItem>
						</RowWrapper>
					</ColumnWrapper>
				</LandingPage>
				<LandingPage>
					<Watermark left={false}>IMPROVING</Watermark>
					<StyledTitle>Want to improve?</StyledTitle>
					<StyledSubtitle>
						Exchanging feedback with your team and you can increase your
						productivity and self-esteem.
					</StyledSubtitle>
					<ColumnWrapper style={{ flexWrap: 'wrap-reverse' }}>
						<RowWrapper style={{ maxWidth: '400px' }}>
							<StyledListItem img={listPositiveIcon} bigger={true}>
								<span>
									Let everyone describe your <b>strengths</b> and{' '}
									<b>weaknesses</b>
								</span>
							</StyledListItem>
							<StyledListItem img={listPositiveIcon} bigger={true}>
								<span>
									Introduce a <b>routine of sharing</b> your feelings with
									others
								</span>
							</StyledListItem>
							<StyledListItem img={listPositiveIcon} bigger={true}>
								<span>
									Become a better version of yourself by receiving a{' '}
									<b>meaningful feedback</b>
								</span>
							</StyledListItem>
						</RowWrapper>
						<StyledImg src={landing_3} widthScale={true} />
					</ColumnWrapper>
				</LandingPage>
				<LandingPage>
					<Watermark left={true}>CUSTOMIZING</Watermark>
					<StyledTitle>Pick your plan!</StyledTitle>
					<StyledSubtitle>
						Improve your experience by choosing a premium plan. <br />A small
						price for a huge advantage.
					</StyledSubtitle>
					<span>
						<PlanCard
							title="Basic"
							action="Try for free"
							callback={() => tryForFree()}
							items={[
								{
									type: 0,
									content: 'Up to <b>5</b> people in a session',
								},
								{
									type: 0,
									content: 'Session duration up to a <b>half an hour</b>',
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
							callback={() => buyNow()}
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
				</LandingPage>
				<Footer ref={(footer) => setFooter(footer)} />
				<ScrollIndicator onClick={() => scrollBottom()}>
					<ScrollImg src={scrollIcon} /> Scroll down
				</ScrollIndicator>
				{confirmModal && (
					<Modal
						title="Are you sure?"
						description={confirmModal.description}
						onDismissCallback={() => setConfirmModal()}
						isExiting={confirmModal.exit}
					>
						<ModalButtonsWrapper>
							<Button
								onClick={() => confirmModal.callback()}
								color="#FF5453"
								loading={loading}
								disabled={loading}
							>
								{confirmModal.confirmMessage}
							</Button>
							<Button
								onClick={() => setConfirmModal((m) => ({ ...m, exit: true }))}
								secondary
							>
								Cancel
							</Button>
						</ModalButtonsWrapper>
					</Modal>
				)}
				{infoModal && (
					<Modal
						title={infoModal.title}
						description={infoModal.description}
						onDismissCallback={() =>
							setInfoModal((m) => ({ ...m, exit: true }))
						}
						isExiting={infoModal.exit}
					>
						<ModalButtonsWrapper>
							<Button
								onClick={() => {
									infoModal.callback && infoModal.callback();
									setInfoModal((m) => ({ ...m, exit: true }));
								}}
							>
								OK
							</Button>
						</ModalButtonsWrapper>
					</Modal>
				)}
				{loginModal && (
					<LoginModal
						input={{ email: loginModal.email, password: loginModal.password }}
						callback={(data) => {
							setLoginModal();
							if (data.createAccount) {
								setRegisterModal({
									email: data.email,
									password: data.password,
								});

								return;
							}
							window.location.reload();
						}}
					/>
				)}
				{registerModal && (
					<RegisterModal
						input={{
							email: registerModal.email,
							password: registerModal.password,
							currentStep: registerModal.currentStep,
							sessionToken: registerModal.sessionToken,
						}}
						callback={(data) => {
							setRegisterModal();
							if (data.login) {
								setLoginModal({ email: data.email, password: data.password });

								return;
							}
						}}
					/>
				)}
				<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
			</LandingWrapper>
		</StyledWrapper>
	);
};

export default Root;
