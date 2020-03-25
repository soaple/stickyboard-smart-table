// src/SmartTable.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
            headerLabelDict: headerLabelDict,
            // Data
            rows: [],
            // Table Pagination
            rowsPerPage: 10,
            page: 1,
        };
    }

    componentDidMount() {
        this.readData();
    }

    readData = async () => {
        const { rows, rowsPerPage } = this.state;
        const { columns, queryName } = this.props;

        const result = await QueryManager.query(`
            {
                ${queryName.readItems}(offset: ${rows.length}, limit: ${rowsPerPage}) {
                    ${columns.map((column) => { return column.name }).join('\n')}
                }
            }`);

        this.setState({
            rows: result,
        });
    };

    render() {
        const { headerLabelDict, rows, rowsPerPage, page } = this.state;
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
                <TableHeader>
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
                <TableBody>
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
                <TableFooter></TableFooter>
            </Table>
        );
    }
}

SmartTable.propTypes = {
    titie: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
    })),
    queryName: PropTypes.shape({
        create: PropTypes.string.isRequired,
        readItems: PropTypes.string.isRequired,
        read: PropTypes.string.isRequired,
        update: PropTypes.string.isRequired,
        delete: PropTypes.string.isRequired,
    })
};

export default SmartTable;
