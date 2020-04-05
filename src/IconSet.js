import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export function RefreshIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Refresh" transform="translate(20.000000, 20.000000)" stroke={fill} strokeWidth="40">
                    <circle id="Oval" cx="222" cy="222" r="222"></circle>
                    <g id="Group" transform="translate(118.000000, 102.000000)" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M177.531626,33.9022884 C158.998726,13.1140142 131.866496,0 101.636512,0 C45.780359,0 0.5,44.771525 0.5,100" id="Oval-Copy"></path>
                        <path d="M239.330684,27.5613472 L189.476054,77.4243181 L239.330684,27.5613472 Z M138.790712,27.4705365 L188.645342,77.3335074 L138.790712,27.4705365 Z" id="Line-2" transform="translate(189.060698, 52.470096) rotate(-36.000000) translate(-189.060698, -52.470096) "></path>
                    </g>
                    <g id="Group-Copy" transform="translate(202.000000, 290.500000) scale(-1, -1) translate(-202.000000, -290.500000) translate(79.000000, 239.000000)" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M177.531626,33.9022884 C158.998726,13.1140142 131.866496,0 101.636512,0 C45.780359,0 0.5,44.771525 0.5,100" id="Oval-Copy"></path>
                        <path d="M239.330684,27.5613472 L189.476054,77.4243181 L239.330684,27.5613472 Z M138.790712,27.4705365 L188.645342,77.3335074 L138.790712,27.4705365 Z" id="Line-2" transform="translate(189.060698, 52.470096) rotate(-36.000000) translate(-189.060698, -52.470096) "></path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export function CreateIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Create" transform="translate(20.000000, 20.000000)">
                    <circle id="Oval" stroke={fill} strokeWidth="40" cx="222" cy="222" r="222"></circle>
                    <rect id="Rectangle" fill={fill} x="202" y="82" width="40" height="280" rx="20"></rect>
                    <rect id="Rectangle" fill={fill} transform="translate(222.000000, 222.000000) rotate(90.000000) translate(-222.000000, -222.000000) " x="202" y="82" width="40" height="280" rx="20"></rect>
                </g>
            </g>
        </svg>
    )
}

export function DeleteIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Delete" transform="translate(20.000000, 20.000000)">
                    <circle id="Oval" stroke={fill} strokeWidth="40" cx="222" cy="222" r="222"></circle>
                    <rect id="Rectangle" fill={fill} transform="translate(222.000000, 222.000000) rotate(90.000000) translate(-222.000000, -222.000000) " x="202" y="82" width="40" height="280" rx="20"></rect>
                </g>
            </g>
        </svg>
    )
}
