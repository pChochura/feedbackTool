import React, { useState, useCallback } from 'react';
import {
	StyledCard,
	StyledIcon,
	StyledName,
	StyledImg,
	IconWrapper,
	StyledListItem,
	StyledParagraph,
	ListItemFill,
	StyledOptions,
	StyledOptionItem,
} from './styles';
import personAddIcon from '../../assets/images/personAdd.svg';
import personIcon from '../../assets/images/person.svg';
import optionsIcon from '../../assets/images/options.svg';
import readyIcon from '../../assets/images/ready.svg';

const PersonCard = ({
	options,
	clickable,
	adder,
	lists,
	isReady,
	name,
	maxNotesCount,
	clickCallback,
	optionClickCallback,
}) => {
	const [showingOptions, setShowingOptions] = useState();

	const showOptions = useCallback(() => {
		setShowingOptions({});

		const timeout = setTimeout(() => {
			setShowingOptions((options) => {
				if (options) {
					return { exit: true };
				}
			});
		}, 3000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<StyledCard
			clickable={clickable}
			onClick={() => clickCallback && clickCallback()}
		>
			{options && (
				<StyledImg
					src={optionsIcon}
					clickable
					onClick={(e) => {
						showOptions();
						e.stopPropagation();
					}}
				/>
			)}
			{showingOptions && options && (
				<StyledOptions
					exit={showingOptions.exit}
					onAnimationEnd={() => showingOptions.exit && setShowingOptions()}
				>
					{options.map((option, index) => (
						<StyledOptionItem
							key={index}
							onClick={() => {
								setShowingOptions();
								optionClickCallback && optionClickCallback(option.id);
							}}
						>
							{option.name}
						</StyledOptionItem>
					))}
				</StyledOptions>
			)}
			<IconWrapper>
				<StyledIcon
					src={adder ? personAddIcon : personIcon}
					isReady={isReady}
				/>
				{isReady && <StyledImg src={readyIcon} background={'#81B800'} />}
			</IconWrapper>
			<StyledName dimmed={adder}>{adder ? 'Invite somebody' : name}</StyledName>
			{lists &&
				lists.map((list, index) => (
					<StyledListItem key={index}>
						<ListItemFill
							progress={(list.count / maxNotesCount) * 100}
						></ListItemFill>
						<StyledParagraph>{list.name}</StyledParagraph>
						{list.count && (
							<StyledParagraph>
								{list.count}/{maxNotesCount}
							</StyledParagraph>
						)}
					</StyledListItem>
				))}
		</StyledCard>
	);
};

export default PersonCard;
