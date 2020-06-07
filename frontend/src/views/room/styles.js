import styled from 'styled-components';

export const StyledWrapper = styled.div`
    width: 100%;
    height: 100%;
    dispaly: flex;
    justify-content: center;
    align-content: center;
    padding-bottom: 100px;
`;

export const StyledTitle = styled.h1`
    font-size: 2rem;
    font-weight: 300;
    margin-block-start: 0;
    margin-block-end: 0;
    margin: 100px auto 50px auto;
    width: 100%;
    text-align: center;
`;

export const StyledListsWrapper = styled.div`
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
`;

export const StyledList = styled.div`
    width: 300px;
    margin: 10px 32px;
    display: flex;
    flex-direction: column;

    &:first-child {
        margin-left: 100px;
    }

    &:last-child {
        margin-right: 100px;
    }
`;

export const StyledListTitle = styled.p`
    box-sizing: border-box;
    margin-block-start: 0;
    margin-block-end: 0;
    font-weight: 400;
    font-size 1.2rem;
    width: 100%;
    text-align: center;
    padding: 10px;
`;

export const StyledListNote = styled.div`
    width: 100%;
    min-height: 50px;
    font-size: 0.75rem;
    font-weight: 300;
    background-color: #ffffff;
    margin: 10px 0;
    padding: 10px 30px 10px 20px;
    box-sizing: border-box;
    position: relative;
    border-radius: 5px;
    overflow-x: hidden;
    word-break: break-all;
`;

export const StyledNoteIndicator = styled.div`
    height: 100%;
    width: 5px;
    background-color: ${({ positive }) => positive ? '#81B800' : '#FF5453'};
    position: absolute;
    left: 0px;
    top: 0px;
`;

export const StyledAddNoteButton = styled.p`
    box-sizing: border-box;
    font-size: 1.2rem;
    color: #3750DB;
    font-weight: 300;
    margin-block-start: 0;
    margin-block-end: 0;
    margin: 15px 0px;
    padding: 10px;
    border-radius: 5px;
    transition: .5s background-color;

    &:before {
        content: '+';
        width: 24px;
        height: 24px;
        font-size: 1.4rem;
        display: inline-block;
        color: #3750DB;
    }

    &:hover {
        cursor: pointer;
        background-color: #d6d5d5;
    }
`;

export const AddNoteWrapper = styled.div`
    width: 100%;
    background-color: #ffffff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 15px 0px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
    position: relative;

    &:focus-within {
        outline: solid #3750DB 1px;
    }
`;

export const StyledAddNoteInput = styled.textarea`
    width: 100%;
    min-height: 150px;
    box-sizing: border-box;
    outline: none;
    border: none;
    padding: 15px 30px 15px 15px;
    resize: none;
    color: #515151;
    font-size: 0.9rem;
    font-weight: 300;
    font-family: 'Montserrat';

    &:placeholder {
        color: #ABABAB;
    }
`;

export const StyledLine = styled.hr`
    margin: 0;
    width: calc(100% - 30px);
    height: 0.5px;
    opacity: 0.5;
    background-color: #ABABAB;
    align-self: center;
`;

export const NoteRatingWrapper = styled.div`
    width: calc(100% - 30px);
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
`;

export const StyledParagraph = styled.p`
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 0.75rem;
    color: #ABABAB;
    font-weight: 300;
`;

export const StyledImg = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 5px;
    transition: .5s background-color;

    &:hover {
        background-color: #EFEFEF;
    }
`;

export const StyledOptionsIcon = styled.img`
    width: 16px;
    height: 16px;
    position: absolute;
    right: 5px;
    top: 5px;
    border-radius: 50%;
    padding: 5px;
    transition: .5s background-color;

    &:hover {
        background-color: #EFEFEF;
    }
`;
