// Tab Component
// Version: Maldives
// Author:
// Created: 16/11/2021

// Data series look like
// const series = [
// { key: 1, title: 'title', localized: 'localizedPath', icon: React Element },
// ...
// ]

import { memo, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { log } from 'utils';
import styled from 'styled-components';
import colors from 'styles/colors';

export const TAB_TYPE = {
    TYPE1: 'type1'
};

const Tab = memo(
    ({
        type = TAB_TYPE.TYPE1,
        name = '',
        series,
        currentIndex,
        onChangeTab,
        tArr = [],
        itemStyles = null,
        isBorderBottom = true,
        itemClassName = null,
        className = ''
    }) => {
        if (!Array.isArray(series)) {
            log.e('Invalid series or Type Error');
            return null;
        }

        if (!series?.length) {
            log.e('Empty array');
            return null;
        }

        const { t } = useTranslation(['tab', ...tArr]);

        const render = useCallback(() => {
            console.log('here_____', type);
            if (type === TAB_TYPE.TYPE1) {
                let className = 'relative py-4 font-normal text-base cursor-pointer whitespace-nowrap ';
                if (itemClassName) {
                    className = className + itemClassName;
                }

                const inactive = 'text-txtSecondary dark:text-txtSecondary-dark ';
                const active = '!font-semibold text-txtPrimary dark:text-txtPrimary-dark ';

                return series.map((s) => {
                    const x = s?.key === currentIndex ? className + active : className + inactive;
                    console.log('x: ', x);
                    return (
                        <TabItem
                            key={`tab_${name}__${s?.key}`}
                            style={itemStyles ? { ...itemStyles } : undefined}
                            onClick={() => {
                                onChangeTab && onChangeTab(s?.key);
                            }}
                            active={s?.key === currentIndex}
                        >
                            <div className={s?.key === currentIndex ? className + active : className + inactive}>
                                <div className="flex items-center text-sm sm:text-base">
                                    {s?.icon || null} {s?.localized ? t(s?.localized) : s?.title}
                                </div>
                            </div>
                        </TabItem>
                    );
                });
            }
        }, [name, type, itemStyles, itemClassName, currentIndex]);

        return (
            <TabWrapper className={className} isBorderBottom={isBorderBottom}>
                {render()}
            </TabWrapper>
        );
    }
);

const TabWrapper = styled.div.attrs(({ isBorderBottom }) => ({
    className: `flex items-center space-x-8 select-none  overflow-y-hidden overflow-x-auto w-full ${
        isBorderBottom ? 'border-b border-divider dark:border-divider-dark' : ''
    }`
}))`
    ::-webkit-scrollbar {
        display: none;
    }
`;
const TabItem = styled.div.attrs(() => ({
    className: `relative `
}))`
    &::after {
        content: '';
        display: ${({ active }) => (active ? 'block' : 'none')};
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: ${() => colors.teal};
    }
`;

export default Tab;
