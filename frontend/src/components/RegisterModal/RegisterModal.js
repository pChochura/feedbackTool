import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { StyledLabel, StyledInput } from '../Modal/styles';
import {
	ButtonWrapper,
	StyledParagraph,
	RowWrapper,
	ColumnWrapper,
	PlanButton,
	PlanBox,
	PlanAmount,
	PlanDescription,
	PlanPrice,
} from './styles';
import NotificationSystem from '../NotificationSystem/NotificationSystem';
import increaseIcon from '../../assets/images/increase.svg';
import decreaseIcon from '../../assets/images/decrease.svg';
import Stepper from '../Stepper/Stepper';
import { HA1 } from '@mreal/digest-auth';

const RegisterModal = ({ input, callback }) => {
	const [data, setData] = useState({
		email: '',
		password: '',
		repeatPassword: '',
		bundleCount: 1,
	});
	const [notificationSystem, setNotificationSystem] = useState();
	const [currentStep, setCurrentStep] = useState(0);
	const [errorInput, setErrorInput] = useState({});
	const [loading, setLoading] = useState();

	const maxBundleCount = 10;
	const bundleAmount = 10;
	const bundlePrice = 9.99;
	const discount = 0.1;

	const getPrice = (amount) => {
		return (
			amount * bundlePrice -
			getSaved(amount, false)
		).toLocaleString('pl-PL', {
			style: 'currency',
			currency: 'PLN',
			currencyDisplay: 'code',
		});
	};

	const getSaved = (amount, formatted = true) => {
		const saved = amount * (amount - 1) * 0.5 * discount * bundlePrice;
		return formatted
			? saved.toLocaleString('pl-PL', {
					style: 'currency',
					currency: 'PLN',
					currencyDisplay: 'code',
			  })
			: saved;
	};

	const info = {
		description: [
			'Creating an account involves purchasing a premium plan',
			'Choose a way of renewing your premium plan',
			'Review entered data to avoid mistakes',
		],
		primaryButton: [
			{
				content: 'Create account',
				action: async () =>
					(await validateInput()) && (await register()) && nextStep(),
			},
			{
				content: 'Continue',
				action: () => nextStep(),
			},
			{
				content: 'Purchase',
				action: async () => await purchase(),
			},
		],
		secondaryButton: [
			{
				content: 'Or <b>login</b> into your account',
				action: () => {
					callback &&
						callback({
							login: true,
							email: data.email,
							password: data.password,
						});
				},
			},
			{
				content: 'Or <b>contninue with basic plan</b>',
				action: () => callback && callback({}),
			},
			{
				content: 'Or <b>go back</b>',
				action: () => prevStep(),
			},
		],
		steps: ['Registration', 'Customisation', 'Finalisation'],
		content: [
			<>
				<StyledLabel>Your email</StyledLabel>
				<StyledInput
					autoFocus
					type="email"
					name="email"
					error={errorInput.email}
					onFocus={() => setErrorInput((e) => ({ ...e, email: false }))}
					onChange={(e) => handleInput(e)}
					value={data.email}
				/>
				<StyledLabel>Your password</StyledLabel>
				<StyledInput
					type="password"
					name="password"
					error={errorInput.password}
					onFocus={() => setErrorInput((e) => ({ ...e, password: false }))}
					onChange={(e) => handleInput(e)}
					value={data.password}
				/>
				<StyledLabel>Repeat your password</StyledLabel>
				<StyledInput
					type="password"
					name="repeatPassword"
					error={errorInput.repeatPassword}
					onFocus={() =>
						setErrorInput((e) => ({ ...e, repeatPassword: false }))
					}
					onChange={(e) => handleInput(e)}
					value={data.repeatPassword}
				/>
			</>,
			<>
				<ColumnWrapper>
					<PlanButton
						src={decreaseIcon}
						disabled={data.bundleCount > 1}
						onClick={() =>
							setData((d) => ({
								...d,
								bundleCount: Math.max(d.bundleCount - 1, 1),
							}))
						}
					/>
					<PlanBox>
						<PlanAmount>{data.bundleCount * bundleAmount}</PlanAmount>
						<PlanDescription>sessions</PlanDescription>
						<PlanPrice>{getPrice(data.bundleCount)}</PlanPrice>
						<PlanDescription>save {getSaved(data.bundleCount)}</PlanDescription>
					</PlanBox>
					<PlanButton
						src={increaseIcon}
						disabled={data.bundleCount < maxBundleCount}
						onClick={() =>
							setData((d) => ({
								...d,
								bundleCount: Math.min(d.bundleCount + 1, maxBundleCount),
							}))
						}
					/>
				</ColumnWrapper>
				<StyledParagraph>
					For every 10 more sessions purchased you will get an additional{' '}
					<em>10% discount</em>. At once you can only acquire 100 sessions.
				</StyledParagraph>
			</>,
			<RowWrapper>
				<StyledParagraph>
					To fully take advantage of having an account finalize the purchase.
					<br />
					<br />
					You have chosen to purchase{' '}
					<em>{data.bundleCount * bundleAmount} sessions</em> at once for{' '}
					<em>{getPrice(data.bundleCount)}</em>. That way you will save{' '}
					<em>{getSaved(data.bundleCount)}</em>.
					<br />
					<br />
					To continue please confirm your email address by opening a link we
					sent you.
					<br />
					Didn’t get it? <b onClick={() => resendConfirmationEmail()}>Resend</b>
					.
				</StyledParagraph>
			</RowWrapper>,
		],
	};

	const prevStep = () => {
		setCurrentStep((s) => s - 1);
	};

	const nextStep = () => {
		setCurrentStep((s) => s + 1);
	};

	const purchase = async () => {
		setLoading(true);

		const result = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/users/order`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: data.bundleCount,
					token: data.sessionToken,
				}),
			}
		);
		setLoading(false);

		if (result.status === 403) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'You have to confirm your email address first',
			});

			return;
		} else if (result.status !== 200) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'We encoutered some problems while creating your order',
			});

			return;
		}

		const { link } = await result.json();
		window.open(link, '_self');
	};

	const register = async () => {
		setLoading(true);

		const result = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/users/create`,
			{
				method: 'POST',
				body: JSON.stringify({
					email: data.email,
					secret: HA1.generate(data.email, data.password, 'all'),
				}),
				headers: { 'Content-Type': 'application/json' },
			}
		);
		setLoading(false);

		if (result.status !== 201) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'We encountered some problems while creating your account',
			});

			return false;
		}

		const { sessionToken } = await result.json();
		setData((d) => ({ ...d, sessionToken }));

		notificationSystem.postNotification({
			title: 'Success',
			description: 'Your account has been created successfully',
			success: true,
		});

		return true;
	};

	const resendConfirmationEmail = async () => {
		const result = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/users/email`,
			{
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token: data.sessionToken,
				}),
			}
		);
		if (result.status !== 200) {
			notificationSystem.postNotification({
				title: 'Error',
				description:
					'We encountered some problems while resending confirmation email',
			});

			return false;
		}

		notificationSystem.postNotification({
			title: 'Success',
			description: 'Confirmation email has been sent successfully',
			success: true,
		});
	};

	const validateInput = async () => {
		if (!data.email || !data.password || !data.repeatPassword) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'Every field has to be filled in',
			});
			setErrorInput({
				email: !data.email,
				password: !data.password,
				repeatPassword: !data.repeatPassword,
			});

			return false;
		}

		const result = await fetch(
			`${process.env.REACT_APP_URL}/api/v1/users/email`,
			{
				method: 'POST',
				body: JSON.stringify({ email: data.email }),
				headers: { 'Content-Type': 'application/json' },
			}
		);

		if (result.status === 400) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'Email has to be valid',
			});
			setErrorInput({ email: true });

			return false;
		}

		if (result.status !== 200) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'User with the given email already exist',
			});
			setErrorInput({ email: true });

			return;
		}

		if (data.password.length < 4) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'Password is too short',
			});
			setErrorInput({ password: true });

			return false;
		}

		if (data.password !== data.repeatPassword) {
			notificationSystem.postNotification({
				title: 'Error',
				description: 'Passwords do not match',
			});
			setErrorInput({ repeatPassword: true });

			return false;
		}

		return true;
	};

	const handleInput = (event) => {
		setData((data) => ({
			...data,
			[event.target.name]: event.target.value,
		}));
	};

	useEffect(() => {
		setData((d) => ({
			...d,
			email: input.email,
			password: input.password,
		}));
	}, [input]);

	return (
		<>
			<Modal
				title="Create a new account"
				description={info.description[currentStep]}
				onDismissCallback={() => callback && callback({})}
				isExiting={false}
			>
				<Stepper steps={info.steps} currentStep={currentStep} />
				{info.content[currentStep]}
				<ButtonWrapper>
					<Button
						loading={loading}
						disabled={loading}
						onClick={() => info.primaryButton[currentStep].action()}
					>
						{info.primaryButton[currentStep].content}
					</Button>
				</ButtonWrapper>
				<StyledParagraph
					dangerouslySetInnerHTML={{
						__html: info.secondaryButton[currentStep].content,
					}}
					onClick={() => info.secondaryButton[currentStep].action()}
				/>
			</Modal>
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</>
	);
};

export default RegisterModal;
