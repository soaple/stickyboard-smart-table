import React from 'react';
import styled from 'styled-components';
import OrderMethod from '../constants/OrderMethod';

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

const OrderIcon = styled.div`
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 16px;
`;

function Button(props) {
    const { onClick, title, isOrderColumn, orderMethod } = props;

    function renderOrderIcon() {
        if (!isOrderColumn) {
            return null;
        }

        if (orderMethod === OrderMethod.ASC) {
            return <OrderIcon>⬆︎</OrderIcon>;
        } else if (orderMethod === OrderMethod.DESC) {
            return <OrderIcon>⬇︎</OrderIcon>;
        } else {
            return null;
        }
    }

    return (
        <Wrapper onClick={onClick}>
            <Title>{title}</Title>
            {renderOrderIcon()}
        </Wrapper>
    );
}

export default Button;
