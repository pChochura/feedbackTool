import React from 'react';
import {
	StyledCard,
	StyledIcon,
	StyledName,
	StyledImg,
	IconWrapper,
	StyledListItem,
	StyledParagraph,
	ListItemFill,
} from './styles';
import personAddIcon from '../../assets/images/personAdd.svg';
import personIcon from '../../assets/images/person.svg';
import optionsIcon from '../../assets/images/options.svg';
import readyIcon from '../../assets/images/ready.svg';

const PersonCard = ({
	clickable,
	adder,
	lists,
	isReady,
	name,
	maxNotesCount,
	clickCallback,
	optionClickCallback,
	children,
}) => {
	return (
		<StyledCard
			clickable={clickable}
			onClick={() => clickCallback && clickCallback()}
		>
			{optionClickCallback && (
				<StyledImg
					src={optionsIcon}
					clickable
					onClick={(e) => {
						optionClickCallback();
						e.stopPropagation();
					}}
				/>
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
			{children}
		</StyledCard>
	);
};

export default PersonCard;
