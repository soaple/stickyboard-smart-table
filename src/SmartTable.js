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

function isScalarData(columnType) {
    if (
        columnType === 'Int' ||
        columnType === 'String' ||
        columnType === 'Date'
    ) {
        return true;
    }

    return false;
}

function SmartTable(props) {
    const {
        title,
        schema,
        customHeaderTitle,
        customColumnRenderer,
        customColumnStyle,
        customColumnFormatter,
        customColumns,
        initialOrderColumn,
        initialOrderMethod,
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
    const [selectedItem, setSelectedItem] = useState(null);
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
            Object.keys(valueDict).forEach((key) => {
                const value = valueDict[key];
                if (value === '') {
                    throw new Error(`Please enter ${key}.`);
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
                variables: { ...valueDict },
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
        if (selectedItem && !showDialog) {
            setShowDialog(true);
        }
    }, [selectedItem]);

    // if (loading && !data) {
    if (loading && filterOptions.length === 0) {
        return (
            <LoadingWrapper>
                <LoadingText>Loading...</LoadingText>
            </LoadingWrapper>
        );
    }

    const { count, rows } = data[readItemsQueryName];

    if (error || !rows) {
        return (
            <ErrorWrapper>
                <ErrorText>Error</ErrorText>
            </ErrorWrapper>
        );
    }

    const totalPageCount = Math.ceil(count / rowsPerPage);
    const offset = Math.ceil((currentPage - 1) * rowsPerPage);
    const emptyRows = rowsPerPage - rows.length;

    const isDialogCreateMode = selectedItem === null;

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
                        return isScalarData(column.type);
                    })}
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

            {/* Table Content (Horizontally scrollable) */}
            <TableContent>
                <Table>
                    {/* Table Header */}
                    <TableHead>
                        <TableHeader>
                            {rows.length > 0 &&
                                Object.keys(headerLabelDict).map(
                                    (columnName, index) => {
                                        const column = columnDict[columnName];
                                        const isSortable = isScalarData(
                                            column.type
                                        );

                                        return (
                                            <TableHeaderData
                                                key={`header-${index}`}>
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
                                                        headerLabelDict[
                                                            columnName
                                                        ] ||
                                                        columnName.toUpperCase()
                                                    }
                                                    isOrderColumn={
                                                        orderColumn ===
                                                        columnName
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
                                        <TableHeaderData
                                            key={`custom-header-${index}`}>
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

                    {/* Table Body */}
                    <TableBody>
                        {rows.map((row, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    onClick={() => {
                                        setSelectedItem(row);
                                    }}>
                                    {Object.keys(row).map(
                                        (columnName, index) => {
                                            const column =
                                                columnDict[columnName];
                                            const value = row[columnName];

                                            if (headerLabelDict[columnName]) {
                                                let customRenderer;
                                                if (
                                                    customColumnRenderer &&
                                                    customColumnRenderer[
                                                        columnName
                                                    ]
                                                ) {
                                                    customRenderer =
                                                        customColumnRenderer[
                                                            columnName
                                                        ];
                                                }

                                                let customStyle = {};
                                                if (
                                                    customColumnStyle &&
                                                    customColumnStyle[
                                                        columnName
                                                    ]
                                                ) {
                                                    customStyle =
                                                        customColumnStyle[
                                                            columnName
                                                        ];
                                                }

                                                let customFormatter = null;
                                                if (
                                                    customColumnFormatter &&
                                                    customColumnFormatter[
                                                        columnName
                                                    ]
                                                ) {
                                                    customFormatter =
                                                        customColumnFormatter[
                                                            columnName
                                                        ];
                                                }

                                                let renderValue = value;
                                                if (customFormatter) {
                                                    renderValue = customFormatter(
                                                        value
                                                    );
                                                } else if (
                                                    column.type === 'Date'
                                                ) {
                                                    renderValue = new Date(
                                                        value
                                                    ).toLocaleString();
                                                } else if (
                                                    !isScalarData(
                                                        column.type
                                                    ) &&
                                                    !customRenderer
                                                ) {
                                                    renderValue = JSON.stringify(
                                                        value
                                                    );
                                                }

                                                return (
                                                    <TableData
                                                        key={`data-${index}`}
                                                        style={customStyle}>
                                                        {customRenderer
                                                            ? customRenderer(
                                                                  renderValue
                                                              )
                                                            : renderValue}
                                                    </TableData>
                                                );
                                            }
                                        }
                                    )}

                                    {/* Data for custom columns */}
                                    {customColumns &&
                                        customColumns.length > 0 &&
                                        customColumns.map(
                                            (customColumn, index) => {
                                                const Component =
                                                    customColumn.component;

                                                if (!Component) {
                                                    return null;
                                                }

                                                return (
                                                    <TableData
                                                        key={`custom-data-${index}`}>
                                                        <Component
                                                            item={row}
                                                            refetch={() =>
                                                                refetch()
                                                            }
                                                        />
                                                    </TableData>
                                                );
                                            }
                                        )}
                                </TableRow>
                            );
                        })}

                        {emptyRows > 0 && (
                            <TableRowEmpty
                                height={`${(emptyRows / rowsPerPage) * 100}%`}
                            />
                        )}
                    </TableBody>
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

            {/* Create Dialog */}
            {showDialog && (
                <Dialog
                    title={`${
                        isDialogCreateMode ? 'Create' : 'Update'
                    } ${title}`}
                    columns={
                        isDialogCreateMode
                            ? columns.filter((column) => column.required)
                            : columns
                    }
                    data={selectedItem}
                    negativeBtnLabel={'Cancel'}
                    onNegativeBtnClick={() => {
                        setSelectedItem(null);
                        setShowDialog(false);
                    }}
                    positiveBtnLabel={isDialogCreateMode ? 'Create' : 'Update'}
                    onPositiveBtnClick={onCreateOrUpdateBtnClick}
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
