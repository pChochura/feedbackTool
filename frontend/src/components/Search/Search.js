import React from 'react';
import { StyledSearch, StyledImg, StyledWrapper } from './styles';
import searchIcon from '../../assets/images/search.svg';

const Search = ({ onChange }) => {
    return (
        <StyledWrapper>
            <StyledSearch placeholder='Search by name' onChange={(e) => onChange && onChange(e)}/>
            <StyledImg src={searchIcon}/>
        </StyledWrapper>
    )
};

export default Search;