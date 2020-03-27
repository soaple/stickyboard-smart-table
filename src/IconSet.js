import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export function CreateIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(28.000000, 28.000000)">
                    <circle stroke={fill} stroke-width="56" cx="222" cy="222" r="222"></circle>
                    <rect fill={fill} x="194" y="82" width="56" height="280" rx="28"></rect>
                    <rect fill={fill} transform="translate(222.000000, 222.000000) rotate(90.000000) translate(-222.000000, -222.000000) " x="194" y="82" width="56" height="280" rx="28"></rect>
                </g>
            </g>
        </svg>
    )
}

export function DeleteIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(28.000000, 28.000000)">
                    <circle stroke={fill} stroke-width="56" cx="222" cy="222" r="222"></circle>
                    <rect fill={fill} transform="translate(222.000000, 222.000000) rotate(90.000000) translate(-222.000000, -222.000000) " x="194" y="82" width="56" height="280" rx="28"></rect>
                </g>
            </g>
        </svg>
    )
}
