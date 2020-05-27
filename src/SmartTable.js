// src/SmartTable.js

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import QueryGenerator from './utils/QueryGenerator';
// import QueryManager from './QueryManager';

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
import Button from './button/Button';
import InputType from './constants/InputType';
import { RefreshIcon, CreateIcon, DeleteIcon } from './IconSet';

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

function SmartTable(props) {
    const { title, schema, customHeaderTitle } = props;
    const { columns } = schema;

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
                rowsPerPage // limit
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
                rowsPerPage // limit
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
    if (loading) {
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

            {/* Table Content (Horizontally scrollable) */}
            <TableContent>
                <Table>
                    {/* Table Header */}
                    <TableHead>
                        <TableHeader>
                            {rows.length > 0 &&
                                Object.keys(headerLabelDict).map(
                                    (key, index) => {
                                        return (
                                            <TableHeaderData key={index}>
                                                <Button
                                                    onClick={() => {
                                                        alert(
                                                            `${key} clicked!`
                                                        );
                                                    }}>
                                                    {headerLabelDict[key] ||
                                                        key.toUpperCase()}
                                                </Button>
                                            </TableHeaderData>
                                        );
                                    }
                                )}
                        </TableHeader>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {rows.map((item, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    onClick={() => {
                                        setSelectedItem(item);
                                    }}>
                                    {Object.keys(item).map((key, index) => {
                                        if (headerLabelDict[key]) {
                                            return (
                                                <TableData key={index}>
                                                    {item[key]}
                                                </TableData>
                                            );
                                        }
                                    })}
                                </TableRow>
                            );
                        })}

                        {emptyRows > 0 && <TableRowEmpty />}
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
            <SmartTable {...props} />
        </ApolloProvider>
    );
};

export default SmartTableWithApollo;
