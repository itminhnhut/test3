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
import * as _ from 'lodash';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

import 'rc-pagination/assets/index.css';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import { useTranslation } from 'next-i18next';

const RePagination = ({ name, total, current, pageSize, onChange, fromZero, isNamiV2 = false, pagingPrevNext = {}, onusMode, ...restProps }) => {
    const [currentTheme] = useDarkMode();
    const {
        i18n: { language }
    } = useTranslation();

    useEffect(() => {
        name && scrollAfterPageChange(name);
    }, [current, name]);

    const Wapper = onusMode ? PaginationWrapper : NamiV2PaginationWrapper;
    if (!_.isEmpty(pagingPrevNext)) {
        const { page, hasNext, onChangeNextPrev } = pagingPrevNext;

        if (page === 0 && !hasNext) return null;

        return (
            <Wapper isDark>
                <div className="w-full flex items-center justify-center select-none gap-8">
                    <TextButton disabled={page === 0} className={`!text-base gap-2`} onClick={() => page !== 0 && onChangeNextPrev(-1)}>
                        <ChevronLeft size={16} />
                        {language === LANGUAGE_TAG.VI ? 'Trước đó' : 'Previous'}
                    </TextButton>
                    <TextButton disabled={!hasNext} className={`!text-base gap-2`} onClick={() => hasNext && onChangeNextPrev(+1)}>
                        {language === LANGUAGE_TAG.VI ? 'Kế tiếp' : 'Next'}
                        <ChevronRight size={16} />
                    </TextButton>
                </div>
            </Wapper>
        );
    }

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

const PaginationWrapper = styled.div`
    .rc-pagination-item,
    .rc-pagination-prev button,
    .rc-pagination-next button {
        border: none !important;
        background-color: transparent;

        a {
            font-family: Barlow, serif !important;
            font-weight: 500 !important;
        }

        @media (min-width: 1366px) {
            a {
                font-size: 16px;
            }
        }
    }

    .rc-pagination-item a,
    .rc-pagination-prev button,
    .rc-pagination-next button {
        color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
        border-radius: 50%;
    }

    .rc-pagination-item-active a,
    .rc-pagination-item:focus a,
    .rc-pagination-item:hover a {
        color: ${colors.white} !important;
        background-color: ${colors.teal};
    }

    .rc-pagination-jump-prev button:after,
    .rc-pagination-jump-next button:after {
        content: '...';
    }

    .rc-pagination-next button:after,
    .rc-pagination-prev button:after {
        background-color: ${({ isDark }) => (isDark ? colors.dark[2] : colors.white)};
        border-radius: 50%;
        width: 1.75rem;
        height: 1.75rem;
        line-height: 0.9;
    }

    .rc-pagination-prev .rc-pagination-item-link,
    .rc-pagination-next .rc-pagination-item-link {
        font-size: 28px;
    }

    .rc-pagination-disabled .rc-pagination-item-link,
    .rc-pagination-disabled:hover .rc-pagination-item-link,
    .rc-pagination-disabled:focus .rc-pagination-item-link {
        color: ${({ isDark }) => (isDark ? '#3e4351' : '#545454')};
        opacity: 0.5;
    }

    .rc-pagination-prev:focus:not(.rc-pagination-disabled) .rc-pagination-item-link,
    .rc-pagination-next:focus:not(.rc-pagination-disabled) .rc-pagination-item-link,
    .rc-pagination-prev:hover:not(.rc-pagination-disabled) .rc-pagination-item-link,
    .rc-pagination-next:hover:not(.rc-pagination-disabled) .rc-pagination-item-link {
        color: ${colors.white};
        border-color: ${colors.teal};
        ::after {
            background-color: ${colors.teal};
        }
    }
`;

const NamiV2PaginationWrapper = styled.div`
    .rc-pagination-item-link,
    .rc-pagination-item {
        height: 36px !important;
        width: 36px !important;
        border-radius: 100px !important;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        border: none !important;
        background-color: transparent;
        margin-right: 16px;
    }

    .rc-pagination-item a {
        color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
    }

    .rc-pagination-item-active {
        background-color: ${colors?.teal};
        a {
            color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.white)} !important;
        }
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
    .rc-pagination-item:focus a,
    .rc-pagination-item:hover a {
        color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
    }

    .rc-pagination-prev button,
    .rc-pagination-next button {
        color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
        background-color: ${({ isDark }) => (isDark ? colors.dark[2] : colors.gray[11])};
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
        color: ${colors?.gray[4]};
    }

    .rc-pagination-disabled button:after {
        color: #454c5c !important;
    }

    .rc-pagination-jump-next button {
        align-items: end;
        color: #454c5c;
    }
    .rc-pagination-disabled .rc-pagination-item-link,
    .rc-pagination-disabled:hover .rc-pagination-item-link,
    .rc-pagination-disabled:focus .rc-pagination-item-link {
        background-color: ${({ isDark }) => (isDark ? '' : colors.gray[11])} !important;
        &:after {
            /* color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.gray[4])} !important; */
            opacity: 0.2;
        }
    }
    .rc-pagination-prev:focus .rc-pagination-item-link,
    .rc-pagination-next:focus .rc-pagination-item-link,
    .rc-pagination-prev:hover .rc-pagination-item-link,
    .rc-pagination-next:hover .rc-pagination-item-link {
        color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
        border-color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.darkBlue)};
    }
`;

export default RePagination;
