import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    padding: 8px 24px;
    background-color: transparent;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    border-radius: 8px;
    :hover {
        cursor: pointer;
        box-shadow: 0 0 4px 0 #eeeeee;
        background-color: #eeeeee;
    }
    :active {
        background-color: #cccccc;
    }
`;

const Title = styled.div`
    font-size: 16px;
`;

function SimpleButton(props) {
    const { onClick, title, children } = props;

    return (
        <Wrapper onClick={onClick}>
            <Title>{title}</Title>
            {children}
        </Wrapper>
    );
}

export default SimpleButton;
