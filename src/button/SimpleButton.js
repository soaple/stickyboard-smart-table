import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: ${(props) => (props.padding ? `${props.padding}px` : '8px 24px')};
    background-color: transparent;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    border-radius: 8px;
    ${(props) => {
            if (props.isClickable) {
                return `
                    :hover {
                        cursor: pointer;
                        box-shadow: 0 0 4px 0 #eeeeee;
                        background-color: #eeeeee;
                    }
                `;
            } else {
                return `
                    :hover {
                        cursor: no-drop;
                    }
                `;
            }
        }}
        :active {
        background-color: #cccccc;
    }
`;

const Title = styled.div`
    font-size: 16px;
`;

function SimpleButton(props) {
    const { isClickable, onClick, title, padding, children } = props;

    return (
        <Wrapper
            isClickable={isClickable !== undefined ? isClickable : true}
            onClick={onClick}
            padding={padding}>
            {title && <Title>{title}</Title>}
            {children}
        </Wrapper>
    );
}

export default SimpleButton;
