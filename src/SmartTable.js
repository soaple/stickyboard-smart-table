// src/SmartTable.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import QueryManager from './QueryManager';
import {
    Table,
    TableToolbar,
    TableToolbarTitle,
    TableHeader,
    TableHead,
    TableBody,
    TableRowEmpty,
    TableRow,
    TableData,
    TableFooter,
} from './Table';

const Wrapper = styled.div``;

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
            rows: [],
            // Table Pagination
            rowsPerPage: 10,
            totalPageCount: 10,
            currentPage: 0,     // Page number starts with 0
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
                    offset: ${rowsPerPage * currentPage},
                    limit: ${rowsPerPage}
                ) {
                    ${columns.map((column) => { return column.name }).join('\n')}
                }
            }`);

        this.setState({
            rows: result,
        });
    };

    onClickPage = (data) => {
        let selectedPage = data.selected;

        this.setState({
            currentPage: selectedPage,
        }, this.readData);
    };

    render() {
        const {
            headerHeight,
            headerLabelDict,
            rows,
            rowsPerPage,
            totalPageCount,
            page,
        } = this.state;
        const { title } = this.props;

        const totalPage = Math.ceil(rows.length / rowsPerPage);
        const offset = Math.ceil((page - 1) * rowsPerPage);
        const emptyRows = rowsPerPage - rows.length;

        return (
            <Table>
                {/* Table Toolbar */}
                <TableToolbar>
                    <TableToolbarTitle>{title}</TableToolbarTitle>
                </TableToolbar>

                {/* Table Header */}
                <TableHeader ref={this.tableHeader}>
                    {rows.length > 0 &&
                        Object.keys(rows[0]).map((key, index) => {
                            return (
                                <TableHead key={index}>
                                    {headerLabelDict[key] || key.toUpperCase()}
                                </TableHead>
                            );
                        })}
                </TableHeader>

                {/* Table Body */}
                <TableBody headerHeight={headerHeight}>
                    {rows.map((item, index) => {
                        return (
                            <TableRow
                                key={index}
                                showBorderBottom={index < rows.length - 1}>
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
                    {emptyRows > 0 && <TableRowEmpty numOfRows={emptyRows} />}
                </TableBody>

                {/* Table Footer */}
                <TableFooter>
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        pageCount={totalPageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.onClickPage}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                </TableFooter>
            </Table>
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
