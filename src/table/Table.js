// src/Table.js

import React from 'react';
import styled from 'styled-components';

const TOOLBAR_HEIGHT = 56;
const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 56;

export const TableWrapper = styled.div`
    width: 100%;
    height: 100%;
    /* position: relative; */
`;

export const TableToolbar = styled.div`
    height: ${TOOLBAR_HEIGHT}px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 16px;
`;

export const TableToolbarTitle = styled.div`
    flex: 1;
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.color || '#000000'};
`;

export const TableContent = styled.div`
    width: 100%;
    height: calc(100% - ${TOOLBAR_HEIGHT + FOOTER_HEIGHT}px);
    overflow-x: auto;
`;

export const Table = styled.table`
    width: 100%;
    height: 100%;
`;

export const TableHead = styled.thead``;

export const TableHeader = styled.tr`
    height: ${HEADER_HEIGHT}px;
    border-bottom: 1px solid #444444;
`;

export const TableHeaderData = styled.th`
    /* padding: 8px 12px; */
    z-index: 10;
    position: sticky;
    top: 0;
    background-color: white;
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    user-select: none;
    color: ${(props) => props.color || '#444444'};
`;

export const TableBody = styled.tbody`
    height: calc(100% - ${HEADER_HEIGHT}px);
`;

export const TableRow = styled.tr`
    height: 10%;
    &:not(:last-child) {
        border-bottom: 1px solid #dddddd;
    }
    -webkit-transition: -webkit-background-color 0.1s ease-in-out;
    transition: background-color 0.1s ease-in-out;
    :hover {
        cursor: pointer;
        background-color: #eeeeee;
    }
    :active {
        background-color: #cccccc;
    }
`;

export const TableRowEmpty = styled.div`
    flex: 1;
`;

export const TableData = styled.td`
    padding: 8px 12px;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    font-weight: ${(props) => props.fontWeight || 400};
    color: ${(props) => props.color || '#000000'};
`;

export const TableFooter = styled.div`
    height: ${FOOTER_HEIGHT}px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #444444;
`;
