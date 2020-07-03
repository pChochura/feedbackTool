import React from 'react';
import {
	StyledCard,
	Header,
	StyledTitle,
	StyledList,
	StyledListItem,
	DetailsWrapper,
	StyledPrice,
	StyledDetails,
} from './styles';
import listNeutralIcon from '../../assets/images/list_neutral.svg';
import listNegativeIcon from '../../assets/images/list_negative.svg';
import listPositiveIcon from '../../assets/images/list_positive.svg';
import Button from '../Button/Button';

const PlanCard = ({
	title,
	highlighted,
	items,
	price,
	details,
	action,
	callback,
}) => {
	const getIconByType = (type) => {
		switch (type) {
			case -1:
				return listNegativeIcon;
			case 1:
				return listPositiveIcon;
			default:
				return listNeutralIcon;
		}
	};

	return (
		<StyledCard highlighted={highlighted}>
			<Header highlighted={highlighted}>
				<StyledTitle highlighted={highlighted}>{title}</StyledTitle>
			</Header>
			<StyledList>
				{items.map((item, index) => (
					<StyledListItem
						key={index}
						img={getIconByType(item.type)}
						dangerouslySetInnerHTML={{ __html: `<span>${item.content}</span>` }}
					></StyledListItem>
				))}
			</StyledList>
			<DetailsWrapper>
				{price && (
					<StyledPrice
						dangerouslySetInnerHTML={{ __html: `<span>${price}</span>` }}
					></StyledPrice>
				)}
				{details && (
					<StyledDetails
						dangerouslySetInnerHTML={{ __html: `<span>${details}</span>` }}
					></StyledDetails>
				)}
				<Button secondary={!highlighted} onClick={() => callback && callback()}>
					{action}
				</Button>
			</DetailsWrapper>
		</StyledCard>
	);
};

export default PlanCard;
