import React, {useState, useTransition} from 'react';
import {getS3Url} from 'redux/actions/utils';
import SvgActivity from "components/svg/Activity";
import {Maximize2, Search, X} from "react-feather";
import colors from "styles/colors";
import Maximize from "components/svg/Maximize";

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
            className='h-[38px] flex items-center justify-between px-[10px] border-b border-t border-onus-line'>
            <div
                className='flex items-center text-xs text-onus-grey font-medium justify-around w-full mr-[10px]'>
                <div onClick={handleOpenIndicatorModal}>
                    <SvgActivity color={colors.onus.green}/>
                </div>
                {mainIndicators.map(item => (
                    <div
                        key={item.value}
                        className={mainIndicator === item.value ? 'text-onus-green' : ''}
                        onClick={() => setIndicator(item.value, 'main')}>{item.label}</div>
                ))}
                <div className='bg-onus-line w-[2px] h-4'/>
                {subIndicators.map(item => (
                    <div
                        key={item.value}
                        className={subIndicator === item.value ? 'text-onus-green' : ''}
                        onClick={() => setIndicator(item.value, 'sub')}>{item.label}</div>
                ))}
            </div>
            <Maximize onClick={onCollapse} color={collapse ? colors.onus.green : colors.onus.gray}/>
        </div>
    );
}


export default IndicatorBars;
