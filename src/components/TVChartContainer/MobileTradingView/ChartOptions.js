import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout';
import {formatNumber, getS3Url} from 'redux/actions/utils';
import {roundTo} from 'round-to';
import classNames from 'classnames';
import {Popover, Transition} from "@headlessui/react";
import ModelMarketMobile from "components/screens/Mobile/Market/ModelMarket";
import {AreaChart, BarsChart, BaseLineChart, CandleChart, LineChart} from '../timeFrame'
import {IconStar, IconStarFilled} from "components/common/Icons";
import colors from "styles/colors";
import {TRADING_MODE} from "redux/actions/const";
import {favoriteAction} from "redux/actions/user";
import {getFuturesFavoritePairs} from "redux/actions/futures";
import {useDispatch, useSelector} from "react-redux";
import Guideline from 'components/screens/Mobile/Futures/Guideline';
import styled from 'styled-components';

const listChartType = [
    {text: 'Bar', value: 0, icon: BarsChart},
    {text: 'Candle', value: 1, icon: CandleChart},
    {text: 'Line', value: 2, icon: LineChart},
    {text: 'Area', value: 3, icon: AreaChart},
    {text: 'Base Line', value: 10, icon: BaseLineChart},
];

export const listTimeFrame = [
    {value: '1', text: '1m'},
    {value: '5', text: '5m'},
    {value: '15', text: '15m'},
    {value: '30', text: '30m'},
    {value: '60', text: '1h'},
    {value: '240', text: '4h'},
    {value: '1D', text: '1D'},
    {value: '1W', text: '1W'},
    {value: '1M', text: '1M'},
];

const ChartOptions = ({
                          pairConfig, pair, isVndcFutures, resolution, setResolution,
                          chartType, setChartType, className = '', isFullScreen, showSymbol = true,
                          showIconGuide = true, pairParent
                      }) => {

    if (!pairConfig) return null;
    const [showModelMarket, setShowModelMarket] = useState(false)
    const [start, setStart] = useState(false);

    const labelCandle = listChartType.find(item => item.value === chartType) || '';

    const resolutionLabel = useMemo(() => {
        return listTimeFrame.find(item => item.value == resolution)?.text
    }, [resolution])

    return (
        <div className={`${className} chart-timer flex items-center justify-between px-4`}>
            <Guideline pair={pair} start={start} setStart={setStart} isFullScreen={isFullScreen}/>
            <div className="flex items-center">
                {showSymbol &&
                <div className="flex items-center flex-wrap">
                    <div className="flex items-center cursor-pointer" data-tut="order-symbol"
                         onClick={() => setShowModelMarket(true)}>
                        <img src={getS3Url('/images/icon/ic_exchange_mobile.png')} height={16} width={16}/>
                        <div
                            className="px-2 font-semibold text-sm">{pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}</div>
                    </div>
                    <SocketLayout pairConfig={pairConfig} pair={pair} pairParent={pairParent}>
                        <Change24h pairConfig={pairConfig} isVndcFutures={isVndcFutures}/>
                    </SocketLayout>
                </div>
                }
                {showIconGuide &&
                <div className="px-2" onClick={() => setStart(true)}>
                    <img src={getS3Url('/images/icon/ic_help.png')} height={24} width={24}/>
                </div>
                }
            </div>

            <div className="flex items-center">
                <MenuTime
                    value={resolution}
                    onChange={setResolution}
                    keyValue="value"
                    displayValue="text"
                    options={listTimeFrame}
                    classNameButton="px-2 py-2"
                    classNamePanel="rounded-md"
                    label={<div
                        className="text-sm text-gray-1 dark:text-txtSecondary-dark font-normal">{resolutionLabel}</div>}
                />
                <MenuTime
                    value={chartType}
                    onChange={setChartType}
                    keyValue="value"
                    displayValue="text"
                    options={listChartType}
                    classNameButton="px-2 py-2"
                    classNamePanel="rounded-md left-[-20px]"
                    label={<Svg>{labelCandle.icon}</Svg>}
                />
                <FavouriteButton pair={pair} pairConfig={pairConfig}/>
            </div>
            <ModelMarketMobile
                visible={showModelMarket}
                onClose={() => setShowModelMarket(false)}
            />
        </div>
    );
};

const Change24h = ({pairPrice, isVndcFutures}) => {

    return (
        <div className='flex items-center'>
            <div
                className={classNames('pl-2 text-dominant font-medium text-sm',
                    {
                        '!text-red':
                            pairPrice?.priceChangePercent < 0,
                    })}
            >
                {pairPrice?.priceChangePercent < 0 ? '' : '+'}
                {formatNumber(
                    roundTo(
                        pairPrice?.priceChangePercent * (isVndcFutures ? 100 : 1) || 0,
                        2
                    ),
                    2,
                    2,
                    true
                )}
                %
            </div>
        </div>
    )

}


export const MenuTime = ({value, onChange, options, label, keyValue, displayValue, classNameButton, classNamePanel}) => {
    return (
        <Popover className="relative">
            {({open, close}) => (
                <>
                    <Popover.Button className={`flex ${classNameButton} text-gray-1 dark:text-txtSecondary-dark`}>
                        {label}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className={`absolute z-50 bg-white dark:bg-bgPrimary-dark ${classNamePanel}`}>
                            <div
                                className="overflow-y-auto px-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                                {options?.map(item => {
                                    return (
                                        <div onClick={() => {
                                            onChange(item[keyValue])
                                            close()
                                        }}
                                             className={classNames(
                                                 'pb-2 w-max text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-pointer flex items-center',
                                                 {
                                                     '!text-txtPrimary dark:!text-txtPrimary-dark':
                                                         item[keyValue] === value,
                                                 }
                                             )}
                                        >
                                            <Svg>{item?.icon}</Svg>
                                            {item[displayValue]}
                                        </div>
                                    )
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

const Svg = styled.div.attrs({
    className: ''
})`
    svg {
        height: 24px;
        width: 24px
    }
`

const FavouriteButton = ({pairConfig}) => {
    const favoritePairs = useSelector((state) => state.futures.favoritePairs)
    const dispatch = useDispatch();

    const pair = pairConfig?.baseAsset + '_' + pairConfig?.quoteAsset
    const isFavorite = useMemo(() => favoritePairs.includes(pair), [favoritePairs, pairConfig])

    const handleSetFavorite = async () => {
        await favoriteAction(isFavorite ? 'delete' : 'put', TRADING_MODE.FUTURES, pair)
        dispatch(getFuturesFavoritePairs())
    }

    return <div className='px-2 py-2 cursor-pointer' onClick={handleSetFavorite}>
        {isFavorite ? <IconStarFilled size={16} color={colors.yellow}/> :
            <IconStar color="#718096" strokeWidth={0.5} size={18}/>}
    </div>
}

export default ChartOptions;
