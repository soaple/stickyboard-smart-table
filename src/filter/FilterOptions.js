import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FilterOptionItem from './FilterOptionItem';
import SimpleButton from '../button/SimpleButton';
import { FilterIcon, AddIcon, SearchIcon } from '../IconSet';

const Wrapper = styled.div`
    position: relative;
    padding: 8px;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    border: 1px solid #cccccc;
    border-radius: 8px;
`;

const FilterIconContainer = styled.div`
    width: 44px;
    height: 44px;
    margin-right: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const Title = styled.div`
    font-size: 16px;
`;

const FilterOptionItemContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const generateOption = (
    filterDataType = '',
    filterColumnName = '',
    filterColumnKey = null,
    filterColumnValue = ''
) => {
    if (filterDataType === 'Date' && filterColumnValue === '') {
        const defaultEndDate = new Date().getTime();
        const defaultStartDate = defaultEndDate - 7 * 24 * 60 * 60 * 1000;

        return {
            filterDataType: filterDataType,
            filterColumnName: filterColumnName,
            filterColumnKey: filterColumnKey,
            filterColumnValue: [defaultStartDate, defaultEndDate],
        };
    } else {
        return {
            filterDataType: filterDataType,
            filterColumnName: filterColumnName,
            filterColumnKey: filterColumnKey,
            filterColumnValue: filterColumnValue,
        };
    }
};

class FilterOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [],
        };
    }

    getOptions = () => {
        const { options } = this.state;
        return options;
    };

    render() {
        const { options } = this.state;
        const { columns, headerLabelDict } = this.props;

        return (
            <Wrapper>
                <FilterIconContainer>
                    <FilterIcon width={28} height={28} fill={'#000000'} />
                </FilterIconContainer>

                {/* Filter options */}
                <FilterOptionItemContainer>
                    {options.map((option, index) => {
                        return (
                            <FilterOptionItem
                                key={index}
                                columns={columns}
                                headerLabelDict={headerLabelDict}
                                filterOption={option}
                                onColumnChange={(selectedColumn) => {
                                    let newOptions = [...options];
                                    newOptions[index] = generateOption(
                                        selectedColumn.type,
                                        selectedColumn.name,
                                        selectedColumn.key
                                    );
                                    this.setState({ options: newOptions });
                                }}
                                onValueChange={(value) => {
                                    let newOptions = [...options];
                                    newOptions[index] = generateOption(
                                        option.filterDataType,
                                        option.filterColumnName,
                                        option.filterColumnKey,
                                        value
                                    );
                                    this.setState({ options: newOptions });
                                }}
                                onDelete={() => {
                                    let newOptions = [...options];
                                    newOptions.splice(index, 1);
                                    this.setState({ options: newOptions });
                                }}
                            />
                        );
                    })}
                </FilterOptionItemContainer>

                <SimpleButton
                    onClick={() => {
                        this.setState({
                            options: [
                                ...options,
                                generateOption(
                                    columns[0].type,
                                    columns[0].name,
                                    columns[0].key
                                ),
                            ],
                        });
                    }}
                    padding={8}>
                    <AddIcon width={28} height={28} fill={'#000000'} />
                </SimpleButton>
            </Wrapper>
        );
    }
}

export default FilterOptions;
