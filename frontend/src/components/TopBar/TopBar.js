import React, { useState, useEffect } from 'react';
import {
	StyledWrapper,
	StyledLogo,
	StyledParagraph,
	LogoWrapper,
	LoggedBoxWrapper,
	StyledImg,
	StyledEmail,
} from './styles';
import logo from '../../assets/images/logo.svg';
import personIcon from '../../assets/images/person.svg';
import Button from '../Button/Button';
import ProfileModal from '../ProfileModal/ProfileModal';

const TopBar = ({
	buttonDisabled,
	buttonContent,
	buttonCallback,
	buttonSecondary,
	message,
	loggedIn,
}) => {
	const [username, setUsername] = useState('');
	const [profileModal, setProfileModal] = useState();

	useEffect(() => {
		if (!loggedIn || !loggedIn.email) {
			return;
		}

		const index = loggedIn.email.indexOf('@');
		setUsername(loggedIn.email.substring(0, index));
	}, [loggedIn]);

	return (
		<StyledWrapper onlyLogo={!message && !buttonContent && !loggedIn}>
			<LogoWrapper
				onClick={() => (window.location.href = '/')}
				onlyLogo={!message && !buttonContent && !loggedIn}
			>
				<StyledLogo src={logo} />
				<StyledParagraph>FeedbackTool</StyledParagraph>
			</LogoWrapper>
			{message && <StyledParagraph>{message}</StyledParagraph>}
			{loggedIn ? (
				<LoggedBoxWrapper
					onClick={() => setProfileModal((p) => ({ exit: !!p }))}
				>
					<StyledEmail>{username}</StyledEmail>
					<StyledImg src={personIcon} />
				</LoggedBoxWrapper>
			) : (
				<>
					{buttonContent && (
						<Button
							onClick={buttonCallback}
							disabled={buttonDisabled}
							secondary={buttonSecondary}
						>
							{buttonContent}
						</Button>
					)}
				</>
			)}
			{profileModal && (
				<ProfileModal
					user={loggedIn}
					forceExit={profileModal.exit}
					callback={() => setProfileModal()}
				/>
			)}
		</StyledWrapper>
	);
};

export default TopBar;
