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

export function FilterIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Filter" transform="translate(0.000000, 1.000000)" fill={fill}>
                    <g id="Group-2" transform="translate(141.000000, 83.000000)">
                        <rect id="Rectangle" x="47" y="38" width="68" height="239" rx="30"></rect>
                        <path d="M81,-27.1187249 L189.964071,137 L-27.9640714,137 L81,-27.1187249 Z" id="Triangle" stroke={fill} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" transform="translate(81.000000, 61.000000) scale(1, -1) translate(-81.000000, -61.000000) "></path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export function AddIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Add" transform="translate(0.000000, 1.000000)" fill={fill}>
                    <rect id="Rectangle-Copy" x="183" y="63" width="78" height="318" rx="34"></rect>
                    <rect id="Rectangle-Copy-2" transform="translate(222.000000, 222.000000) rotate(90.000000) translate(-222.000000, -222.000000) " x="183" y="63" width="78" height="318" rx="34"></rect>
                </g>
            </g>
        </svg>
    )
}

export function RemoveIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Remove" transform="translate(0.000000, 1.000000)" fill={fill}>
                    <g id="Group-3" transform="translate(94.000000, 53.000000)">
                        <path d="M128,-89 L128,-89 C139.59798,-89 149,-79.5979797 149,-68 L149,146 C149,157.59798 139.59798,167 128,167 L128,167 C116.40202,167 107,157.59798 107,146 L107,-68 C107,-79.5979797 116.40202,-89 128,-89 Z" id="Rectangle-Copy-2" transform="translate(128.000000, 39.000000) rotate(90.000000) translate(-128.000000, -39.000000) "></path>
                        <path d="M128.5,-37 L128.5,-37 C137.060414,-37 144,-30.0604136 144,-21.5 L144,53.5 C144,62.0604136 137.060414,69 128.5,69 L128.5,69 C119.939586,69 113,62.0604136 113,53.5 L113,-21.5 C113,-30.0604136 119.939586,-37 128.5,-37 Z" id="Rectangle-Copy-3" transform="translate(128.500000, 16.000000) rotate(90.000000) translate(-128.500000, -16.000000) "></path>
                    </g>
                    <path d="M129.782056,126 L316.222146,126 C334.999827,126 350.222146,141.222319 350.222146,160 C350.222146,161.752048 350.086719,163.501476 349.817077,165.23265 L318.977162,363.23265 C316.398178,379.790378 302.139603,392 285.382232,392 L160.62197,392 C143.864599,392 129.606024,379.790378 127.027039,363.23265 L96.1871252,165.23265 C93.2972122,146.678683 105.995438,129.294982 124.549406,126.405069 C126.28058,126.135426 128.030008,126 129.782056,126 Z M162.345479,204.535256 C156.87638,205.303888 153.065898,210.360568 153.83453,215.829668 L166.360109,304.953794 C167.128741,310.422894 172.185421,314.233376 177.654521,313.464744 C183.12362,312.696112 186.934102,307.639432 186.16547,302.170332 L173.639891,213.046206 C172.871259,207.577106 167.814579,203.766624 162.345479,204.535256 Z M283.654521,204.535256 C278.185421,203.766624 273.128741,207.577106 272.360109,213.046206 L259.83453,302.170332 C259.065898,307.639432 262.87638,312.696112 268.345479,313.464744 C273.814579,314.233376 278.871259,310.422894 279.639891,304.953794 L292.16547,215.829668 C292.934102,210.360568 289.12362,205.303888 283.654521,204.535256 Z M223,204 C217.477153,204 213,208.477153 213,214 L213,304 C213,309.522847 217.477153,314 223,314 C228.522847,314 233,309.522847 233,304 L233,214 C233,208.477153 228.522847,204 223,204 Z" id="Rectangle-2"></path>
                </g>
            </g>
        </svg>
    )
}

export function SearchIcon({ width = 24, height = 24, fill = '#000000' }) {
    return (
        <svg width={width} height={height} viewBox="0 0 500 500">
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Search" transform="translate(0.000000, 1.000000)">
                    <circle id="Oval" stroke={fill} strokeWidth="42" cx="170.5" cy="164.5" r="93.5"></circle>
                    <rect id="Rectangle" fill={fill} transform="translate(287.903066, 293.903066) rotate(-45.000000) translate(-287.903066, -293.903066) " x="260.903066" y="207.903066" width="54" height="172" rx="27"></rect>
                </g>
            </g>
        </svg>
    )
}
