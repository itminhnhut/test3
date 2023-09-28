import React, { Fragment, useEffect, useMemo, useState, useContext } from 'react';
import { formatNumber, getS3Url, convertSymbol } from 'redux/actions/utils';
import { roundTo } from 'round-to';
import classNames from 'classnames';
import { Popover, Transition } from '@headlessui/react';
import ModelMarketMobile from 'components/screens/Nao_futures/Market/ModelMarket';
import { AreaChart, BarsChart, BaseLineChart, CandleChartOnus, LineChart } from '../timeFrame';
import { IconStarOnus, IconRefresh } from 'components/common/Icons';
import colors from 'styles/colors';
import { PublicSocketEvent, TRADING_MODE } from 'redux/actions/const';
import { favoriteAction } from 'redux/actions/user';
import { getFuturesFavoritePairs } from 'redux/actions/futures';
import { useDispatch, useSelector } from 'react-redux';
import Guideline from 'components/screens/Nao_futures/Futures/Guideline';
import styled from 'styled-components';
import useWindowSize from 'hooks/useWindowSize';
import Emitter from 'redux/actions/emitter';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import SvgActivity from 'components/svg/Activity';
import { X } from 'react-feather';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { useTranslation } from 'next-i18next';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const listChartType = [
    {
        text: 'Bar',
        value: 0,
        icon: BarsChart
    },
    {
        text: 'Candle',
        value: 1,
        icon: CandleChartOnus
    },
    {
        text: 'Line',
        value: 2,
        icon: LineChart
    },
    {
        text: 'Area',
        value: 3,
        icon: AreaChart
    },
    {
        text: 'Base Line',
        value: 10,
        icon: BaseLineChart
    }
];

export const listTimeFrame = [
    {
        value: '1',
        text: '1m'
    },
    {
        value: '5',
        text: '5m'
    },
    {
        value: '15',
        text: '15m'
    },
    {
        value: '30',
        text: '30m'
    },
    {
        value: '60',
        text: '1h'
    },
    {
        value: '240',
        text: '4h'
    },
    {
        value: '1D',
        text: '1D'
    },
    {
        value: '1W',
        text: '1W'
    },
    {
        value: '1M',
        text: '1M'
    }
];

const ChartOptions = ({
    pairConfig,
    pair,
    isVndcFutures,
    resolution,
    setResolution,
    chartType,
    setChartType,
    className = '',
    isFullScreen,
    showSymbol = true,
    showIconGuide = true,
    pairParent,
    fullChart,
    setFullChart,
    resetComponent,
    handleOpenIndicatorModal
}) => {
    const { width } = useWindowSize();
    const xs = width < 390;
    // if (!pairConfig) return null;
    const [showModelMarket, setShowModelMarket] = useState(false);
    const [start, setStart] = useState(false);

    const labelCandle = listChartType.find((item) => item.value === chartType) || '';

    const resolutionLabel = useMemo(() => {
        return listTimeFrame.find((item) => item.value == resolution)?.text;
    }, [resolution]);

    return (
        <div className={`${className} chart-timer flex items-center justify-between px-4`}>
            <Guideline pair={pair} start={start} setStart={setStart} isFullScreen={isFullScreen} />
            <div className="flex items-center space-x-1">
                {showSymbol && (
                    <>
                        <div className="flex items-center flex-wrap gap-2">
                            <div className="flex items-center cursor-pointer" data-tut="order-symbol" onClick={() => setShowModelMarket(true)}>
                                {/* {!xs && <img className="mr-2 min-w-[24px] min-h-[24px]"
                                src={getS3Url(`/images/coins/64/${pairConfig?.baseAssetId}.png`)} height={24}
                                width={24} />} */}
                                <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark ">
                                    {(pairConfig?.baseAsset ?? '-') + '/' + (pairConfig?.quoteAsset ?? '-')}
                                </div>
                            </div>
                            <Change24h pairConfig={pairConfig} isVndcFutures={isVndcFutures} />
                        </div>
                        <PriceAlert pairConfig={pairConfig} />
                    </>
                )}
            </div>

            <div className={`flex items-center space-x-${xs ? '2' : '4'} py-2`}>
                <MenuTime
                    value={resolution}
                    onChange={setResolution}
                    keyValue="value"
                    displayValue="text"
                    options={listTimeFrame}
                    classNamePanel="rounded-md"
                    label={<div className="text-[0.9375rem] text-txtSecondary dark:text-txtSecondary-dark leading-[1.25rem]">{resolutionLabel}</div>}
                />
                <MenuTime
                    value={chartType}
                    onChange={setChartType}
                    keyValue="value"
                    displayValue="text"
                    options={listChartType}
                    classNamePanel="rounded-md left-[-20px]"
                    label={<Svg>{labelCandle.icon}</Svg>}
                />
                {/* {showIconGuide &&
                    <div className="" onClick={() => setStart(true)}>
                        <IconHelper/>
                    </div>
                } */}
                <div className="text-txtSecondary dark:text-txtSecondary-dark" onClick={fullChart ? handleOpenIndicatorModal : resetComponent}>
                    {!fullChart ? <IconRefresh color="currentColor" /> : <SvgActivity color="currentColor" />}
                </div>
                <FavouriteButton pair={pair} pairConfig={pairConfig} />
                {fullChart && <X size={20} onClick={() => setFullChart(false)} className="cursor-pointer !ml-10" />}
            </div>
            <ModelMarketMobile pairConfig={pairConfig} visible={showModelMarket} onClose={() => setShowModelMarket(false)} pair={pair} />
        </div>
    );
};

const Change24h = ({ pairConfig, isVndcFutures }) => {
    const [pairPrice, setPairPrice] = useState(null);
    const [lastSymbol, setLastSymbol] = useState(null);
    const symbol = convertSymbol(pairConfig?.symbol);

    useEffect(() => {
        if (pairConfig?.symbol !== lastSymbol) {
            setLastSymbol(pairConfig?.symbol);
            setPairPrice(null);
        }
    }, [pairConfig]);

    useEffect(() => {
        if (!pairConfig) return;
        // ? Subscribe publicSocket
        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol, async (data) => {
            const _pairPrice = FuturesMarketWatch.create(data, pairConfig?.quoteAsset);
            if (symbol === _pairPrice?.symbol && _pairPrice?.lastPrice > 0) {
                setPairPrice(_pairPrice);
            }
        });
        return () => {
            // Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + pairConfig.symbol);
        };
    }, [pairConfig]);

    return (
        <div className="flex items-center">
            <div
                className={classNames('text-green-2 font-medium', {
                    '!text-red-2': pairPrice?.priceChangePercent < 0
                })}
            >
                {pairPrice?.priceChangePercent < 0 ? '' : '+'}
                {formatNumber(roundTo(pairPrice?.priceChangePercent * 100 || 0, 2), 2, 2, true)}%
            </div>
        </div>
    );
};

export const MenuTime = ({ value, onChange, options, label, keyValue, displayValue, classNameButton, classNamePanel }) => {
    return (
        <Popover className="relative">
            {({ open, close }) => (
                <>
                    <Popover.Button className={`items-center flex ${classNameButton} text-txtSecondary-dark`}>{label}</Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className={`absolute z-50 bg-gray-12 dark:bg-dark-2 ${classNamePanel}`}>
                            <div className="overflow-y-auto px-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                                {options?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                onChange(item[keyValue]);
                                                close();
                                            }}
                                            className={classNames(
                                                'pb-2 w-max text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-pointer flex items-center',
                                                {
                                                    '!text-txtPrimary dark:!text-txtPrimary-dark': item[keyValue] === value
                                                }
                                            )}
                                        >
                                            <Svg className={`!fill-fillSecondary dark:!fill-fillSecondary-dark`}>{item?.icon}</Svg>
                                            {item[displayValue]}
                                        </div>
                                    );
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

const Svg = styled.div.attrs({
    className: `fill-fillPrimary dark:fill-fillPrimary-dark`
})`
    svg {
        height: 20px;
        width: 20px;
        fill: inherit;
    }
`;

const FavouriteButton = ({ pairConfig }) => {
    const favoritePairs = useSelector((state) => state.futures.favoritePairs);
    const dispatch = useDispatch();

    const pair = pairConfig?.baseAsset + '_' + pairConfig?.quoteAsset;
    const isFavorite = useMemo(() => favoritePairs.includes(pair), [favoritePairs, pairConfig]);

    const handleSetFavorite = async () => {
        await favoriteAction(isFavorite ? 'delete' : 'put', TRADING_MODE.NAO, pair);
        dispatch(getFuturesFavoritePairs(TRADING_MODE.NAO));
    };

    return (
        <div className="cursor-pointer flex items-center text-txtSecondary dark:text-txtSecondary-dark" onClick={handleSetFavorite}>
            <IconStarOnus stroke={isFavorite ? colors.yellow[2] : 'currentColor'} color={isFavorite ? colors.yellow[2] : ''} />
        </div>
    );
};

const PriceAlert = ({ pairConfig }) => {
    const context = useContext(AlertContext);
    const { t } = useTranslation();
    const KEY = 'PRICE_ALERT_EXPIRE';

    const getExpire = () => {
        const store = localStorage.getItem(KEY);
        return store ? JSON.parse(store)?.[pairConfig?.symbol] : null;
    };

    useEffect(() => {
        const expire = getExpire();
        let isShowAlert = true;
        if (expire) {
            const diffTimeStamp = Date.now() - expire;
            // const diffHours = diffTimeStamp / (1000 * 60 * 60);
            // isShowAlert = diffHours >= 8;
            const diffMinutes = diffTimeStamp / (1000 * 60);
            console.log(`${pairConfig?.symbol}_${diffMinutes}_${formatDistanceToNow(+expire)}`);
            isShowAlert = diffMinutes >= 5;
        }
        if (pairConfig?.isLowLiquidity && isShowAlert) showAlert();
    }, [pairConfig]);

    const onConfirm = () => {
        const store = localStorage.getItem(KEY);
        localStorage.setItem(
            KEY,
            JSON.stringify({
                ...(store ? JSON.parse(store) : {}),
                [pairConfig?.symbol]: Date.now()
            })
        );
    };

    const showAlert = () => {
        context.alert.show('warning', 'Cảnh báo giá', t('error:futures:NETWORK_ERROR'), null, onConfirm, null, {
            hideCloseButton: true,
            confirmTitle: t('futures:mobile:warning:understood'),
            noUseOutside: true
        });
    };

    return (
        <svg onClick={showAlert} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.962 4.2a.72.72 0 0 0-.72.72v2.974a.72.72 0 0 0 1.44 0V4.92a.719.719 0 0 0-.72-.72zm.003 5.693h-.01c-.53 0-.955.43-.955.96s.434.96.965.96a.96.96 0 1 0 0-1.92zm0 0h-.01c-.53 0-.955.43-.955.96s.434.96.965.96a.96.96 0 1 0 0-1.92zm-.003-1.28c.399 0 .72-.321.72-.72V4.92a.719.719 0 1 0-1.44 0v2.974c0 .398.324.72.72.72zm.003 1.28h-.01c-.53 0-.955.43-.955.96s.434.96.965.96a.96.96 0 1 0 0-1.92zm-.003-1.28c.399 0 .72-.321.72-.72V4.92a.719.719 0 1 0-1.44 0v2.974c0 .398.324.72.72.72z"
                fill="#FFC632"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 14.8A6.8 6.8 0 1 0 8 1.2a6.8 6.8 0 0 0 0 13.6zM8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                fill="#FFC632"
            />
        </svg>
    );
};

export default ChartOptions;
