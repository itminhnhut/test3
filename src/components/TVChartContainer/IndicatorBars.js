import React from 'react';
import {getS3Url} from 'redux/actions/utils';

// [
//     "Accumulation/Distribution",
//     "Accumulative Swing Index",
//     "Advance/Decline",
//     "Arnaud Legoux Moving Average",
//     "Aroon",
//     "Average Directional Index",
//     "Average True Range",
//     "Awesome Oscillator",
//     "Balance of Power",
//     "Bollinger Bands",
//     "Bollinger Bands %B",
//     "Bollinger Bands Width",
//     "Chaikin Money Flow",
//     "Chaikin Oscillator",
//     "Chande Kroll Stop",
//     "Chande Momentum Oscillator",
//     "Chop Zone",
//     "Choppiness Index",
//     "Commodity Channel Index",
//     "Connors RSI",
//     "Coppock Curve",
//     "Correlation Coeff",
//     "Detrended Price Oscillator",
//     "Directional Movement Index",
//     "Donchian Channels",
//     "Double Exponential Moving Average",
//     "Ease of Movement",
//     "Elders Force Index",
//     "EMA Cross",
//     "Envelope",
//     "Fisher Transform",
//     "Historical Volatility",
//     "Hull MA",
//     "Ichimoku Cloud",
//     "Keltner Channels",
//     "Klinger Oscillator",
//     "Know Sure Thing",
//     "Least Squares Moving Average",
//     "Linear Regression Curve",
//     "MA Cross",
//     "MA with EMA Cross",
//     "Mass Index",
//     "McGinley Dynamic",
//     "Momentum",
//     "Money Flow",
//     "Moving Average",
//     "Moving Average Channel",
//     "MACD",
//     "Moving Average Exponential",
//     "Moving Average Weighted",
//     "Net Volume",
//     "On Balance Volume",
//     "Parabolic SAR",
//     "Price Channel",
//     "Price Oscillator",
//     "Price Volume Trend",
//     "Rate Of Change",
//     "Relative Strength Index",
//     "Relative Vigor Index",
//     "Relative Volatility Index",
//     "SMI Ergodic Indicator/Oscillator",
//     "Smoothed Moving Average",
//     "Stochastic",
//     "Stochastic RSI",
//     "TRIX",
//     "Triple EMA",
//     "True Strength Indicator",
//     "Ultimate Oscillator",
//     "VWAP",
//     "VWMA",
//     "Volume Oscillator",
//     "Vortex Indicator",
//     "Willams %R",
//     "Williams Alligator",
//     "Williams Fractals",
//     "Volume",
//     "Zig Zag",
//     "SuperTrend",
//     "Pivot Points Standard",
//     "Spread",
//     "Ratio"
// ]

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

const IndicatorBars = ({setCollapse, collapse, setMainIndicator, mainIndicator, setSubIndicator, subIndicator}) => {
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
                {mainIndicators.map(item => (
                    <div
                        className={mainIndicator === item.value ? 'text-teal' : ''}
                        onClick={() => setIndicator(item.value, 'main')}>{item.label}</div>
                ))}
                |
                {subIndicators.map(item => (
                    <div className={subIndicator === item.value ? 'text-teal' : ''}
                         onClick={() => setIndicator(item.value, 'sub')}>{item.label}</div>
                ))}
            </div>
            {setCollapse &&
            <img
                onClick={onCollapse}
                src={getS3Url(`/images/icon/ic_maximun${collapse ? '_active' : ''}.png`)}
                height={24} width={24}
            />
            }
        </div>
    );
};


export default IndicatorBars;
