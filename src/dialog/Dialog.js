import React, { useState } from 'react';
import styled from 'styled-components';
import {
    // DatePicker,
    // TimePicker,
    // DateTimePicker,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import TextareaAutosize from 'react-textarea-autosize';
import InputType from '../constants/InputType';

const Wrapper = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
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
    display: flex;
    flex-direction: column;
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
    max-height: calc(80% - 24px);
    display: block;
    overflow: scroll;
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
    ${(props) =>
        props.disabled &&
        `
        cursor: no-drop;
        background-color: #dddddd;
    `}
`;

const InputValueTextarea = styled(TextareaAutosize)`
    flex: 2;
    font-size: 16px;
    color: #000000;
    ${(props) =>
        props.disabled &&
        `
        cursor: no-drop;
        background-color: #dddddd;
    `}
    overflow: auto;
    resize: none;
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
        customColumnComponent,
        customMutationComponent,
        data,
        negativeBtnLabel,
        onNegativeBtnClick,
        positiveBtnLabel,
        onPositiveBtnClick,
    } = props;

    const initialValueDict = columns.reduce((acc, column) => {
        const columnName = column.name;
        if (data && data[columnName]) {
            if (column.type === 'String') {
                acc[columnName] = data[columnName];
            } else if (column.type === 'Int') {
                acc[columnName] = new Number(data[columnName]);
            } else if (column.type === 'Date') {
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

    function renderInputValue(column) {
        if (customMutationComponent && customMutationComponent[column.name]) {
            const CustomComponent = customMutationComponent[column.name];
            return (
                <CustomComponent
                    valueDict={valueDict}
                    value={valueDict[column.name]}
                />
            );
        } else if (
            customColumnComponent &&
            customColumnComponent[column.name]
        ) {
            const CustomComponent = customColumnComponent[column.name];
            return (
                <CustomComponent
                    valueDict={valueDict}
                    value={valueDict[column.name]}
                />
            );
        } else if (column.type === 'String') {
            return (
                <InputValueTextarea
                    value={valueDict[column.name]}
                    disabled={!column.updatable}
                    onChange={(event) => {
                        setValueDict({
                            ...valueDict,
                            [column.name]: event.target.value,
                        });
                    }}
                />
            );
        } else if (column.type === 'Int') {
            return (
                <InputValue
                    type={InputType.NUMBER}
                    value={valueDict[column.name]}
                    disabled={!column.updatable}
                    onChange={(event) => {
                        setValueDict({
                            ...valueDict,
                            [column.name]: new Number(event.target.value),
                        });
                    }}
                />
            );
        } else if (column.type === 'Date') {
            return (
                <KeyboardDateTimePicker
                    format="yyyy-MM-dd HH:mm:ss"
                    value={valueDict[column.name]}
                    variant="inline"
                    autoOk
                    cancelLabel={'CANCEL'}
                    okLabel={'OK'}
                    hintText={''}
                    dialogContainerStyle={null}
                    underlineShow={false}
                    onChange={(dateTime) => {
                        setValueDict({
                            ...valueDict,
                            [column.name]: dateTime,
                        });
                    }}
                />
            );
        } else {
            return (
                <InputValue
                    type={InputType.TEXT}
                    value={valueDict[column.name]}
                    disabled={!column.updatable}
                    onChange={(event) => {
                        setValueDict({
                            ...valueDict,
                            [column.name]: event.target.value,
                        });
                    }}
                />
            );
        }
    }

    return (
        <Wrapper>
            <DialogWrapper>
                <Title>{title}</Title>

                <Divider />

                <Content>
                    {columns.map((column, index) => {
                        return (
                            <InputContainer key={column.name}>
                                <InputName>{`${column.name} ${
                                    column.required ? '*' : ''
                                }`}</InputName>
                                {renderInputValue(column)}
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
