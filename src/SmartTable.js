// src/SmartTable.js
import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import {
    StylesProvider,
    createGenerateClassName,
} from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import QueryGenerator from './utils/QueryGenerator';
import ColumnUtil from './utils/ColumnUtil';
// import QueryManager from './QueryManager';
import { SearchIcon } from './IconSet';

import {
    TableWrapper,
    TableToolbar,
    TableToolbarTitle,
    TableContent,
    Table,
    TableHead,
    TableHeader,
    TableHeaderData,
    TableBody,
    TableRow,
    TableRowEmpty,
    TableData,
    TableFooter,
} from './table/Table';
import TablePagination from './table/TablePagination';
import Dialog from './dialog/Dialog';
import FilterOptions from './filter/FilterOptions';
import SimpleButton from './button/SimpleButton';
import Button from './button/Button';
import InputType from './constants/InputType';
import OrderMethod from './constants/OrderMethod';
import { RefreshIcon, CreateIcon, DeleteIcon } from './IconSet';

const generateClassName = createGenerateClassName({
    disableGlobal: true,
    productionPrefix: 'smart-table',
});

const Wrapper = styled.div``;

const ClickableContainer = styled.div`
    margin: 0 16px;
    &:last-child {
        margin: 0 0 0 16px;
    }
    :hover {
        cursor: pointer;
    }
`;

const LoadingWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LoadingText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #000000;
`;

const ErrorWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ErrorText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #e33b3b;
`;

const FilterOptionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

function SmartTable(props) {
    const {
        title,
        schema,
        customHeaderTitle,
        customColumnComponent,
        customMutationComponent,
        customColumnStyle,
        customColumnFormatter,
        customColumns,
        initialOrderColumn,
        initialOrderMethod,
        hideColumn,
        customOnClickRow,
    } = props;
    const { columns } = schema;

    // Generate column dictionary
    const columnDict = useMemo(() => {
        let initialColumnDict = {};
        columns.forEach((column) => {
            initialColumnDict[column.name] = column;
        });
        return initialColumnDict;
    }, [columns]);

    // Generate header label dictionary
    const headerLabelDict = useMemo(() => {
        let initialHeaderLabelDict = {};
        columns.forEach((column) => {
            if (customHeaderTitle && customHeaderTitle[column.name]) {
                initialHeaderLabelDict[column.name] =
                    customHeaderTitle[column.name];
            } else {
                initialHeaderLabelDict[column.name] = column.name;
            }
        });
        return initialHeaderLabelDict;
    }, [columns]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [orderColumn, setOrderColumn] = useState(
        initialOrderColumn ||
            (columns && columns.length > 0 ? columns[0].name : null)
    );
    const [orderMethod, setOrderMethod] = useState(
        initialOrderMethod || OrderMethod.ASC
    );
    const [filterOptions, setFilterOptions] = useState([]);
    const filterOptionsRef = useRef(null);

    // Extract data from GraphQL schema
    const readQueryName = useMemo(() => schema.query.read.split('(')[0], [
        schema.query.read,
    ]);
    const readItemsQueryName = useMemo(
        () => schema.query.readItems.split('(')[0],
        [schema.query.readItems]
    );

    let createMutationObject = useMemo(
        () => QueryGenerator.generateMutationObject(schema.mutation.create),
        [schema.mutation.create]
    );

    let updateMutationObject = useMemo(
        () => QueryGenerator.generateMutationObject(schema.mutation.update),
        [schema.mutation.update]
    );

    const { loading, error, data, refetch } = useQuery(
        gql`
            ${QueryGenerator.generateReadItemsQuery(
                columns,
                readItemsQueryName,
                rowsPerPage * (currentPage - 1), // offset
                rowsPerPage, // limit
                filterOptions,
                orderColumn,
                orderMethod
            )}
        `
    );

    const [createMutation] = useMutation(
        gql`
            ${QueryGenerator.generateCreateMutation(
                columns,
                createMutationObject
            )}
        `
    );

    const [updateMutation] = useMutation(
        gql`
            ${QueryGenerator.generateUpdateMutation(
                columns,
                updateMutationObject
            )}
        `
    );

    function onCreateOrUpdateBtnClick(valueDict) {
        try {
            let variables = {};
            Object.keys(valueDict).forEach((columnName) => {
                const column = columnDict[columnName];
                const value = valueDict[columnName];

                if (isDialogCreateMode || column.update) {
                }

                if (column.required && (value === '' || value === null)) {
                    throw new Error(`Please enter ${columnName}.`);
                } else if (column.extractor) {
                    const { subfieldName, targetParamName } = column.extractor;
                    if (value === null) {
                        variables[targetParamName] = null;
                    } else if (typeof value === 'object') {
                        variables[targetParamName] = value[subfieldName];
                    }
                } else {
                    if (value) {
                        variables[columnName] = value;
                    } else if (column.defaultValue !== undefined) {
                        variables[columnName] = column.defaultValue;
                    } else {
                        variables[columnName] = null;
                    }
                }
            });

            const readItemsQuery = QueryGenerator.generateReadItemsQuery(
                columns,
                readItemsQueryName,
                rowsPerPage * (currentPage - 1), // offset
                rowsPerPage, // limit
                filterOptions,
                orderColumn,
                orderMethod
            );

            const params = {
                variables: variables,
                refetchQueries: [
                    {
                        query: gql`
                            ${readItemsQuery}
                        `,
                    },
                ],
            };

            if (isDialogCreateMode) {
                createMutation(params);
                setShowDialog(false);
            } else {
                updateMutation(params);
                setShowDialog(false);
            }
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        if (!showDialog) {
            setSelectedItemIndex(null);
        }
    }, [showDialog]);

    let count = 0;
    let rows = [];
    if (data && data[readItemsQueryName]) {
        count = data[readItemsQueryName].count;
        rows = data[readItemsQueryName].rows;
    }

    const totalPageCount = Math.ceil(count / rowsPerPage);
    const offset = Math.ceil((currentPage - 1) * rowsPerPage);
    const emptyRows = rowsPerPage - rows.length;

    const isDialogCreateMode = selectedItemIndex === null;

    function onHeaderDataClick(columnName) {
        if (orderColumn === columnName) {
            if (orderMethod === null) {
                setOrderMethod(OrderMethod.ASC);
            } else if (orderMethod === OrderMethod.ASC) {
                setOrderMethod(OrderMethod.DESC);
            } else {
                setOrderMethod(null);
            }
        } else {
            setOrderColumn(columnName);
            setOrderMethod(OrderMethod.ASC);
        }
    }

    const renderTable = () => {
        // if (loading && (!data || filterOptions.length === 0)) {
        if (loading && !rows) {
            return (
                <LoadingWrapper>
                    <LoadingText>Loading...</LoadingText>
                </LoadingWrapper>
            );
        }

        // if (error || !rows) {
        if (error) {
            return (
                <ErrorWrapper>
                    <ErrorText>Error</ErrorText>
                </ErrorWrapper>
            );
        }

        return (
            <>
                {/* Table Content (Horizontally scrollable) */}
                <TableContent>
                    <Table>
                        {/* Table Header */}
                        {renderTableHeader()}

                        {/* Table Body */}
                        {renderTableBody()}
                    </Table>
                </TableContent>

                {/* Table Footer */}
                <TableFooter>
                    <TablePagination
                        totalPage={totalPageCount}
                        currentPage={currentPage}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                    />
                </TableFooter>
            </>
        );
    };

    const renderTableHeader = () => {
        return (
            <TableHead>
                <TableHeader>
                    {rows.length > 0 &&
                        Object.keys(headerLabelDict).map(
                            (columnName, index) => {
                                if (hideColumn && hideColumn[columnName]) {
                                    return null;
                                }

                                const column = columnDict[columnName];
                                const isSortable = ColumnUtil.isScalarData(
                                    column.type
                                );

                                return (
                                    <TableHeaderData key={`header-${index}`}>
                                        <Button
                                            isClickable={isSortable}
                                            onClick={() => {
                                                if (isSortable) {
                                                    onHeaderDataClick(
                                                        columnName
                                                    );
                                                } else {
                                                    alert(
                                                        'This is not a sortable column!'
                                                    );
                                                }
                                            }}
                                            title={
                                                headerLabelDict[columnName] ||
                                                columnName.toUpperCase()
                                            }
                                            isOrderColumn={
                                                orderColumn === columnName
                                            }
                                            orderMethod={orderMethod}
                                        />
                                    </TableHeaderData>
                                );
                            }
                        )}

                    {/* Header for custom columns */}
                    {customColumns &&
                        customColumns.length > 0 &&
                        customColumns.map((customColumn, index) => {
                            return (
                                <TableHeaderData key={`custom-header-${index}`}>
                                    <Button
                                        onClick={() => {
                                            alert(
                                                `${customColumn.headerTitle} clicked!`
                                            );
                                        }}
                                        title={customColumn.headerTitle}
                                    />
                                </TableHeaderData>
                            );
                        })}
                </TableHeader>
            </TableHead>
        );
    };

    const renderTableBody = () => {
        return (
            <TableBody>
                {rows.map((row, index) => renderTableRow(row, index))}

                {emptyRows > 0 && (
                    <TableRowEmpty
                        height={`${(emptyRows / rowsPerPage) * 100}%`}
                    />
                )}
            </TableBody>
        );
    };

    const renderTableRow = (row, index) => {
        return (
            <TableRow
                key={index}
                onClick={() => {
                    if (customOnClickRow) {
                        customOnClickRow(row);
                    } else {
                        setSelectedItemIndex(index);
                        setShowDialog(true);
                    }
                }}>
                {Object.keys(row).map((columnName, index) => {
                    if (hideColumn && hideColumn[columnName]) {
                        return null;
                    }

                    const column = columnDict[columnName];
                    const value = row[columnName];

                    if (headerLabelDict[columnName]) {
                        let CustomComponent;
                        if (
                            customColumnComponent &&
                            customColumnComponent[columnName]
                        ) {
                            CustomComponent = customColumnComponent[columnName];
                        }

                        let customStyle = {};
                        if (
                            customColumnStyle &&
                            customColumnStyle[columnName]
                        ) {
                            customStyle = customColumnStyle[columnName];
                        }

                        let customFormatter = null;
                        if (
                            customColumnFormatter &&
                            customColumnFormatter[columnName]
                        ) {
                            customFormatter = customColumnFormatter[columnName];
                        }

                        let renderValue = value;
                        if (customFormatter) {
                            renderValue = customFormatter(value);
                        } else if (column.type === 'Date') {
                            renderValue = new Date(value).toLocaleString();
                        } else if (
                            !ColumnUtil.isScalarData(column.type) &&
                            !CustomComponent
                        ) {
                            renderValue = JSON.stringify(value);
                        }

                        return (
                            <TableData
                                key={`data-${index}`}
                                style={customStyle}>
                                {CustomComponent ? (
                                    <CustomComponent value={renderValue} />
                                ) : (
                                    renderValue
                                )}
                            </TableData>
                        );
                    }
                })}

                {/* Data for custom columns */}
                {customColumns &&
                    customColumns.length > 0 &&
                    customColumns.map((customColumn, index) => {
                        const Component = customColumn.component;

                        if (!Component) {
                            return null;
                        }

                        return (
                            <TableData key={`custom-data-${index}`}>
                                <Component
                                    item={row}
                                    refetch={() => refetch()}
                                />
                            </TableData>
                        );
                    })}
            </TableRow>
        );
    };

    return (
        <TableWrapper>
            {/* Table Toolbar */}
            <TableToolbar>
                <TableToolbarTitle>{title}</TableToolbarTitle>

                <ClickableContainer onClick={() => refetch()}>
                    <RefreshIcon width={24} height={24} fill={'#000000'} />
                </ClickableContainer>

                <ClickableContainer
                    onClick={() => {
                        setShowDialog(true);
                    }}>
                    <CreateIcon width={24} height={24} fill={'#000000'} />
                </ClickableContainer>

                {false && (
                    <ClickableContainer
                        onClick={() => {
                            alert('Delete');
                        }}>
                        <DeleteIcon width={24} height={24} fill={'#000000'} />
                    </ClickableContainer>
                )}
            </TableToolbar>

            {/* Filter options */}
            <FilterOptionsContainer>
                <FilterOptions
                    ref={filterOptionsRef}
                    columns={columns.filter((column) => {
                        return ColumnUtil.isScalarData(column.type);
                    })}
                    headerLabelDict={headerLabelDict}
                />
                <SimpleButton
                    onClick={() => {
                        if (filterOptionsRef.current) {
                            const filterOptions = filterOptionsRef.current.getOptions();
                            setFilterOptions(filterOptions);
                            setCurrentPage(1);
                        }
                    }}>
                    <SearchIcon width={28} height={28} fill={'#000000'} />
                </SimpleButton>
            </FilterOptionsContainer>

            {renderTable()}

            {/* Create or Update Dialog */}
            {showDialog && (
                <Dialog
                    title={`${
                        isDialogCreateMode ? 'Create' : 'Update'
                    } ${title}`}
                    columns={
                        isDialogCreateMode
                            ? columns.filter(
                                  (column) => column.requiredToCreate
                              )
                            : columns
                    }
                    customColumnComponent={customColumnComponent}
                    customMutationComponent={customMutationComponent}
                    data={rows[selectedItemIndex]}
                    negativeBtnLabel={'Cancel'}
                    onNegativeBtnClick={() => {
                        setShowDialog(false);
                    }}
                    positiveBtnLabel={isDialogCreateMode ? 'Create' : 'Update'}
                    onPositiveBtnClick={onCreateOrUpdateBtnClick}
                    refetch={() => refetch()}
                />
            )}
        </TableWrapper>
    );
}

SmartTable.propTypes = {
    titie: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string,
        })
    ),
    schema: PropTypes.shape({
        query: PropTypes.shape({
            read: PropTypes.string.isRequired,
            readItems: PropTypes.string.isRequired,
        }),
        mutation: PropTypes.shape({
            create: PropTypes.string,
            update: PropTypes.string,
        }),
    }),
};

const SmartTableWithApollo = (props) => {
    // Initialize ApolloClient
    const endpoint = props.endpoint || `${window.location.origin}/graphql`;
    const apolloClient = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache({
            addTypename: false,
        }),
    });

    return (
        <ApolloProvider client={apolloClient}>
            <StylesProvider
                generateClassName={generateClassName}
                injectFirst={true}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <SmartTable {...props} />
                </MuiPickersUtilsProvider>
            </StylesProvider>
        </ApolloProvider>
    );
};

export default SmartTableWithApollo;
