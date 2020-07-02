import React, { useState, useEffect } from 'react';
import {
	StyledCard,
	StyledTitle,
	HeaderWrapper,
	StyledSubtitle,
	StyledOption,
	StyledParagraph,
	ButtonWrapper,
} from './styles';
import { StyledImg } from '../PersonCard/styles';
import { useCookies } from 'react-cookie';
import closeIcon from '../../assets/images/close.svg';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { ModalButtonsWrapper } from '../../views/main/styles';
import NotificationSystem from '../NotificationSystem/NotificationSystem';

const ProfileModal = ({ user, forceExit, callback }) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [, , removeCookie] = useCookies(['x-session']);
	const [confirmModal, setConfirmModal] = useState();
	const [loading, setLoading] = useState();
	const [exit, setExit] = useState(false);

	const logout = () => {
		removeCookie('x-session');
		window.location.reload();
	};

	const removeAccount = async () => {
		setLoading(true);

		const result = await fetch(`${process.env.REACT_APP_URL}/api/v1/users`, {
			method: 'DELETE',
			credentials: 'include',
		});

		const success = result.status === 200;
		notificationSystem.postNotification({
			title: success ? 'Success' : 'Error',
			description: success ? 'Your account has been removed successfully' : 'c',
			success: success,
		});
		setLoading(false);

		if (success) {
			logout();
		}
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

	useEffect(() => setExit(forceExit), [forceExit]);

	return (
		<>
			<StyledCard
				exit={exit}
				onAnimationEnd={() => exit && callback && callback()}
			>
				<StyledImg src={closeIcon} clickable onClick={() => setExit(true)} />
				<HeaderWrapper>
					<StyledTitle>Premium plan is activated</StyledTitle>
					<StyledSubtitle>
						Available premium sessions left:{' '}
						<b>{user.premiumSessionsLeft || 0}</b>
					</StyledSubtitle>
				</HeaderWrapper>
				<StyledOption
					onClick={() =>
						setConfirmModal({
							description:
								'Do you want to purchase a bundle consisting of 10 premium sessions?',
							confirmMessage: 'Purchase',
							callback: () => purchase(),
						})
					}
				>
					<StyledParagraph>Purchase premium sessions</StyledParagraph>
					<StyledParagraph>
						<b>9.99PLN</b>
					</StyledParagraph>
				</StyledOption>
				<StyledOption
					onClick={() =>
						setConfirmModal({
							description: 'Do you really want to delete your account?',
							confirmMessage: 'Delete account',
							callback: () => removeAccount(),
						})
					}
				>
					<StyledParagraph negative={true}>Delete account</StyledParagraph>
				</StyledOption>
				<ButtonWrapper>
					<Button
						secondary
						small
						onClick={() =>
							setConfirmModal({
								description: 'Do you really want to log out?',
								confirmMessage: 'Logout',
								callback: () => logout(),
							})
						}
					>
						Log out
					</Button>
				</ButtonWrapper>
			</StyledCard>
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
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</>
	);
};

export default ProfileModal;
