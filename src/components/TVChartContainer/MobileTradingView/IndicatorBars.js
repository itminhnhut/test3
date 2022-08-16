import React, { useState, useTransition } from 'react';
import SvgActivity from 'components/svg/Activity';
import colors from 'styles/colors';
import Reload from 'components/svg/Reload';
import { IconFullScreenChart } from 'components/common/Icons';

export const mainIndicators = [
    {
        value: 'Moving Average',
        label: 'MA'
    },
    {
        value: 'Moving Average Exponential',
        label: 'EMA'
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
    },
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
            value = mainIndicator === item ? '' : item;
            setMainIndicator(value);
        } else {
            value = subIndicator === item ? '' : item;
            setSubIndicator(value);
        }
    };

    return (
        <div
            className={`h-[38px] flex items-center justify-between px-4 ${!fullChart ? 'border-b border-t border-onus-line' : ''}`}>
            <div
                className="flex items-center text-xs text-onus-grey font-medium justify-between w-full">
                <div onClick={handleOpenIndicatorModal}>
                    <SvgActivity color={colors.onus.white} />
                </div>
                {mainIndicators.map(item => (
                    <div
                        key={item.value}
                        className={mainIndicator === item.value ? 'text-onus-white' : ''}
                        onClick={() => setIndicator(item.value, 'main')}>{item.label}</div>
                ))}
                <div className="bg-onus-line w-[2px] h-4" />
                {subIndicators.map(item => (
                    <div
                        key={item.value}
                        className={subIndicator === item.value ? 'text-onus-white' : ''}
                        onClick={() => setIndicator(item.value, 'sub')}>{item.label}</div>
                ))}
                {isDetail ?
                    <Reload onClick={resetComponent} color={colors.onus.white} />
                    :
                    <div onClick={() => setFullChart(true)}>
                        <IconFullScreenChart />
                    </div>
                }
            </div>
        </div>
    );
};

export default IndicatorBars;
