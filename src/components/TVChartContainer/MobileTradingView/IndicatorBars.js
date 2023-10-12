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
    const setIndicator = (item, key, active) => {
        let value = '';
        if (key === 'main') {
            value = active > -1 ? active : item.value;
            setMainIndicator(value, item);
        } else {
            value = active > -1 ? active : item.value;
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
                {mainIndicators.map((item) => {
                    const active = mainIndicator.findIndex((m) => m.name === item.value);
                    return (
                        <div
                            key={item.value}
                            className={active > -1 ? 'text-txtPrimary dark:text-txtPrimary-dark' : ''}
                            onClick={() => setIndicator(item, 'main', active)}
                        >
                            {item.label}
                        </div>
                    );
                })}
                <div className="bg-divider dark:bg-divider-dark w-[2px] h-4" />
                {subIndicators.map((item) => {
                    const active = subIndicator.findIndex((m) => m.name === item.value);
                    return (
                        <div
                            key={item.value}
                            className={active > -1 ? 'text-txtPrimary dark:text-txtPrimary-dark' : ''}
                            onClick={() => setIndicator(item, 'sub', active)}
                        >
                            {item.label}
                        </div>
                    );
                })}
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
