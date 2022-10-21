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

export const TAB_TYPE = {
    TYPE1: 'type1',
}

const Tab = memo(({
                      type = TAB_TYPE.TYPE1,
                      name = '',
                      series,
                      currentIndex,
                      onChangeTab,
                      tArr = [],
                      itemStyles = null,
                      isBorderBottom=true,
                      itemClassName = null }) => {

    if (!Array.isArray(series)) {
        log.e('Invalid series or Type Error')
        return null
    }

    if (!series?.length) {
        log.e('Empty array')
        return null
    }

    const { t } = useTranslation(['tab', ...tArr])

    const render = useCallback(() => {
        if (type === TAB_TYPE.TYPE1) {
            let className = 'relative pb-4 font-medium cursor-pointer mr-7 whitespace-nowrap hover:text-txtPrimary dark:hover:text-txtPrimary-dark '
            if (itemClassName) {
                className = className + itemClassName
            }

            const inactive = 'text-txtSecondary dark:text-txtSecondary-dark '
            const active = 'font-bold text-txtPrimary dark:text-txtPrimary-dark '

            return series.map(s => {
                return (
                    <div key={`tab_${name}__${s?.key}`}
                         style={itemStyles ? {...itemStyles} : undefined}
                         onClick={() => {
                             onChangeTab && onChangeTab(s?.key)
                         }}>
                        <div className={s?.key === currentIndex ? className + active : className + inactive}>
                            <div className="flex items-center text-sm lg:text-md">
                                {s?.icon || null} {s?.localized ? t(s?.localized) : s?.title}
                            </div>
                            {s?.key === currentIndex && <div className="absolute bg-dominant w-[40px] xl:w-[50px] left-1/2 top-[95%] -translate-x-1/2 h-[2px]"/>}
                        </div>
                    </div>
                )
            })
        }
    }, [name, type, itemStyles, itemClassName, currentIndex])

    return <TabWrapper isBorderBottom={isBorderBottom}>{render()}</TabWrapper>
})

const TabWrapper = styled.div.attrs(({ isBorderBottom }) =>({
    className: `flex items-center select-none  overflow-y-hidden overflow-x-auto ${isBorderBottom ? 'border-b border-divider dark:border-divider-dark' :''}` }))`
  ::-webkit-scrollbar {
    display: none;
  }
`

// const Label = styled.div.attrs(({ isTabOpen }) => ({
//     className: `text-gray-1 text-left text-onus-grey ${isTabOpen ? 'text-xs' : 'text-sm'} font-normal`
// }))``;


export default Tab
