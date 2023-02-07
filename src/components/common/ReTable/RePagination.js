// ********* Re-Pagination **********
// Version: M1
// Author: Minh
// Updated: 09/11/2021
// **********************************

import { useEffect } from 'react';

import Pagination from 'rc-pagination';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import styled from 'styled-components';
import colors from 'styles/colors';

import 'rc-pagination/assets/index.css';
import React from 'react';

const RePagination = ({ name, total, current, pageSize, onChange, fromZero, isNamiV2 = false, ...restProps }) => {
    const [currentTheme] = useDarkMode();

    useEffect(() => {
        name && scrollAfterPageChange(name);
    }, [current, name]);

    const Wapper = NamiV2PaginationWrapper;

    return (
        <Wapper isDark={currentTheme === THEME_MODE.DARK}>
            <Pagination hideOnSinglePage total={total} current={current} pageSize={pageSize} onChange={onChange} {...restProps} />
        </Wapper>
    );
};

const scrollAfterPageChange = (id) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
};

const NamiV2PaginationWrapper = styled.div`
    .rc-pagination-item-link,
    .rc-pagination-item {
        height: 36px;
        width: 36px;
        border-radius: 100px;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        border: none;
        background-color: transparent;
        margin-right: 16px;
    }

    .rc-pagination-item a {
        color: ${({ isDark }) => (isDark ? colors.grey4 : colors.primary)};
    }

    .rc-pagination-item-active {
        background-color: ${colors?.namiv2?.green?.DEFAULT};
    }

    .rc-pagination-item-active a {
        color: white;
    }

    .rc-pagination {
        display: flex;
    }

    .rc-pagination-prev {
        margin-right: 16px !important;
        width: 36px;
    }

    .rc-pagination-next {
        margin-right: 0px !important;
        width: 36px;
        height: 36px;
    }

    .rc-pagination-options {
        display: none;
    }

    .rc-pagination-prev button,
    .rc-pagination-next button {
        color: ${colors?.namiv2?.gray[2]};
        background-color: ${({ isDark }) => (isDark ? colors?.namiv2?.gray?.DEFAULT : colors.grey3)};
    }

    .rc-pagination-next button:after {
        margin-bottom: 4px;
        margin-left: 2px;
    }

    .rc-pagination-prev button:after {
        margin-bottom: 4px;
        margin-right: 2px;
    }

    .rc-pagination-prev button:after,
    .rc-pagination-next button:after {
        font-size: 24px;
    }

    .rc-pagination-prev button:hover,
    .rc-pagination-next button:hover {
        color: ${colors?.namiv2?.gray[2]};
    }

    .rc-pagination-disabled button:after {
        color: #454c5c !important;
    }

    .rc-pagination-jump-next button {
        align-items: end;
        color: #454c5c;
    }

    .rc-pagination-prev:focus .rc-pagination-item-link,
    .rc-pagination-next:focus .rc-pagination-item-link,
    .rc-pagination-prev:hover .rc-pagination-item-link,
    .rc-pagination-next:hover .rc-pagination-item-link {
        color: ${colors.grey4};
        border-color: ${colors.grey4};
    }
`;

export default RePagination;
