// src/SmartTable.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import QueryManager from './QueryManager';
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
import { CreateIcon, DeleteIcon } from './IconSet';

const Wrapper = styled.div``;

const ClickableContainer = styled.div`
    margin: 0 16px;
    :hover {
        cursor: pointer;
    }
`;

class SmartTable extends React.Component {
    constructor(props) {
        super(props);

        this.tableHeader = React.createRef();

        // Initialize GraphQL QueryManager
        const endpoint = props.endpoint || `${window.location.origin}/graphql`;
        QueryManager.initialize(endpoint);

        // Generate header label dictionary
        let headerLabelDict = {};
        props.columns.forEach((column) => {
            if (column.label) {
                headerLabelDict[column.name] = column.label;
            }
        });

        this.state = {
            headerHeight: 0,
            headerLabelDict: headerLabelDict,
            // Data
            count: 0,
            rows: [],
            // Table pagination
            rowsPerPage: 10,
            currentPage: 1,
            // Dialog
            showCreateDialog: false,
        };
    }

    componentDidMount() {
        if (this.tableHeader.current) {
            this.setState({
                headerHeight: this.tableHeader.current.offsetHeight,
            });
        }

        this.readData();
    }

    readData = async () => {
        const { rows, rowsPerPage, currentPage } = this.state;
        const { columns, queryName } = this.props;

        // prettier-ignore
        const result = await QueryManager.query(`
            {
                ${queryName.readItems}(
                    offset: ${rowsPerPage * (currentPage - 1)},
                    limit: ${rowsPerPage}
                ) {
                    count
                    rows {
                        ${columns.map((column) => { return column.name }).join('\n')}
                    }
                }
            }`);

        this.setState({
            count: result.count,
            rows: result.rows,
        });
    };

    onPageChange = (page) => {
        this.setState(
            {
                currentPage: page,
            },
            this.readData
        );
    };

    showCreateDialog = () => {
        this.setState({
            showCreateDialog: true,
        });
    };

    hideCreateDialog = () => {
        this.setState({
            showCreateDialog: false,
        });
    };

    render() {
        const {
            headerHeight,
            headerLabelDict,
            // Data
            count,
            rows,
            // Table pagination
            rowsPerPage,
            currentPage,
            // Dialog
            showCreateDialog,
        } = this.state;
        const { title } = this.props;

        const totalPageCount = Math.ceil(count / rowsPerPage);
        const offset = Math.ceil((currentPage - 1) * rowsPerPage);
        const emptyRows = rowsPerPage - rows.length;

        return (
            <TableWrapper>
                {/* Table Toolbar */}
                <TableToolbar>
                    <TableToolbarTitle>{title}</TableToolbarTitle>

                    <ClickableContainer onClick={this.showCreateDialog}>
                        <CreateIcon width={24} height={24} fill={'#000000'} />
                    </ClickableContainer>

                    <ClickableContainer
                        onClick={() => {
                            alert('Delete');
                        }}>
                        <DeleteIcon width={24} height={24} fill={'#000000'} />
                    </ClickableContainer>
                </TableToolbar>

                {/* Table Content (Horizontally scrollable) */}
                <TableContent>
                    <Table>
                        {/* Table Header */}
                        <TableHead>
                            <TableHeader>
                                {rows.length > 0 &&
                                    Object.keys(rows[0]).map((key, index) => {
                                        return (
                                            <TableHeaderData key={index}>
                                                {headerLabelDict[key] ||
                                                    key.toUpperCase()}
                                            </TableHeaderData>
                                        );
                                    })}
                            </TableHeader>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {rows.map((item, index) => {
                                return (
                                    <TableRow key={index}>
                                        {Object.keys(item).map((key, index) => {
                                            return (
                                                <TableData key={index}>
                                                    {item[key]}
                                                </TableData>
                                            );
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
                        onPageChange={this.onPageChange}
                    />
                </TableFooter>

                {/* Dialog */}
                {showCreateDialog && (
                    <Dialog
                        title={'Create Item'}
                        onClose={this.hideCreateDialog}
                    />
                )}
            </TableWrapper>
        );
    }
}

SmartTable.propTypes = {
    titie: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string,
        })
    ),
    queryName: PropTypes.shape({
        create: PropTypes.string.isRequired,
        readItems: PropTypes.string.isRequired,
        read: PropTypes.string.isRequired,
        update: PropTypes.string.isRequired,
        delete: PropTypes.string.isRequired,
    }),
};

export default SmartTable;
