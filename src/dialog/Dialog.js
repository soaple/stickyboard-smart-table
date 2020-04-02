import React, { useState } from 'react';
import styled from 'styled-components';
import InputType from '../constants/InputType';

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
    border-radius: 8px;
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
    font-size: 16px;
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
    font-size: 16px;
    color: #000000;
`;

const InputValue = styled.input`
    flex: 2;
    font-size: 16px;
    color: #000000;
    ${props => props.disabled && `
        cursor: no-drop;
        background-color: #dddddd;
    `}
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
    font-size: 16px;
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
    font-size: 16px;
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
    const {
        title,
        columns,
        data,
        negativeBtnLabel,
        onNegativeBtnClick,
        positiveBtnLabel,
        onPositiveBtnClick,
    } = props;

    const initialValueDict = columns.reduce((acc, column) => {
        const columnName = column.name;
        if (data && data[columnName]) {
            if (column.type === InputType.NUMBER) {
                acc[columnName] = data[columnName];
            } else if (column.type === InputType.DATE) {
                // acc[columnName] = new Date(data[columnName]);
                acc[columnName] = data[columnName];
            } else {
                acc[columnName] = data[columnName];
            }
        } else {
            acc[columnName] = '';
        }

        return acc;
    }, {});
    const [valueDict, setValueDict] = useState(initialValueDict);

    return (
        <Wrapper>
            <DialogWrapper>
                <Title>{title}</Title>

                <Divider />

                <Content>
                    {columns.map((column, index) => {
                        return (
                            <InputContainer key={column.name}>
                                <InputName>{column.name}</InputName>
                                <InputValue
                                    type={/* column.type || */InputType.TEXT}
                                    value={valueDict[column.name]}
                                    disabled={!column.updatable}
                                    onChange={(event) => {
                                        // let value = event.target.value;
                                        // if (column.type === InputType.NUMBER) {
                                        //     value = Number(value);
                                        // }

                                        setValueDict({
                                            ...valueDict,
                                            // [column.name]: value,
                                            [column.name]: event.target.value,
                                        });
                                    }}
                                />
                            </InputContainer>
                        );
                    })}
                </Content>

                <Divider />

                <Footer>
                    <NegativeButton onClick={onNegativeBtnClick}>
                        {negativeBtnLabel || 'Cancel'}
                    </NegativeButton>
                    <PositiveButton
                        onClick={() => {
                            onPositiveBtnClick(valueDict);
                        }}>
                        {positiveBtnLabel || 'Create'}
                    </PositiveButton>
                </Footer>
            </DialogWrapper>
        </Wrapper>
    );
}

export default Dialog;
