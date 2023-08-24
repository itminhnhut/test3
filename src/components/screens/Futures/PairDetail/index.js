import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatPrice, getFilter, formatFundingRate, RefCurrency, convertSymbol, getDecimalPrice } from 'redux/actions/utils';
import Countdown from 'react-countdown-now';
import { usePrevious } from 'react-use';
// import { ChevronDown, X } from 'react-feather';
import { roundTo } from 'round-to';

import FuturesPairDetailItem from './PairDetailItem';
// import FuturesPairList from '../PairList';
import InfoSlider from 'components/markets/InfoSlider';
import classNames from 'classnames';
import styled from 'styled-components';
import Tooltip from 'components/common/Tooltip';
// import Modal from 'components/common/ReModal';
import { ExchangeOrderEnum } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import useDarkMode from 'hooks/useDarkMode';
import ModalV2 from 'components/common/V2/ModalV2';
import { ArrowDropDownIcon, BxsBookIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import PriceChangePercent from 'components/common/PriceChangePercent';
import dynamic from 'next/dynamic';
import { getAssetConfig, getMarketWatch, getPairConfig } from 'redux/selectors';

const FuturesPairList = dynamic(() => import('components/screens/Futures/PairList'), { ssr: false });

const FuturesPairDetail = ({ pairPrice, pairConfig, forceUpdateState, isVndcFutures, isAuth, decimals, pair }) => {
    // ? Xử lí minW để khi giá thay đổi, giao diện này sẽ không bị xê dịch.
    // ? Nguyên nhân: Font sida (;_;)
    const [itemsPriceMinW, setItemsPriceMinW] = useState(0);
    const [lastPriceMinW, setLastPriceMinW] = useState(0);

    const [activePairList, setActivePairList] = useState(false);
    const [pairListMode, setPairListMode] = useState(pairConfig?.quoteAsset);
    const [isShowModalInfo, setIsShowModalInfo] = useState(false);
    const [isShowModalPriceList, setIsShowModalPriceList] = useState(false);
    // state, vars for information modal (Trading rules)
    const timesync = useSelector((state) => state.utils.timesync);
    const [showPopover, setShowPopover] = useState(false);
    const isFunding = useRef(true);
    const { t } = useTranslation();

    // ? Helper
    const itemsPriceRef = useRef();
    const lastPriceRef = useRef();
    const pairListRef = useRef();
    const prevLastPrice = usePrevious(pairPrice?.lastPrice);
    const prevLastPriceModal = usePrevious(pairPrice?.lastPrice);
    // const [currentTheme] = useDarkMode();

    const currentExchangeConfig = useMemo(() => {
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, pairConfig || []);
        const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, pairConfig || []);
        const quantityMarketFilter = getFilter(ExchangeOrderEnum.Filter.MARKET_LOT_SIZE, pairConfig || []);
        const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, pairConfig || []);
        const maxNumberVolumeFilter = getFilter(ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME, pairConfig || []);
        const maxNumOrderFilter = getFilter(ExchangeOrderEnum.Filter.MAX_NUM_ORDERS, pairConfig || []);
        const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, pairConfig || []);

        return {
            config: pairConfig,
            priceFilter,
            quantityMarketFilter,
            quantityFilter,
            minNotionalFilter,
            maxNumOrderFilter,
            maxNumberVolumeFilter,
            percentPriceFilter
        };
    }, [pairConfig]);

    // ? Memmoized Var
    const pricePrecision = useMemo(
        () => currentExchangeConfig?.config?.pricePrecision || pairConfig?.pricePrecision || 0,
        [pairConfig?.pricePrecision, currentExchangeConfig?.config?.pricePrecision]
    );

    // ? Render lastPrice
    const renderLastPrice = useCallback(
        (isShownOnModal = false) => {
            const className = isShownOnModal
                ? 'text-[22px] leading-[30px] text-teal font-semibold text-right tracking-normal'
                : 'text-left text-base font-semibold text-dominant tracking-normal';
            return (
                <div
                    ref={lastPriceRef}
                    // style={{ minWidth: lastPriceMinW }}
                    // style={{ minWidth: 82 }}
                    className={classNames(className, {
                        '!text-red': !isShownOnModal ? pairPrice?.lastPrice < prevLastPrice : pairPrice?.lastPrice < prevLastPriceModal
                    })}
                >
                    <div>
                        {formatNumber(
                            roundTo(!isShownOnModal ? pairPrice?.lastPrice || 0 : pairPrice?.lastPrice || 0, pricePrecision),
                            pricePrecision,
                            lastPriceMinW !== undefined ? 0 : pricePrecision
                        )}
                    </div>
                    {!isShownOnModal && (
                        <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm font-normal">
                            <RefCurrency price={pairPrice?.lastPrice} quoteAsset={pairPrice?.quoteAsset} />
                        </span>
                    )}
                </div>
            );
        },
        [pairPrice?.lastPrice, pricePrecision, lastPriceMinW, prevLastPrice]
    );

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
                    // const changeWidth = pairPrice?.priceChange?.toString()?.length + pricePrecision * TEXT_XS_WIDTH_PER_LETTER || 0;
                    const _priceChangeVndc = pairPrice?.lastPrice - pairPrice?.priceChange;
                    value = (
                        <div
                            className={classNames('flex items-center text-dominant', {
                                '!text-red': pairPrice?.priceChangePercent < 0
                            })}
                        >
                            <span> {formatNumber(roundTo(_priceChangeVndc || 0, 2), 0, 0, true)}</span>
                            <PriceChangePercent priceChangePercent={pairPrice?.priceChangePercent} className="ml-1" />
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
                <div
                    key={`pairPrice_items_${key}`}
                    // style={{ minWidth: minWidth || 0 }}
                >
                    <FuturesPairDetailItem
                        label={code === 'fundingCountdown' ? renderFunding() : localized}
                        containerClassName={`${className} mr-6`}
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
                <div onClick={onClickFunding} className="cursor-pointer border-b border-darkBlue-5 border-dashed pb-0.5">
                    <span>Funding / {t('futures:countdown')}</span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        setItemsPriceMinW(undefined);
        setLastPriceMinW(undefined);
    }, [pairPrice?.symbol]);

    useEffect(() => {
        if (pair === pairPrice?.symbol && lastPriceMinW === undefined && lastPriceRef.current && pairPrice && pairPrice?.lastPrice) {
            setLastPriceMinW(lastPriceRef.current?.clientWidth + 6 || 0);
        }
    }, [pair, pairPrice?.symbol, pairPrice, lastPriceRef, lastPriceMinW]);

    useEffect(() => {
        if (pair === pairPrice?.symbol && itemsPriceMinW === undefined && itemsPriceRef.current) {
            setItemsPriceMinW((itemsPriceRef?.current?.clientWidth || 20) + 24);
        }
    }, [pair, pairPrice?.symbol, itemsPriceRef, itemsPriceMinW]);

    useEffect(() => {
        setPairListMode(pairConfig?.quoteAsset);
    }, [pairConfig?.quoteAsset]);

    const handleToggleModalInfo = (state = true) => {
        setActivePairList(false);
        setIsShowModalInfo(state);
    };

    return (
        <div className="flex items-center h-full pl-5 w-full">
            {/* Pair */}
            <PopoverFunding
                visible={showPopover}
                onClose={() => setShowPopover(false)}
                isFunding={isFunding.current}
                symbol={pairPrice?.baseAsset + pairPrice?.quoteAsset}
            />
            <div
                className="relative cursor-pointer pr-4 mr-4 border-r border-divider dark:border-divider-dark"
                onMouseOver={() => {
                    !isShowModalInfo && setActivePairList(true);
                }}
                onMouseLeave={() => setActivePairList(false)}
                onBlur={() => setActivePairList(false)}
            >
                <div className="relative z-10 flex items-center gap-1">
                    <span className="text-[22px] font-semibold leading-[30px]">
                        {/* {pairPrice?.baseAsset ? pairPrice?.baseAsset + '/' + pairPrice?.quoteAsset : '-/-'} */}
                        {pairConfig?.baseAsset ? pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset : '-/-'}
                    </span>
                    <ArrowDropDownIcon
                        isFilled
                        size={16}
                        className={classNames(' transition-transform duration-200', {
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
                <div
                    className={classNames(
                        'absolute left-0 z-30 top-full',

                        {
                            hidden: !activePairList
                        }
                    )}
                    ref={pairListRef}
                >
                    <FuturesPairList mode={pairListMode} setMode={setPairListMode} isAuth={isAuth} activePairList={activePairList} />
                </div>
            </div>
            <ModalPerpetual
                isShowModalInfo={isShowModalInfo}
                onBackdropCb={() => handleToggleModalInfo(false)}
                t={t}
                symbol={pairConfig?.symbol ?? 'BTCUSDT'}
                isShowModalPriceList={isShowModalPriceList}
                pairListMode={pairListMode}
                setPairListMode={setPairListMode}
                isAuth={isAuth}
                onClickFunding={onClickFunding}
                decimals={decimals}
            />

            {/* Price */}
            {renderLastPrice()}

            {/* Details */}
            <InfoSlider forceUpdateState={forceUpdateState} className="!pl-[14px]">
                {renderPairPriceItems()}
            </InfoSlider>
        </div>
    );
};

const ModalPerpetual = ({ isShowModalInfo, onBackdropCb, t, symbol, pairListMode, setPairListMode, isAuth, onClickFunding }) => {
    const router = useRouter();
    const pairListModalRef = useRef();
    const lastPriceRef = useRef();

    const prevLastPrice = usePrevious(pairPrice?.lastPrice);
    const prevLastPriceModal = usePrevious(pairPrice?.lastPrice);

    const [isShowModalPriceList, setIsShowModalPriceList] = useState(false);
    const [curConfigPair, setCurConfigPair] = useState(symbol);

    const pairConfig = useSelector((state) => getPairConfig(state, curConfigPair));
    const assetToken = useSelector((state) => getAssetConfig(state, pairConfig?.quoteAssetId));
    const pairPrice = useSelector((state) => getMarketWatch(state, convertSymbol(curConfigPair)));
    const timesync = useSelector((state) => state.utils.timesync);

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: assetToken?.assetDigit ?? 0
        };
    }, [pairConfig]);

    const lastPrice = pairPrice?.lastPrice;

    const currentExchangeConfig = useMemo(() => {
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, pairConfig || []);
        const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, pairConfig || []);
        const quantityMarketFilter = getFilter(ExchangeOrderEnum.Filter.MARKET_LOT_SIZE, pairConfig || []);
        const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, pairConfig || []);
        const maxNumberVolumeFilter = getFilter(ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME, pairConfig || []);
        const maxNumOrderFilter = getFilter(ExchangeOrderEnum.Filter.MAX_NUM_ORDERS, pairConfig || []);
        const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, pairConfig || []);

        return {
            config: pairConfig,
            priceFilter,
            quantityMarketFilter,
            quantityFilter,
            minNotionalFilter,
            maxNumOrderFilter,
            maxNumberVolumeFilter,
            percentPriceFilter
        };
    }, [pairConfig]);

    const renderLastPrice = useCallback(
        (isShownOnModal = false) => {
            const className = isShownOnModal
                ? 'text-[22px] leading-[30px] text-teal font-semibold text-right tracking-normal'
                : 'text-left text-base font-semibold text-dominant tracking-normal';
            return (
                <div
                    ref={lastPriceRef}
                    // style={{ minWidth: lastPriceMinW }}
                    // style={{ minWidth: 82 }}
                    className={classNames(className, {
                        '!text-red': !isShownOnModal ? pairPrice?.lastPrice < prevLastPrice : pairPrice?.lastPrice < prevLastPriceModal
                    })}
                >
                    <div>{formatNumber(roundTo(!isShownOnModal ? pairPrice?.lastPrice || 0 : pairPrice?.lastPrice || 0, decimals.price), decimals.price)}</div>
                    {!isShownOnModal && (
                        <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm font-normal">
                            <RefCurrency price={pairPrice?.lastPrice} quoteAsset={pairPrice?.quoteAsset} />
                        </span>
                    )}
                </div>
            );
        },
        [pairPrice?.lastPrice, prevLastPrice]
    );

    const renderFundingFee = useCallback(() => {
        return (
            <div>
                <div className="flex items-center space-x-1 text-base text-txtSecondary dark:text-txtSecondary-dark">
                    <div onClick={onClickFunding} className="cursor-pointer border-b border-darkBlue-5 border-dashed pb-0.5">
                        <span>Funding / {t('futures:countdown')}</span>
                    </div>
                </div>
                <div className="text-base font-semibold mt-2">
                    <span>{formatFundingRate(pairPrice?.fundingRate * 100)}</span> /
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
    }, [pairPrice]);

    const renderContent = (title) => {
        if (!currentExchangeConfig?.config) return '-';
        // const exchange = allPairConfigs.find((e) => e.symbol === currentExchangeConfig?.config?.symbol);
        const quoteAsset = currentExchangeConfig?.config?.quoteAsset || '';
        switch (title) {
            case 'min_order_size': {
                return formatPrice(currentExchangeConfig?.minNotionalFilter?.notional) + ' ' + quoteAsset;
            }
            case 'max_order_size_limit': {
                return formatPrice(currentExchangeConfig?.quantityFilter?.maxQuoteQty || 0) + ' ' + quoteAsset;
            }
            case 'max_order_size_market': {
                return formatPrice(currentExchangeConfig?.quantityMarketFilter?.maxQuoteQty || 0) + ' ' + quoteAsset;
            }
            case 'total_max_trading_volumn':
                return formatPrice(currentExchangeConfig?.maxNumberVolumeFilter?.notional || 0) + ' ' + quoteAsset;
            case 'max_number_order':
                return (currentExchangeConfig?.maxNumOrderFilter?.limit || 0) + ' ' + t('futures:order');
            case 'min_limit_order_price': {
                const _minPrice = currentExchangeConfig?.priceFilter?.minPrice;
                return (
                    formatPrice(Math.max(_minPrice, lastPrice * currentExchangeConfig?.percentPriceFilter?.multiplierDown), decimals?.symbol) + ' ' + quoteAsset
                );
            }

            case 'max_limit_order_price': {
                const _maxPrice = currentExchangeConfig?.priceFilter?.maxPrice;
                return (
                    formatPrice(Math.min(_maxPrice, lastPrice * currentExchangeConfig?.percentPriceFilter?.multiplierUp), decimals?.symbol) + ' ' + quoteAsset
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

    const renderInformation = (data, isLeft) => {
        return data.map(({ title, tooltip, leftPercent }, index) => (
            <div key={'title' + title} className="py-[8px] flex  w-full w-100">
                <Tooltip
                    id={title}
                    place="top"
                    effect="solid"
                    isV3
                    overridePosition={(e) => ({
                        left: isLeft ? 0 : e.left,
                        top: e.top
                    })}
                    className="max-w-[300px]"
                >
                    {/* <label className="font-medium text-white text-sm leading-[18px]">{t('futures:' + title)}</label> */}
                    <div className="text-3 font-normal text-white leading-[18px]">{t('futures:' + tooltip)}</div>
                </Tooltip>
                {/* Each row */}
                <div className="flex items-center justify-between w-full">
                    <span
                        data-tip=""
                        data-for={title}
                        id={tooltip}
                        className="whitespace-nowrap flex items-end text-base text-txtSecondary dark:text-txtSecondary-dark border-b border-dashed border-darkBlue-5 cursor-pointer"
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

    const onSelectPair = (pair) => {
        setCurConfigPair(pair);
    };

    return (
        <ModalV2 className="!max-w-[800px]" isVisible={isShowModalInfo} onBackdropCb={onBackdropCb}>
            <div className="mt-4 text-[22px] leading-[30px] font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('futures:trading_rules')}</div>
            <div className="mt-6 gap-6 flex">
                <div className="w-full rounded-md border border-divider dark:border-divider-dark p-4 bg-gray-13 dark:bg-dark-4 flex justify-between">
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
                            <div className="absolute left-0 z-50 hidden group-hover:block top-full mt-2" ref={pairListModalRef}>
                                <FuturesPairList
                                    mode={pairListMode}
                                    setMode={setPairListMode}
                                    isAuth={isAuth}
                                    activePairList={isShowModalPriceList}
                                    onSelectPair={onSelectPair}
                                />
                            </div>
                        </div>
                        <div className="z-10 text-tiny font-normal text-txtSecondary dark:text-txtSecondary-dark mt-2">{t('futures:tp_sl:perpetual')}</div>
                    </div>
                    <div className="flex flex-col items-end justify-start flex-1">
                        {renderLastPrice(true)}
                        <PriceChangePercent priceChangePercent={pairPrice?.priceChangePercent} className="mt-2 text-sm" />
                    </div>
                </div>
                {/* Funding fee */}
                <div className="max-w-[216px] min-w-[216px] rounded-md py-4 px-3 border border-dashed dark:border-divider-dark">{renderFundingFee()}</div>
            </div>

            <div className="mt-8 flex w-full">
                <div className="flex flex-1 flex-col pr-4">{renderInformation(ITEMS_WITH_TOOLTIPS, true)}</div>
                <div className="flex flex-1 flex-col pl-4">{renderInformation(RIGHT_ITEMS_WITH_TOOLTIPS)}</div>
            </div>

            <ButtonV2 onClick={onViewAll} className="mt-10 ">
                {t('futures:view_all_trading_rule')}
            </ButtonV2>
        </ModalV2>
    );
};

const PopoverFunding = ({ visible, onClose, isFunding, symbol }) => {
    const router = useRouter();
    const [currentTheme] = useDarkMode();
    const { t } = useTranslation();

    const onRedirect = () => {
        window.open(`/${router.locale}/futures/funding-history?symbol=${symbol}`);
    };

    const onDetail = () => {
        const url =
            router.locale === 'en'
                ? 'https://nami.exchange/support/announcement/announcement/apply-funding-rates-on-nami-futures-and-nao-futures'
                : 'https://nami.exchange/vi/support/announcement/thong-bao/ra-mat-co-che-funding-rate-tren-nami-futures-va-nao-futures';
        window.open(url);
    };

    return (
        <>
            {/* <div className="cursor-pointer min-w-[10px]" onClick={() => setShowModal(true)}>
                <img src={getS3Url('/images/icon/ic_help.png')} height={10} width={10} />
            </div> */}
            <ModalV2 className="!max-w-[342px]" isVisible={visible} onBackdropCb={onClose}>
                {/* <Modal isVisible={visible} onBackdropCb={onClose} containerClassName="max-w-[342px]"> */}
                <div className="font-semibold text-2xl">{isFunding ? 'Funding' : t('futures:countdown')}</div>
                <div className="text-gray-9 dark:text-gray-7 text-sm mt-4">
                    {isFunding ? t('futures:funding_rate_des') : t('common:countdown_tooltip')}{' '}
                    {isFunding && (
                        <span onClick={onDetail} className="text-teal font-semibold cursor-pointer">
                            {t('common:read_more')}
                        </span>
                    )}
                </div>
                {isFunding && (
                    <ButtonV2 onClick={onRedirect} className="mt-3 w-full">
                        {t('futures:funding_history')}
                    </ButtonV2>
                    // <div
                    //     onClick={onRedirect}
                    //     className="bg-teal pd-[10px] text-white text-center w-full text-sm font-semibold cursor-pointer rounded-md mt-4 h-11 flex items-center justify-center"
                    // >
                    // </div>
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
        title: 'max_order_size_limit',
        tooltip: 'max_order_size_limit_tooltip',
        leftPercent: 40
    },
    {
        title: 'max_order_size_market',
        tooltip: 'max_order_size_market_tooltip',
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
    }
];

const RIGHT_ITEMS_WITH_TOOLTIPS = [
    {
        title: 'min_limit_order_price',
        tooltip: 'min_limit_order_price_tooltips',
        leftPercent: 40
    },
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

export default FuturesPairDetail;
