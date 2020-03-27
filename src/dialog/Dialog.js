import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: -webkit-background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
`;

const DialogWrapper = styled.div`
    width: 80%;
    max-height: 80%;
    border-radius: 16px;
    background-color: #ffffff;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
`;

const Title = styled.div`
    padding: 16px;
    font-size: 20px;
    font-weight: bold;
    color: #000000;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    overflow: auto;
    font-size: 20px;
    font-weight: bold;
    color: #000000;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #444444;
`;

const InputContainer = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:not(:last-child) {
        border-bottom: 1px solid #dddddd;
    }
`;

const InputName = styled.div`
    flex: 1;
`;

const InputValue = styled.input`
    flex: 2;
`;

const Footer = styled.div`
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

const NegativeButton = styled.div`
    padding: 8px 16px;
    font-size: 20px;
    color: #000000;
    background-color: #ffffff;
    :hover {
        cursor: pointer;
        background-color: #bbbbbb;
    }
    -webkit-transition: -webkit-background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
    border-radius: 8px;
    border: 1px solid #aaaaaa;
`;

const PositiveButton = styled.div`
    margin-left: 16px;
    padding: 8px 16px;
    font-size: 20px;
    color: #000000;
    background-color: #ffffff;
    :hover {
        cursor: pointer;
        background-color: #bbbbbb;
    }
    -webkit-transition: -webkit-background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
    border-radius: 8px;
    border: 1px solid #aaaaaa;
`;

function Dialog(props) {
    const { title, onClose } = props;

    return (
        <Wrapper>
            <DialogWrapper>
                <Title>{title}</Title>

                <Divider />

                <Content>
                    <InputContainer>
                        <InputName>Name</InputName>
                        <InputValue value="" />
                    </InputContainer>

                    <InputContainer>
                        <InputName>Name</InputName>
                        <InputValue value="" />
                    </InputContainer>

                    <InputContainer>
                        <InputName>Name</InputName>
                        <InputValue value="" />
                    </InputContainer>
                </Content>

                <Divider />

                <Footer>
                    <NegativeButton onClick={onClose}>Cancel</NegativeButton>
                    <PositiveButton onClick={() => {}}>Create</PositiveButton>
                </Footer>
            </DialogWrapper>
        </Wrapper>
    );
}

export default Dialog;
