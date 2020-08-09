import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import SimpleButton from '../button/SimpleButton';
import { RemoveIcon } from '../IconSet';

const Wrapper = styled.div``;

const SelectContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const StyledFormControl = styled(FormControl)`
    min-width: 120px;
`;

const DatePickerContainer = styled.div`
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #cccccc;
    border-radius: 4px;
`;

const DateDivider = styled.div`
    margin: 0px 8px;
    font-size: 16px;
    font-weight: 500;
`;

function FilterOptionItem(props) {
    const {
        columns,
        filterOption,
        onColumnChange,
        onValueChange,
        onDelete,
    } = props;

    const [columnDict, setColumnDict] = useState({});

    useEffect(() => {
        let newColumnDict = {};
        columns.forEach((column) => {
            newColumnDict[column.name] = column;
        });
        setColumnDict(newColumnDict);
    }, [columns]);

    const renderFilterValueInput = () => {
        if (filterOption.filterDataType === 'Date') {
            const dateRange = filterOption.filterColumnValue;

            return (
                <DatePickerContainer>
                    <KeyboardDateTimePicker
                        format="yyyy-MM-dd HH:mm:ss"
                        value={filterOption.filterColumnValue[0]}
                        variant="inline"
                        autoOk
                        cancelLabel={'CANCEL'}
                        okLabel={'OK'}
                        hintText={''}
                        dialogContainerStyle={null}
                        underlineShow={false}
                        onChange={(dateTime) => {
                            onValueChange([
                                dateTime.getTime(),
                                filterOption.filterColumnValue[1],
                            ]);
                        }}
                    />

                    <DateDivider>{'~'}</DateDivider>

                    <KeyboardDateTimePicker
                        format="yyyy-MM-dd HH:mm:ss"
                        value={filterOption.filterColumnValue[1]}
                        variant="inline"
                        autoOk
                        cancelLabel={'CANCEL'}
                        okLabel={'OK'}
                        hintText={''}
                        dialogContainerStyle={null}
                        underlineShow={false}
                        onChange={(dateTime) => {
                            onValueChange([
                                filterOption.filterColumnValue[0],
                                dateTime.getTime(),
                            ]);
                        }}
                    />
                </DatePickerContainer>
            );
        } else {
            return (
                <TextField
                    variant="outlined"
                    type={
                        filterOption.filterDataType === 'Int'
                            ? 'number'
                            : 'text'
                    }
                    value={filterOption.filterColumnValue}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                />
            );
        }
    };

    return (
        <Wrapper>
            {/* Select filter option */}
            <SelectContainer>
                <StyledFormControl variant="outlined">
                    <Select
                        value={filterOption.filterColumnName}
                        onChange={(event) => {
                            const columnName = event.target.value;
                            const selectedColumn = columnDict[columnName];
                            onColumnChange(selectedColumn);
                        }}>
                        {columns.map((column, index) => {
                            const columnName = column.name;
                            return (
                                <MenuItem key={columnName} value={columnName}>
                                    {columnName}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </StyledFormControl>

                {/* Filter value input */}
                {renderFilterValueInput()}

                <SimpleButton onClick={onDelete} padding={8}>
                    <RemoveIcon width={28} height={28} fill={'#000000'} />
                </SimpleButton>
            </SelectContainer>
        </Wrapper>
    );
}

export default FilterOptionItem;
