import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export function RefreshIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                <g id="Refresh" transform="translate(28.000000, 28.000000)" stroke={fill}>
                    <circle id="Oval" strokeWidth="56" cx="222" cy="222" r="222"></circle>
                    <g id="Group" transform="translate(117.000000, 100.000000)" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M177.531626,33.9022884 C158.998726,13.1140142 131.866496,0 101.636512,0 C45.780359,0 0.5,44.771525 0.5,100" id="Oval-Copy" strokeWidth="56"></path>
                        <path d="M243.330684,33.5613472 L193.476054,83.4243181 L243.330684,33.5613472 Z M142.790712,33.4705365 L192.645342,83.3335074 L142.790712,33.4705365 Z" id="Line-2" strokeWidth="40" transform="translate(193.060698, 58.470096) rotate(-36.000000) translate(-193.060698, -58.470096) "></path>
                    </g>
                    <g id="Group-Copy" transform="translate(202.000000, 290.500000) scale(-1, -1) translate(-202.000000, -290.500000) translate(77.000000, 236.000000)" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M177.531626,33.9022884 C158.998726,13.1140142 131.866496,0 101.636512,0 C45.780359,0 0.5,44.771525 0.5,100" id="Oval-Copy" strokeWidth="56"></path>
                        <path d="M243.330684,33.5613472 L193.476054,83.4243181 L243.330684,33.5613472 Z M142.790712,33.4705365 L192.645342,83.3335074 L142.790712,33.4705365 Z" id="Line-2" strokeWidth="40" transform="translate(193.060698, 58.470096) rotate(-36.000000) translate(-193.060698, -58.470096) "></path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export function CreateIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(28.000000, 28.000000)">
                    <circle stroke={fill} strokeWidth="56" cx="222" cy="222" r="222"></circle>
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
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(28.000000, 28.000000)">
                    <circle stroke={fill} strokeWidth="56" cx="222" cy="222" r="222"></circle>
                    <rect fill={fill} transform="translate(222.000000, 222.000000) rotate(90.000000) translate(-222.000000, -222.000000) " x="194" y="82" width="56" height="280" rx="28"></rect>
                </g>
            </g>
        </svg>
    )
}
