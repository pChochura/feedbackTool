import React, { useState, useEffect, useRef } from 'react';
import {
	StyledNotification,
	StyledTitle,
	StyledDescription,
	StyledImg,
	StyledIcon,
	TitleWrapper,
	StyledAction,
} from './styles';
import warningIcon from '../../assets/images/warning.svg';
import closeIcon from '../../assets/images/close.svg';

const Notification = ({
	title,
	description,
	icon,
	callback,
	persistent,
	duration = 3000,
	index,
	action,
	id,
}) => {
	const [exit, setExit] = useState(false);
	const descriptionRef = useRef();

	useEffect(() => {
		if (persistent) {
			return;
		}

		const timeout = setTimeout(() => setExit(true), duration);

		return () => clearTimeout(timeout);
	}, [duration, persistent]);

	return (
		<StyledNotification
			exit={exit}
			index={index}
			onAnimationEnd={() => exit && callback && callback(id)}
		>
			<TitleWrapper>
				<StyledIcon src={icon || warningIcon} />
				<StyledTitle>{title}</StyledTitle>
				{persistent && (
					<StyledImg
						clickable={true}
						src={closeIcon}
						onClick={() => setExit(true)}
					/>
				)}
			</TitleWrapper>
			<StyledDescription ref={descriptionRef}>
				{description}
				{action && (
					<StyledAction
						onClick={() => {
							setExit(true);
							callback && callback(id, true);
						}}
					>
						{action}
					</StyledAction>
				)}
			</StyledDescription>
		</StyledNotification>
	);
};

export default Notification;
