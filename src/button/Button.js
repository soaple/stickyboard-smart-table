import React from 'react';
import styled from 'styled-components';
import SimpleButton from './SimpleButton';
import OrderMethod from '../constants/OrderMethod';

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
        <SimpleButton onClick={onClick} title={title}>
            {renderOrderIcon()}
        </SimpleButton>
    );
}

export default Button;
