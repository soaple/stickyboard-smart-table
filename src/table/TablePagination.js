// src/TablePagination.js

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const PrevButton = styled.button`
    margin-right: 16px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #aaaaaa;
    -webkit-transition: -webkit-all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    ${(props) => {
        if (props.disabled) {
            return `
                color: #dddddd;
                cursor: not-allowed;
                border: 1px solid #dddddd;
            `;
        } else {
            return `
                :hover {
                    background-color: #dddddd;
                    cursor: pointer;
                }
                :active {
                    background-color: #aaaaaa;
                }
            `;
        }
    }};
`;

const NextButton = styled.button`
    margin-left: 16px;
    padding: 0 16px;
    border-radius: 8px;
    border: 1px solid #aaaaaa;
    -webkit-transition: -webkit-all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    ${(props) => {
        if (props.disabled) {
            return `
                color: #dddddd;
                cursor: not-allowed;
                border: 1px solid #dddddd;
            `;
        } else {
            return `
                :hover {
                    background-color: #dddddd;
                    cursor: pointer;
                }
                :active {
                    background-color: #aaaaaa;
                }
            `;
        }
    }};
`;

class TablePagination extends React.Component {
    onPrevBtnClick = () => {
        const { totalPage, currentPage, onPageChange } = this.props;
        onPageChange(Math.max(currentPage - 1, 1));
    };

    onNextBtnClick = () => {
        const { totalPage, currentPage, onPageChange } = this.props;
        onPageChange(Math.min(currentPage + 1, totalPage));
    };

    render() {
        const {
            totalPage,
            currentPage,
            rowsPerPage,
            onPrevBtnClick,
            onNextBtnClick,
        } = this.props;

        return (
            <Wrapper>
                <PrevButton
                    onClick={this.onPrevBtnClick}
                    disabled={currentPage === 1}>
                    {'<'}
                </PrevButton>

                <div>{`${currentPage} / ${totalPage}`}</div>

                <NextButton
                    onClick={this.onNextBtnClick}
                    disabled={currentPage === totalPage}>
                    {'>'}
                </NextButton>
            </Wrapper>
        );
    }
}

export default TablePagination;
