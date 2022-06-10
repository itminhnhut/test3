import React, {useState, useTransition} from 'react';
import {getS3Url} from 'redux/actions/utils';
import SvgActivity from "components/svg/Activity";
import {Search, X} from "react-feather";

export const mainIndicators = [
    {value: 'Moving Average', label: 'MA'},
    {value: 'Moving Average Exponential', label: 'EMA'},
    {value: 'Bollinger Bands', label: 'BOLL'}
];
export const subIndicators = [
    {value: 'Volume', label: 'VOL'},
    {value: 'MACD', label: 'MACD'},
    {value: 'Relative Strength Index', label: 'RSI'},
    // 'KDJ'
];

const IndicatorBars = ({
                           handleOpenIndicatorModal,
                           setCollapse,
                           collapse,
                           setMainIndicator,
                           mainIndicator,
                           setSubIndicator,
                           subIndicator,
                       }) => {
    const setIndicator = (item, key) => {
        let value = '';
        if (key === 'main') {
            value = mainIndicator === item ? '' : item;
            setMainIndicator(value)
        } else {
            value = subIndicator === item ? '' : item;
            setSubIndicator(value)
        }
    }

    const onCollapse = () => {
        setTimeout(() => {
            setCollapse(!collapse)
        }, 300);
    }

    return (
        <div
            className='h-[38px] flex items-center justify-between px-[10px] border-b border-t border-gray-4 dark:border-divider-dark'>
            <div
                className='flex items-center text-xs text-gray-1 dark:text-txtSecondary-dark font-medium justify-around w-full mr-[10px]'>
                <div onClick={handleOpenIndicatorModal}>
                    <SvgActivity/>
                </div>
                {mainIndicators.map(item => (
                    <div
                        key={item.value}
                        className={mainIndicator === item.value ? 'text-teal' : ''}
                        onClick={() => setIndicator(item.value, 'main')}>{item.label}</div>
                ))}
                |
                {subIndicators.map(item => (
                    <div
                        key={item.value}
                        className={subIndicator === item.value ? 'text-teal' : ''}
                        onClick={() => setIndicator(item.value, 'sub')}>{item.label}</div>
                ))}
            </div>
            {setCollapse && <img
                onClick={onCollapse}
                src={getS3Url(`/images/icon/ic_maximun${collapse ? '_active' : ''}.png`)}
                height={24} width={24}/>
            }
        </div>
    );
}


export default IndicatorBars;
