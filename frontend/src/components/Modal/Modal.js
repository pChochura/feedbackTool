import React, { useState, useEffect } from 'react';
import {
	StyledWrapper,
	StyledCard,
	StyledTitle,
	StyledParagraph,
	StyledBox,
} from './styles';
import { StyledImg } from '../PersonCard/styles';
import closeIcon from '../../assets/images/close.svg';
import copyIcon from '../../assets/images/copy.svg';
import NotificationSystem from '../NotificationSystem/NotificationSystem';

const Modal = ({
	title = 'Invite someone to your team!',
	description = 'Everyone with this link can join',
	children,
	onDismissCallback,
	link,
	isExiting,
}) => {
	const [notificationSystem, setNotificationSystem] = useState();
	const [exit, setExit] = useState(isExiting);

	const copyLink = () => {
		const dummyElement = document.createElement('input');
		dummyElement.value = link;
		document.body.appendChild(dummyElement);
		dummyElement.select();
		const successful = document.execCommand('copy');
		document.body.removeChild(dummyElement);
		if (successful) {
			notificationSystem.postNotification({
				title: 'Success!',
				description: 'The link has been copied to the clipboard.',
				success: true,
			});
		} else {
			notificationSystem.postNotification({
				title: 'Error!',
				description:
					"We couldn't copy the link to the clipboard. Try again later.",
			});
		}
	};

	useEffect(() => {
		setExit(isExiting);
	}, [isExiting]);

	return (
		<StyledWrapper
			exit={exit}
			onAnimationEnd={() => exit && onDismissCallback && onDismissCallback()}
		>
			<StyledCard>
				<StyledImg src={closeIcon} clickable onClick={() => setExit(true)} />
				<StyledTitle>{title}</StyledTitle>
				<StyledParagraph>{description}</StyledParagraph>
				{children ? (
					children
				) : (
						<StyledBox onClick={() => window.open(link, '_blank')}>
							<StyledParagraph>{link}</StyledParagraph>
							<StyledImg
								src={copyIcon}
								clickable
								onClick={(e) => {
									e.nativeEvent.stopImmediatePropagation();
									e.stopPropagation();
									e.preventDefault();
									copyLink();
								}}
							/>
						</StyledBox>
					)}
			</StyledCard>
			<NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
		</StyledWrapper>
	);
};

export default Modal;
