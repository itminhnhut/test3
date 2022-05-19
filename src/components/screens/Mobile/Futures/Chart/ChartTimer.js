import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout';
import {formatNumber, getS3Url} from 'redux/actions/utils';
import {roundTo} from 'round-to';
import classNames from 'classnames';
import ms from "ms";
import {listTimeFrame} from "components/KlineChart/kline.service";
import {Popover, Transition} from "@headlessui/react";
import ModelMarketMobile from "components/screens/Mobile/Market/ModelMarket";
import { AreaChart, CandleChart, LineChart } from '../../../../TVChartContainer/timeFrame'
import {IconStar, IconStarFilled} from "components/common/Icons";
import colors from "styles/colors";
import fetchAPI from "utils/fetch-api";
import {API_GET_FAVORITE} from "redux/actions/apis";
import {TRADING_MODE} from "redux/actions/const";
import {favoriteAction} from "redux/actions/user";
import {LANGUAGE_TAG} from "hooks/useLanguage";
import showNotification from "utils/notificationService";
import {useTranslation} from "next-i18next";
import {getFuturesFavoritePairs} from "redux/actions/futures";
import {useDispatch, useSelector} from "react-redux";

const candleList = [
    { value: 'candle_solid', text: 'Candle', icon: CandleChart },
    // { value: 'candle_stroke', text: 'Stroke', icon: AreaChart },
    // { value: 'candle_up_stroke', text: 'Up Stroke', icon: AreaChart },
    // { value: 'candle_down_stroke', text: 'Down Stroke', icon: AreaChart },
    { value: 'ohlc', text: 'Bar', icon: LineChart },
    { value: 'area', text: 'Area', icon: AreaChart }
]
const ChartTimer = ({
    pairConfig, pair, isVndcFutures, resolution, setResolution,
    candle, setCandle
}) => {

    if (!pairConfig) return null;
    const [showModelMarket, setShowModelMarket] = useState(false)

    const labelCandle = candleList.find(item => item.value === candle);
    return (
        <div className="min-h-[64px] chart-timer flex items-center justify-between px-[10px]">
            <div className="flex items-center cursor-pointer" onClick={() => setShowModelMarket(true)} >
                <div className="flex items-center " data-tut="order-symbol">
                    <img src={getS3Url('/images/icon/ic_exchange_mobile.png')} height={16} width={16} />
                    <div className="pl-[10px] font-semibold text-sm">{pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}</div>
                </div>
                <SocketLayout pairConfig={pairConfig} pair={pair} >
                    <Change24h pairConfig={pairConfig} isVndcFutures={isVndcFutures} />
                </SocketLayout>
            </div>
            <div className="flex items-center" >
                <MenuTime
                    value={resolution}
                    onChange={setResolution}
                    keyValue="value"
                    displayValue="text"
                    options={listTimeFrame}
                    classNameButton="px-[10px]"
                    label={<div className="uppercase text-sm text-gray font-medium">{ms(resolution)}</div>}
                />
                <MenuTime
                    value={candle}
                    onChange={setCandle}
                    keyValue="value"
                    displayValue="text"
                    options={candleList}
                    classNameButton="pl-[10px]"
                    classNamePanel="right-[-10px]"
                    label={labelCandle.icon}
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
                className={classNames('pl-2 text-dominant font-medium',
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



const MenuTime = ({ value, onChange, options, label, keyValue, displayValue, classNameButton, classNamePanel }) => {
    return (
        <Popover className="relative">
            {({open, close}) => (
                <>
                    <Popover.Button className={`flex ${classNameButton} dark:text-txtSecondary-dark`}>
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
                                            {item?.icon}
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

const FavouriteButton = ({pairConfig}) => {
    const favoritePairs = useSelector((state) => state.futures.favoritePairs)
    const dispatch = useDispatch();

    const pair = pairConfig?.baseAsset + '_' + pairConfig?.quoteAsset
    const isFavorite = useMemo(() => favoritePairs.includes(pair),[favoritePairs, pairConfig])

    const handleSetFavorite = async () => {
        await favoriteAction(isFavorite ? 'delete' : 'put', TRADING_MODE.FUTURES, pair)
        dispatch(getFuturesFavoritePairs())
    }

    return <div className='ml-4 cursor-pointer' onClick={handleSetFavorite}>
        {isFavorite ? <IconStarFilled size={16} color={colors.yellow}/> : <IconStar size={16}/>}
    </div>
}

export default ChartTimer;
