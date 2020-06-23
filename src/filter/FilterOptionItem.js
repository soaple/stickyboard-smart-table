import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SimpleButton from '../button/SimpleButton';
import { RemoveIcon } from '../IconSet';

const Wrapper = styled.div``;

const SelectContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const Select = styled.select`
    padding: 4px 0px;
`;

const FilterValueInput = styled.input``;

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

    return (
        <Wrapper>
            {/* Select filter option */}
            <SelectContainer>
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
                            <option key={columnName} value={columnName}>
                                {columnName}
                            </option>
                        );
                    })}
                </Select>

                <FilterValueInput
                    value={filterOption.value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                />

                <SimpleButton onClick={onDelete} padding={8}>
                    <RemoveIcon width={28} height={28} fill={'#000000'} />
                </SimpleButton>
            </SelectContainer>
        </Wrapper>
    );
}

export default FilterOptionItem;
