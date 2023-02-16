import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
    formatNumber,
    formatPrice,
    getDecimalScale,
    getFilter,
    getS3Url,
    secondToMinutesAndSeconds,
    formatFundingRate,
    RefCurrency
} from 'redux/actions/utils';
import Countdown from 'react-countdown-now';
import { usePrevious } from 'react-use';
import { ChevronDown, X } from 'react-feather';
import { roundTo } from 'round-to';

import FuturesPairDetailItem from './PairDetailItem';
import FuturesPairList from '../PairList';
import InfoSlider from 'components/markets/InfoSlider';
import classNames from 'classnames';
import styled from 'styled-components';
import Tooltip from 'components/common/Tooltip';
import Modal from 'components/common/ReModal';
import { ExchangeOrderEnum } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import useDarkMode from 'hooks/useDarkMode';
import ModalV2 from 'components/common/V2/ModalV2';
import { ArrowDropDownIcon, BxsBookIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const getPairPrice = createSelector([(state) => state.futures, (state, pair) => pair], (futures, pair) => futures.marketWatch[pair]);

const FuturesPairDetail = ({ pairPrice, markPrice, pairConfig, forceUpdateState, isVndcFutures, isAuth }) => {
    // ? Xử lí minW để khi giá thay đổi, giao diện này sẽ không bị xê dịch.
    // ? Nguyên nhân: Font sida (;_;)
    const [itemsPriceMinW, setItemsPriceMinW] = useState(0);
    const [lastPriceMinW, setLastPriceMinW] = useState(0);

    const [activePairList, setActivePairList] = useState(false);
    const [pairListMode, setPairListMode] = useState('');
    const [isShowModalInfo, setIsShowModalInfo] = useState(false);
    const [isShowModalPriceList, setIsShowModalPriceList] = useState(false);
    // state, vars for information modal (Trading rules)
    const [currentSelectedPair, setCurrentSelectedPair] = useState(pairConfig);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const pair = currentSelectedPair?.symbol || currentSelectedPair;
    const priceFromMarketWatch = useSelector((state) => getPairPrice(state, pair));
    const timesync = useSelector((state) => state.utils.timesync);
    const _pairPrice = priceFromMarketWatch || pairPrice;
    const lastPrice = _pairPrice?.lastPrice;
    const [showPopover, setShowPopover] = useState(false);
    const isFunding = useRef(true);
    const router = useRouter();
    const { t } = useTranslation();

    // ? Helper
    const itemsPriceRef = useRef();
    const lastPriceRef = useRef();
    const pairListRef = useRef();
    const pairListModalRef = useRef();
    const prevLastPrice = usePrevious(pairPrice?.lastPrice);
    const prevLastPriceModal = usePrevious(priceFromMarketWatch?.lastPrice);
    const [currentTheme] = useDarkMode();

    const currentExchangeConfig = useMemo(() => {
        if (!currentSelectedPair && !currentSelectedPair?.symbol) return;
        const symbol = currentSelectedPair?.symbol || currentSelectedPair;
        const config = allPairConfigs.find((e) => e.symbol === symbol);

        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, config || []);
        const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, config || []);
        const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, config || []);
        const maxNumberVolumeFilter = getFilter(ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME, config || []);
        const maxNumOrderFilter = getFilter(ExchangeOrderEnum.Filter.MAX_NUM_ORDERS, config || []);
        const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, config || []);

        return {
            config,
            priceFilter,
            quantityFilter,
            minNotionalFilter,
            maxNumOrderFilter,
            maxNumberVolumeFilter,
            percentPriceFilter
        };
    }, [allPairConfigs, currentSelectedPair]);

    // ? Memmoized Var
    const pricePrecision = useMemo(
        () => currentExchangeConfig?.config?.pricePrecision || pairConfig?.pricePrecision || 0,
        [pairConfig?.pricePrecision, currentExchangeConfig?.config?.pricePrecision]
    );

    // ? Render lastPrice
    const renderLastPrice = useCallback(
        (isShownOnModal = false) => {
            const className = isShownOnModal
                ? 'text-[22px] leading-[30px] text-teal font-semibold text-right'
                : 'font-bold text-left text-sm text-dominant dragHandleArea tracking-wide';
            return (
                <div
                    ref={lastPriceRef}
                    // style={{ minWidth: lastPriceMinW }}
                    style={{ minWidth: 82 }}
                    className={classNames(className, {
                        '!text-red': !isShownOnModal ? pairPrice?.lastPrice < prevLastPrice : priceFromMarketWatch?.lastPrice < prevLastPriceModal
                    })}
                >
                    <div>
                        {formatNumber(
                            roundTo(!isShownOnModal ? pairPrice?.lastPrice || 0 : priceFromMarketWatch?.lastPrice || 0, pricePrecision),
                            pricePrecision,
                            lastPriceMinW !== undefined ? 0 : pricePrecision
                        )}
                    </div>
                    {!isShownOnModal && (
                        <span className="text-txtSecondary dark:text-txtSecondary-dark text-xs">
                            <RefCurrency price={pairPrice?.lastPrice} quoteAsset={pairPrice?.quoteAsset} />
                        </span>
                    )}
                </div>
            );
        },
        [pairPrice?.lastPrice, pricePrecision, lastPriceMinW, prevLastPrice]
    );

    // ? Render markPrice
    const renderMarkPrice = useCallback(() => {
        return (
            <FuturesPairDetailItem
                containerClassName=""
                label={t('futures:mark_price')}
                value={formatNumber(roundTo(markPrice?.markPrice || 0, pricePrecision), pricePrecision, itemsPriceMinW !== undefined ? 0 : pricePrecision)}
            />
        );
    }, [markPrice?.markPrice, pricePrecision, itemsPriceMinW]);

    const renderMarkPriceItems = useCallback(() => {
        return MARK_PRICE_ITEMS.map((mark) => {
            const { key, code, localized: localizedPath } = mark;
            let minWidth = itemsPriceMinW || 0;
            let value = null;
            let localized = t(localizedPath);

            switch (code) {
                case 'indexPrice':
                    value = formatNumber(roundTo(markPrice?.indexPrice || 0, pricePrecision), pricePrecision);
                    break;
                case 'fundingCountdown':
                    const rateWidth = markPrice?.fundingRate?.toString()?.length + getDecimalScale(markPrice?.fundingRate) * TEXT_XS_WIDTH_PER_LETTER || 0;
                    const timerWidth = TEXT_XS_WIDTH_PER_LETTER * 8;

                    value = (
                        <div className="w-[90%] flex items-center justify-between">
                            <div
                                style={{
                                    minWidth: rateWidth
                                }}
                                className={classNames({
                                    'text-red': !!markPrice?.fundingRate
                                })}
                            >
                                {formatNumber(markPrice?.fundingRate * 100, 4, 4, true)}%
                            </div>
                            <div className="ml-4">
                                {markPrice?.nextFundingTime ? secondToMinutesAndSeconds((markPrice?.nextFundingTime - Date.now()) * 0.001).toString() : '--:--'}
                            </div>
                        </div>
                    );
                    minWidth = rateWidth + timerWidth + 18;
                    break;
                default:
                    return null;
            }

            return (
                <div key={`markPrice_items_${key}`} style={{ minWidth }}>
                    <FuturesPairDetailItem containerClassName="" label={localized} value={value} />
                </div>
            );
        });
    }, [markPrice, pricePrecision, itemsPriceMinW]);

    //   useEffect(() => {
    //     if (!symbolOptions?.symbol) return;
    //     // ? Subscribe publicSocket
    //     // ? Get Pair Ticker
    //     Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbolOptions.symbol, async (data) => {
    //         if (symbolOptions.symbol === data?.s && data?.p > 0) {
    //             const _pairPrice = FuturesMarketWatch.create(data);
    //             setPairPrice(_pairPrice);
    //         }
    //     });
    //     return () => {
    //         // Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol);
    //     };
    // }, [currentSelectedPair]);

    const renderFundingFee = useCallback(() => {
        const { key, code, localized: localizedPath, icon } = PAIR_PRICE_DETAIL_ITEMS[0];
        let minWidth = itemsPriceMinW || 0;

        return (
            <div style={{ minWidth: minWidth || 0 }}>
                <div className="flex items-center space-x-1 text-base text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="border-b border-darkBlue-5 border-dashed pb-0.5">
                        <span onClick={onClickFunding} className="cursor-pointer">
                            Funding / {t('futures:countdown')}
                        </span>
                    </div>
                </div>
                <div className="text-base font-semibold mt-2">
                    1<span>{formatFundingRate(pairPrice?.fundingRate * 100)}</span> /
                    <Countdown
                        now={() => (timesync ? timesync.now() : Date.now())}
                        date={pairPrice?.fundingTime}
                        renderer={({ hours, minutes, seconds }) => {
                            return (
                                <span>
                                    {hours}:{minutes}:{seconds}
                                </span>
                            );
                        }}
                    />
                </div>
            </div>
        );
    }, [pairPrice, itemsPriceMinW, pricePrecision, isVndcFutures]);

    const renderPairPriceItems = useCallback(() => {
        return PAIR_PRICE_DETAIL_ITEMS.map((detail) => {
            const { key, code, localized: localizedPath, icon } = detail;

            let minWidth = itemsPriceMinW || 0;
            let value = null,
                className = '';
            let localized = t(localizedPath);

            switch (code) {
                case 'fundingCountdown':
                    value = (
                        <div>
                            {formatFundingRate(pairPrice?.fundingRate * 100)} /
                            <Countdown
                                now={() => (timesync ? timesync.now() : Date.now())}
                                date={pairPrice?.fundingTime}
                                renderer={({ hours, minutes, seconds }) => {
                                    return (
                                        <span>
                                            {hours}:{minutes}:{seconds}
                                        </span>
                                    );
                                }}
                            />
                        </div>
                    );
                    break;
                case '24hHigh':
                    value = formatNumber(roundTo(pairPrice?.highPrice || 0, pricePrecision), pricePrecision);
                    break;
                case '24hLow':
                    value = formatNumber(roundTo(pairPrice?.lowPrice || 0, pricePrecision), pricePrecision);
                    break;
                case '24hChange':
                    const changeWidth = pairPrice?.priceChange?.toString()?.length + pricePrecision * TEXT_XS_WIDTH_PER_LETTER || 0;
                    const _priceChangeVndc = pairPrice?.lastPrice - pairPrice?.priceChange;
                    value = (
                        <div
                            className={classNames('flex items-center text-dominant', {
                                '!text-red': pairPrice?.priceChangePercent < 0
                            })}
                        >
                            <span> {formatNumber(roundTo(priceFromMarketWatch?.priceChange || 0, 2), 2, 2, true)}</span>
                            <div className="ml-1 flex items-center">
                                <ArrowDropDownIcon
                                    color={pairPrice?.priceChangePercent > 0 ? '#47cc85' : '#F93636'}
                                    size={16}
                                    className={`${pairPrice?.priceChangePercent > 0 && 'rotate-180'}`}
                                />
                                {formatNumber(roundTo(pairPrice?.priceChangePercent * 100 || 0, 2), 2, 2, true)}%
                            </div>
                        </div>
                    );
                    minWidth = itemsPriceMinW + 36;
                    break;
                case '24hBaseVolume':
                    localized += ` (${pairPrice?.baseAsset})`;
                case 'bestBid':
                    minWidth = itemsPriceMinW + 41;
                    value = formatNumber(roundTo(pairPrice?.baseAssetVolume || 0, 3), 3);
                    value = <div className="text-red">{formatNumber(pairPrice?.bid, pricePrecision, 0, true)}</div>;
                    break;
                case '24hQuoteVolume':
                    localized += ` (${pairPrice?.quoteAsset})`;
                    minWidth = itemsPriceMinW + 50;
                    value = formatNumber(roundTo(pairPrice?.quoteAssetVolume || 0, 3), 3);
                case 'bestAsk':
                    minWidth = itemsPriceMinW + 41;
                    value = <div className="text-dominant">{formatNumber(pairPrice?.ask, pricePrecision, 0, true)}</div>;
                    break;
                // case '24hBaseVolume':
                //     localized += ` (${pairPrice?.baseAsset})`
                //     minWidth = itemsPriceMinW + 41
                //     value = formatNumber(
                //         roundTo(pairPrice?.baseAssetVolume || 0, 3),
                //         3
                //     )
                //     break
                // case '24hQuoteVolume':
                //     localized += ` (${pairPrice?.quoteAsset})`
                //     minWidth = itemsPriceMinW + 50
                //     value = formatNumber(
                //         roundTo(pairPrice?.quoteAssetVolume || 0, 3),
                //         3
                //     )
                //     break
                default:
                    return null;
            }

            return (
                <div key={`pairPrice_items_${key}`} style={{ minWidth: minWidth || 0 }}>
                    <FuturesPairDetailItem
                        label={code === 'fundingCountdown' ? renderFunding() : localized}
                        containerClassName={`${className} mr-5`}
                        value={value}
                        icon={icon}
                    />
                </div>
            );
        });
    }, [pairPrice, itemsPriceMinW, pricePrecision, isVndcFutures]);

    const onClickFunding = (mode) => {
        isFunding.current = mode;
        setShowPopover(true);
    };

    const renderFunding = () => {
        return (
            <div className="flex items-center space-x-1 text-xs leading-[16px] font-normal text-txtSecondary dark:text-txtSecondary-dark">
                <div className=" border-b border-darkBlue-5 border-dashed pb-[2px]">
                    <span onClick={onClickFunding} className=" cursor-pointer">
                        Funding / {t('futures:countdown')}
                    </span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        setItemsPriceMinW(undefined);
        setLastPriceMinW(undefined);
    }, [pairPrice?.symbol]);

    useEffect(() => {
        if (router.query?.pair === pairPrice?.symbol && lastPriceMinW === undefined && lastPriceRef.current && pairPrice && pairPrice?.lastPrice) {
            setLastPriceMinW(lastPriceRef.current?.clientWidth + 6 || 0);
        }
    }, [router.query, pairPrice?.symbol, pairPrice, lastPriceRef, lastPriceMinW]);

    useEffect(() => {
        if (router.query?.pair === pairPrice?.symbol && itemsPriceMinW === undefined && itemsPriceRef.current && markPrice && markPrice?.markPrice) {
            setItemsPriceMinW((itemsPriceRef?.current?.clientWidth || 20) + 24);
        }
    }, [router.query, pairPrice?.symbol, markPrice, itemsPriceRef, itemsPriceMinW]);

    const RenderInfoModal = () => {
        const renderContent = (title) => {
            if (!currentExchangeConfig?.config) return '-';
            const exchange = allPairConfigs.find((e) => e.symbol === currentExchangeConfig?.config?.symbol);
            const quoteAsset = currentExchangeConfig?.config?.quoteAsset || '';
            const currentAssetConfig = assetConfig?.find((item) => item.assetCode === quoteAsset);
            switch (title) {
                case 'min_order_size': {
                    return formatPrice(currentExchangeConfig?.minNotionalFilter?.notional) + ' ' + quoteAsset;
                }
                case 'max_order_size': {
                    return formatPrice(currentExchangeConfig?.quantityFilter?.maxQuoteQty || 0) + ' ' + quoteAsset;
                }
                case 'total_max_trading_volumn':
                    return formatPrice(currentExchangeConfig?.maxNumberVolumeFilter?.notional || 0) + ' ' + quoteAsset;
                case 'max_number_order':
                    return (currentExchangeConfig?.maxNumOrderFilter?.limit || 0) + ' ' + t('futures:order');
                case 'min_limit_order_price': {
                    const _minPrice = currentExchangeConfig?.priceFilter?.minPrice;
                    return (
                        formatPrice(
                            Math.max(_minPrice, lastPrice * currentExchangeConfig?.percentPriceFilter?.multiplierDown),
                            currentAssetConfig?.assetDigit || 0
                        ) +
                        ' ' +
                        quoteAsset
                    );
                }

                case 'max_limit_order_price': {
                    const _maxPrice = currentExchangeConfig?.priceFilter?.maxPrice;
                    return (
                        formatPrice(
                            Math.min(_maxPrice, lastPrice * currentExchangeConfig?.percentPriceFilter?.multiplierUp),
                            currentAssetConfig?.assetDigit || 0
                        ) +
                        ' ' +
                        quoteAsset
                    );
                }
                case 'max_leverage':
                    return (currentExchangeConfig?.config?.leverageConfig?.max || '-') + 'x';
                case 'liq_fee_rate':
                    return '1%';
                case 'min_difference_ratio':
                    const _minRatio = currentExchangeConfig?.percentPriceFilter?.minDifferenceRatio;
                    return formatNumber(_minRatio * 100, 3) + '%';
                default:
                    return '-';
            }
        };

        const onSelectPair = (pair) => {
            setCurrentSelectedPair(pair);
            setActivePairList(false);
        };

        const renderInformation = (data) => {
            return data.map(({ title, tooltip, leftPercent }, index) => (
                <div key={'title' + title} className="py-[8px] flex  w-full w-100">
                    <Tooltip id={title} place="right" effect="solid" isV3>
                        <div>
                            <label className="font-medium text-white text-sm leading-[18px]">{t('futures:' + title)}</label>
                            <div className="mt-3 text-3 font-normal text-white leading-[18px]">{t('futures:' + tooltip)}</div>
                        </div>
                    </Tooltip>
                    {/* Each row */}
                    <div className="flex items-center justify-between w-full">
                        <span
                            data-tip=""
                            data-for={title}
                            id={tooltip}
                            className="flex items-end text-base text-txtSecondary dark:text-txtSecondary-dark border-b border-dashed border-darkBlue-5"
                        >
                            {t('futures:' + title)}
                        </span>
                        <span className="font-medium text-darkBlue dark:text-white leading-[22px] text-sm text-right ">{renderContent(title)}</span>
                    </div>
                </div>
            ));
        };

        const onViewAll = () => {
            window.open(`/${router.locale}/futures/trading-rule`);
        };

        return (
            <ModalV2 className="!max-w-[800px]" isVisible={isShowModalInfo} onBackdropCb={() => setIsShowModalInfo(false)}>
                <div className="mt-4 text-[22px] leading-[30px] font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('futures:trading_rules')}</div>

                <div className="mt-6 gap-6 flex">
                    <div className="w-full rounded-md border dark:border-divider-dark p-4 dark:bg-bgInput-dark flex justify-between">
                        <div
                            className="relative cursor-pointer group"
                            onMouseOver={() => setIsShowModalPriceList(true)}
                            onMouseLeave={() => setIsShowModalPriceList(false)}
                        >
                            <div className="relative z-10 flex items-center gap-1">
                                <span className="text-[22px] font-semibold leading-[30px]">
                                    {currentExchangeConfig?.config?.baseAsset
                                        ? currentExchangeConfig?.config?.baseAsset + '/' + currentExchangeConfig?.config?.quoteAsset
                                        : '-/-'}
                                </span>
                                <ArrowDropDownIcon
                                    isFilled
                                    size={16}
                                    className={classNames(' transition-transform duration-75', {
                                        'rotate-180': isShowModalPriceList
                                    })}
                                />
                            </div>
                            <div className="relative z-10 text-tiny font-normal text-txtSecondary dark:text-txtSecondary-dark mt-2">
                                {t('futures:tp_sl:perpetual')}
                            </div>
                            <div className="absolute left-0 z-30 hidden group-hover:block top-full" ref={pairListModalRef}>
                                <FuturesPairList
                                    mode={pairListMode}
                                    setMode={setPairListMode}
                                    isAuth={isAuth}
                                    activePairList={isShowModalPriceList}
                                    onSelectPair={onSelectPair}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end flex-1">
                            {renderLastPrice(true)}
                            <div
                                className={classNames('text-teal text-sm mt-2 flex items-center', {
                                    '!text-red': priceFromMarketWatch?.priceChangePercent < 0
                                })}
                            >
                                <ArrowDropDownIcon
                                    color={priceFromMarketWatch?.priceChangePercent > 0 ? '#47cc85' : '#F93636'}
                                    size={16}
                                    className={`${priceFromMarketWatch?.priceChangePercent > 0 && 'rotate-180'}`}
                                />
                                {formatNumber(roundTo(priceFromMarketWatch?.priceChangePercent * 100 || 0, 2), 2, 2, true)}%
                            </div>
                        </div>
                    </div>
                    {/* Funding fee */}
                    <div className="max-w-[216px] min-w-[216px] rounded-md py-4 px-3 border border-dashed dark:border-divider-dark">{renderFundingFee()}</div>
                </div>

                <div className="mt-8 flex w-full">
                    <div className="flex flex-1 flex-col pr-4">{renderInformation(ITEMS_WITH_TOOLTIPS)}</div>
                    <div className="flex flex-1 flex-col pl-4">{renderInformation(RIGHT_ITEMS_WITH_TOOLTIPS)}</div>
                </div>

                <ButtonV2 onClick={onViewAll} className="mt-10 ">
                    {t('futures:view_all_trading_rule')}
                </ButtonV2>
            </ModalV2>
        );
    };

    const handleToggleModalInfo = (state = true) => {
        if (state) {
            setCurrentSelectedPair(pairConfig);
        }
        setIsShowModalInfo(state);
    };

    return (
        <div className="flex items-center h-full pl-5">
            {/* Pair */}
            <PopoverFunding visible={showPopover} onClose={() => setShowPopover(false)} isFunding={isFunding.current} />
            <div
                className="relative cursor-pointer group pr-4 mr-4 border-r border-divider dark:border-divider-dark"
                onMouseOver={() => setActivePairList(true)}
                onMouseLeave={() => setActivePairList(false)}
            >
                <div className="relative z-10 flex items-center gap-1">
                    <span className="text-[22px] font-semibold leading-[30px]">
                        {pairPrice?.baseAsset ? pairPrice?.baseAsset + '/' + pairPrice?.quoteAsset : '-/-'}
                    </span>
                    <ArrowDropDownIcon
                        isFilled
                        size={16}
                        className={classNames(' transition-transform duration-75', {
                            'rotate-180': activePairList
                        })}
                    />
                </div>
                <div
                    onClick={handleToggleModalInfo}
                    className="flex items-center relative z-10 text-tiny font-normal text-txtSecondary dark:text-txtSecondary-dark gap-2"
                >
                    {t('futures:tp_sl:perpetual')}
                    <BxsBookIcon />
                </div>
                <div className="absolute left-0 z-30 hidden group-hover:block top-full" ref={pairListRef}>
                    <FuturesPairList mode={pairListMode} setMode={setPairListMode} isAuth={isAuth} activePairList={activePairList} />
                </div>
                {/* )} */}
                {RenderInfoModal()}
            </div>

            {/* Price */}
            {renderLastPrice()}

            {/* Details */}
            <InfoSlider forceUpdateState={forceUpdateState}>{renderPairPriceItems()}</InfoSlider>
        </div>
    );
};

const TEXT_XS_WIDTH_PER_LETTER = 6.7;

const MARK_PRICE_ITEMS = [
    // { key: 0, code: 'markPrice', localized: 'futures:mark_price' },
    {
        key: 1,
        code: 'indexPrice',
        localized: 'futures:index_price'
    },
    {
        key: 2,
        code: 'fundingCountdown',
        localized: 'futures:funding_countdown'
    }
];

const PopoverFunding = ({ visible, onClose, isFunding }) => {
    const router = useRouter();
    const [currentTheme] = useDarkMode();
    const { t } = useTranslation();

    const onRedirect = () => {
        window.open(`/${router.locale}/futures/funding-history?theme=${currentTheme}`);
    };

    const onDetail = () => {
        const url =
            router.locale === 'en'
                ? 'https://nami.exchange/support/announcement/announcement/apply-funding-rates-on-nami-futures-and-onus-futures'
                : 'https://nami.exchange/vi/support/announcement/thong-bao/thong-bao-ra-mat-co-che-funding-rate-tren-nami-futures-va-onus-futures';
        window.open(url);
    };

    return (
        <>
            {/* <div className="cursor-pointer min-w-[10px]" onClick={() => setShowModal(true)}>
                <img src={getS3Url('/images/icon/ic_help.png')} height={10} width={10} />
            </div> */}
            <ModalV2 className="!max-w-[342px]" isVisible={visible} onBackdropCb={onClose}>
                {/* <Modal isVisible={visible} onBackdropCb={onClose} containerClassName="max-w-[342px]"> */}
                <div className="font-semibold">{isFunding ? 'Funding' : t('futures:countdown')}</div>
                <div className="text-gray-4 text-sm pt-4">
                    {' '}
                    {isFunding ? t('futures:funding_rate_des') : t('common:countdown_tooltip')}
                    {isFunding && (
                        <span onClick={onDetail} className="text-teal font-semibold cursor-pointer">
                            {t('common:read_more')}
                        </span>
                    )}
                </div>
                {isFunding && (
                    <div
                        onClick={onRedirect}
                        className="bg-teal pd-[10px] text-white text-center w-full text-sm font-semibold cursor-pointer rounded-md mt-4 h-11 flex items-center justify-center"
                    >
                        {t('futures:funding_history')}
                    </div>
                )}
            </ModalV2>
        </>
    );
};

const PAIR_PRICE_DETAIL_ITEMS = [
    {
        key: 2,
        code: 'fundingCountdown',
        localized: 'futures:funding_countdown'
        // icon: <PopoverFunding />
    },
    {
        key: 3,
        code: '24hChange',
        localized: 'futures:24h_change'
    },
    {
        key: 4,
        code: 'bestBid',
        localized: 'futures:best_bid'
    },
    {
        key: 5,
        code: 'bestAsk',
        localized: 'futures:best_ask'
    },
    {
        key: 6,
        code: '24hHigh',
        localized: 'futures:24h_high'
    },
    {
        key: 7,
        code: '24hLow',
        localized: 'futures:24h_low'
    }
];

const ITEMS_WITH_TOOLTIPS = [
    {
        title: 'min_order_size',
        tooltip: 'min_order_size_tooltips',
        leftPercent: 40
    },
    {
        title: 'max_order_size',
        tooltip: 'max_order_size_tooltips',
        leftPercent: 40
    },
    {
        title: 'total_max_trading_volumn',
        tooltip: 'total_max_trading_volumn_tooltips',
        leftPercent: 60
    },
    {
        title: 'max_number_order',
        tooltip: 'max_number_order_tooltips',
        leftPercent: 70
    },
    {
        title: 'min_limit_order_price',
        tooltip: 'min_limit_order_price_tooltips',
        leftPercent: 40
    }
];

const RIGHT_ITEMS_WITH_TOOLTIPS = [
    {
        title: 'max_limit_order_price',
        tooltip: 'max_limit_order_price_tooltips',
        leftPercent: 40
    },
    {
        title: 'max_leverage',
        tooltip: 'max_leverage_tooltips',
        leftPercent: 30
    },
    {
        title: 'liq_fee_rate',
        tooltip: 'liq_fee_rate_tooltips',
        leftPercent: 41
    },
    {
        title: 'min_difference_ratio',
        tooltip: 'min_difference_ratio_tooltip',
        leftPercent: 41
    }
];

const Row = styled.div.attrs({
    className: 'flex items-center justify-between border-b border-onus-input2 last:border-0 w-full'
})``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `font-medium text-darkBlue dark:text-white leading-[22px] text-sm text-right `
}))``;

export default FuturesPairDetail;
