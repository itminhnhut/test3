import React, { useState, useTransition } from 'react';
import SvgActivity from 'components/svg/Activity';
import colors from 'styles/colors';
import Reload from 'components/svg/Reload';
import { IconFullScreenChart } from 'components/common/Icons';
import classnames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

export const mainIndicators = [
    {
        value: 'Moving Average',
        label: 'MA',
        input: [[7], [34], [89]]
    },
    {
        value: 'Moving Average Exponential',
        label: 'EMA',
        overrides: [{ 'ma.color': '#4021D0' }, { 'ma.color': '#E4758F' }, { 'ma.color': '#EDAF54' }],
        input: [[7], [34], [89]]
    },
    {
        value: 'Bollinger Bands',
        label: 'BOLL'
    }
];
export const subIndicators = [
    {
        value: 'Volume',
        label: 'VOL'
    },
    {
        value: 'MACD',
        label: 'MACD'
    },
    {
        value: 'Relative Strength Index',
        label: 'RSI'
    }
    // 'KDJ'
];

const IndicatorBars = ({
    handleOpenIndicatorModal,
    setMainIndicator,
    mainIndicator,
    setSubIndicator,
    subIndicator,
    resetComponent,
    fullChart,
    setFullChart,
    isDetail
}) => {
    const setIndicator = (item, key) => {
        let value = '';
        if (key === 'main') {
            value = mainIndicator === item.value ? '' : item.value;
            setMainIndicator(value, item);
        } else {
            value = subIndicator === item.value ? '' : item.value;
            setSubIndicator(value, item);
        }
    };
    const [currentTheme] = useDarkMode();

    return (
        <div
            className={classnames(`h-[38px] flex items-center justify-between px-4`, {
                'border-t border-divider/70 dark:border-divider-dark/50': !fullChart,
                'border-b': isDetail
            })}
        >
            <div className="flex items-center text-xs text-txtSecondary dark:text-txtSecondary-dark font-medium justify-between w-full">
                <div onClick={handleOpenIndicatorModal}>
                    <SvgActivity color={currentTheme === THEME_MODE.DARK ? colors.gray[7] : colors.gray[1]} />
                </div>
                {mainIndicators.map((item) => (
                    <div
                        key={item.value}
                        className={mainIndicator === item.value ? 'text-txtPrimary dark:text-txtPrimary-dark' : ''}
                        onClick={() => setIndicator(item, 'main')}
                    >
                        {item.label}
                    </div>
                ))}
                <div className="bg-divider dark:bg-divider-dark w-[2px] h-4" />
                {subIndicators.map((item) => (
                    <div
                        key={item.value}
                        className={subIndicator === item.value ? 'text-txtPrimary dark:text-txtPrimary-dark' : ''}
                        onClick={() => setIndicator(item, 'sub')}
                    >
                        {item.label}
                    </div>
                ))}
                {isDetail ? (
                    <Reload onClick={resetComponent} color={currentTheme === THEME_MODE.DARK ? colors.gray[7] : colors.gray[1]} />
                ) : (
                    <div onClick={() => setFullChart(true)}>
                        <IconFullScreenChart color={currentTheme === THEME_MODE.DARK ? colors.gray[7] : colors.gray[1]} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndicatorBars;
