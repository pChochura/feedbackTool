import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { StyledLabel, StyledInput } from '../Modal/styles';
import { ButtonWrapper, StyledParagraph } from './styles';
import NotificationSystem from '../NotificationSystem/NotificationSystem';
import { ClientDigestAuth, ALGORITHM_MD5_SESS } from '@mreal/digest-auth';

const LoginModal = ({ input, callback }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [loggedIn, setLoggedIn] = useState(false);
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState();
	const [email, setEmail] = useState('');

	const attemptLogin = async () => {
		if (!email || !password) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'You have to enter your email and password to log in',
			});

			return;
		}

		setLoading(true);

		let response = await fetch(`${process.env.REACT_APP_URL}/api/v1/users`, {
			method: 'POST',
		});

		const incomingDigest = ClientDigestAuth.analyze(
			response.headers.get('WWW-Authenticate')
		);
		const digest = ClientDigestAuth.generateProtectionAuth(
			incomingDigest,
			email,
			password,
			{
				method: 'POST',
				uri: '/api/v1/users',
				counter: 1,
				force_algorithm: ALGORITHM_MD5_SESS,
			}
		);

		response = await fetch(`${process.env.REACT_APP_URL}/api/v1/users`, {
			method: 'POST',
			credentials: 'include',
			headers: { Authorization: digest.raw },
		});
		setLoading(false);

		if (response.status === 401) {
			notificationSystem.postNotification({
				title: 'Error',
				description:
					'Email or password is incorrect or the account does not exist',
			});

			return;
		} else if (response.status === 403) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'You have to confirm your email address first. ',
				action: 'Resend confirmation',
				persistent: true,
				callback: async () => {
					const result = await fetch(
						`${process.env.REACT_APP_URL}/api/v1/users/email`,
						{
							method: 'PATCH',
							headers: { Authorization: digest.raw },
						}
					);

					if (result.status !== 200) {
						notificationSystem.postNotification({
							title: 'Error',
							description:
								'We encountered some problems while resending confirmation email',
						});

						return;
					}

					notificationSystem.postNotification({
						title: 'Success',
						description: 'Confirmation email has been sent successfully',
						success: true,
					});
				},
			});

			return;
		}

		setLoggedIn(true);
	};

	useEffect(() => {
		setEmail(input.email || '');
		setPassword(input.password || '');
	}, [input]);

	return (
		<>
			<Modal
				title="Login into your account"
				description="If you want to access premium session you have to be logged in"
				onDismissCallback={() => callback && callback({})}
				isExiting={loggedIn}
			>
				<StyledLabel>Your email</StyledLabel>
				<StyledInput
					autoFocus
					type="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
				/>
				<StyledLabel>Your password</StyledLabel>
				<StyledInput
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
				/>
				<ButtonWrapper>
					<Button
						onClick={() => attemptLogin()}
						loading={loading}
						disabled={loading}
					>
						Login
					</Button>
				</ButtonWrapper>
				<StyledParagraph>
					Or{' '}
					<b
						onClick={() =>
							callback && callback({ createAccount: true, email, password })
						}
					>
						create an account
					</b>
				</StyledParagraph>
			</Modal>
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</>
	);
};

export default LoginModal;
