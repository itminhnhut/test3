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
    formatFundingRate
} from 'redux/actions/utils';
import Countdown from 'react-countdown-now'
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

const getPairPrice = createSelector(
    [(state) => state.futures, (state, pair) => pair],
    (futures, pair) => futures.marketWatch[pair]
);

const FuturesPairDetail = ({
    pairPrice,
    markPrice,
    pairConfig,
    forceUpdateState,
    isVndcFutures,
    isAuth
}) => {
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
    const timesync = useSelector(state => state.utils.timesync)
    const _pairPrice = priceFromMarketWatch || pairPrice;
    const lastPrice = _pairPrice?.lastPrice;
    const [showPopover, setShowPopover] = useState(false)
    const isFunding = useRef(true)

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
        const maxNumberVolumeFilter = getFilter(
            ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME,
            config || []
        );
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
                ? 'text-[18px] leading-6 font-semibold text-dominant text-right'
                : 'ml-6 font-bold text-center text-sm text-dominant dragHandleArea tracking-wide';
            return (
                <div
                    ref={lastPriceRef}
                    style={{ minWidth: lastPriceMinW }}
                    className={classNames(className, {
                        '!text-red': !isShownOnModal
                            ? pairPrice?.lastPrice < prevLastPrice
                            : priceFromMarketWatch?.lastPrice < prevLastPriceModal
                    })}
                >
                    {formatNumber(
                        roundTo(
                            !isShownOnModal
                                ? pairPrice?.lastPrice || 0
                                : priceFromMarketWatch?.lastPrice || 0,
                            pricePrecision
                        ),
                        pricePrecision,
                        lastPriceMinW !== undefined ? 0 : pricePrecision
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
                value={formatNumber(
                    roundTo(markPrice?.markPrice || 0, pricePrecision),
                    pricePrecision,
                    itemsPriceMinW !== undefined ? 0 : pricePrecision
                )}
            />
        );
    }, [markPrice?.markPrice, pricePrecision, itemsPriceMinW]);

    const renderMarkPriceItems = useCallback(() => {
        return MARK_PRICE_ITEMS.map((mark) => {
            const {
                key,
                code,
                localized: localizedPath
            } = mark;
            let minWidth = itemsPriceMinW || 0;
            let value = null;
            let localized = t(localizedPath);

            switch (code) {
                case 'indexPrice':
                    value = formatNumber(
                        roundTo(markPrice?.indexPrice || 0, pricePrecision),
                        pricePrecision
                    );
                    break;
                case 'fundingCountdown':
                    const rateWidth =
                        markPrice?.fundingRate?.toString()?.length +
                        getDecimalScale(markPrice?.fundingRate) * TEXT_XS_WIDTH_PER_LETTER || 0;
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
                                {markPrice?.nextFundingTime
                                    ? secondToMinutesAndSeconds(
                                        (markPrice?.nextFundingTime - Date.now()) * 0.001
                                    )
                                        .toString()
                                    : '--:--'}
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

    const renderPairPriceItems = useCallback(() => {
        return PAIR_PRICE_DETAIL_ITEMS.map((detail) => {
            const { key, code, localized: localizedPath, icon } = detail

            let minWidth = itemsPriceMinW || 0;
            let value = null,
                className = '';
            let localized = t(localizedPath);

            switch (code) {
                case 'fundingCountdown':
                    value = <div>
                        <span>{formatFundingRate(pairPrice?.fundingRate * 100)}</span> /
                        <Countdown
                            now={() => timesync ? timesync.now() : Date.now()}
                            date={pairPrice?.fundingTime} renderer={({ hours, minutes, seconds }) => {
                                return <span>{hours}:{minutes}:{seconds}</span>
                            }} />
                    </div>
                    break;
                case '24hHigh':
                    value = formatNumber(
                        roundTo(pairPrice?.highPrice || 0, pricePrecision),
                        pricePrecision
                    );
                    break;
                case '24hLow':
                    value = formatNumber(
                        roundTo(pairPrice?.lowPrice || 0, pricePrecision),
                        pricePrecision
                    );
                    break;
                case '24hChange':
                    const changeWidth =
                        pairPrice?.priceChange?.toString()?.length +
                        pricePrecision * TEXT_XS_WIDTH_PER_LETTER || 0;
                    const _priceChangeVndc = pairPrice?.lastPrice - pairPrice?.priceChange;
                    value = (
                        <div className="flex items-center">
                            <div
                                className={classNames('pl-2 text-dominant', {
                                    '!text-red': pairPrice?.priceChangePercent < 0
                                })}
                            >
                                {formatNumber(
                                    roundTo(pairPrice?.priceChangePercent * 100 || 0, 2),
                                    2,
                                    2,
                                    true
                                )}
                                %
                            </div>
                        </div>
                    )
                    minWidth = itemsPriceMinW + 36
                    break
                case '24hBaseVolume':
                    localized += ` (${pairPrice?.baseAsset})`
                case 'bestBid':
                    minWidth = itemsPriceMinW + 41
                    value = formatNumber(
                        roundTo(pairPrice?.baseAssetVolume || 0, 3),
                        3
                    )
                    value = <div className="text-red">{formatNumber(pairPrice?.bid, pricePrecision, 0, true)}</div>
                    break
                case '24hQuoteVolume':
                    localized += ` (${pairPrice?.quoteAsset})`
                    minWidth = itemsPriceMinW + 50
                    value = formatNumber(
                        roundTo(pairPrice?.quoteAssetVolume || 0, 3),
                        3
                    )
                case 'bestAsk':
                    minWidth = itemsPriceMinW + 41;
                    value = (
                        <div className="text-dominant">
                            {formatNumber(pairPrice?.ask, pricePrecision, 0, true)}
                        </div>
                    );
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
        isFunding.current = mode
        setShowPopover(true)
    }

    const renderFunding = () => {
        return (
            <div className="flex items-center space-x-1">
                <div className="flex items-center" onClick={() => onClickFunding(true)}>
                    <span>Funding</span>
                    <div className="flex px-2" >
                        <img src={getS3Url('/images/icon/ic_help.png')} height={10} width={10} />
                    </div>
                </div>
                <span className="text-onus-grey ">/</span>
                <div className="flex items-center" onClick={() => onClickFunding(false)}>
                    <span>{t('futures:countdown')}</span>
                    <div className="flex px-2" >
                        <img src={getS3Url('/images/icon/ic_help.png')} height={10} width={10} />
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        setItemsPriceMinW(undefined);
        setLastPriceMinW(undefined);
    }, [pairPrice?.symbol]);

    useEffect(() => {
        if (
            router.query?.pair === pairPrice?.symbol &&
            lastPriceMinW === undefined &&
            lastPriceRef.current &&
            pairPrice &&
            pairPrice?.lastPrice
        ) {
            setLastPriceMinW(lastPriceRef.current?.clientWidth + 6 || 0);
        }
    }, [router.query, pairPrice?.symbol, pairPrice, lastPriceRef, lastPriceMinW]);

    useEffect(() => {
        if (
            router.query?.pair === pairPrice?.symbol &&
            itemsPriceMinW === undefined &&
            itemsPriceRef.current &&
            markPrice &&
            markPrice?.markPrice
        ) {
            setItemsPriceMinW((itemsPriceRef?.current?.clientWidth || 20) + 24);
        }
    }, [router.query, pairPrice?.symbol, markPrice, itemsPriceRef, itemsPriceMinW]);

    const RenderInfoModal = () => {
        const renderContent = (title) => {
            if (!currentExchangeConfig?.config) return '-';
            const exchange = allPairConfigs.find(
                (e) => e.symbol === currentExchangeConfig?.config?.symbol
            );
            const quoteAsset = currentExchangeConfig?.config?.quoteAsset || '';
            const currentAssetConfig = assetConfig?.find((item) => item.assetCode === quoteAsset);
            switch (title) {
                case 'min_order_size': {
                    return (
                        formatPrice(currentExchangeConfig?.minNotionalFilter?.notional) +
                        ' ' +
                        quoteAsset
                    );
                }
                case 'max_order_size': {
                    return (
                        formatPrice(
                            currentExchangeConfig?.quantityFilter?.maxQty * lastPrice || 0
                        ) +
                        ' ' +
                        quoteAsset
                    );
                }
                case 'total_max_trading_volumn':
                    return (
                        formatPrice(currentExchangeConfig?.maxNumberVolumeFilter?.notional || 0) +
                        ' ' +
                        quoteAsset
                    );
                case 'max_number_order':
                    return (
                        (currentExchangeConfig?.maxNumOrderFilter?.limit || 0) +
                        ' ' +
                        t('futures:order')
                    );
                case 'min_limit_order_price': {
                    const _minPrice = currentExchangeConfig?.priceFilter?.minPrice;
                    return (
                        formatPrice(
                            Math.max(
                                _minPrice,
                                lastPrice *
                                currentExchangeConfig?.percentPriceFilter?.multiplierDown
                            ),
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
                            Math.min(
                                _maxPrice,
                                lastPrice * currentExchangeConfig?.percentPriceFilter?.multiplierUp
                            ),
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
                case 'swap_fee':
                    return '0.0015%';
                default:
                    return '-';
            }
        };

        const onSelectPair = (pair) => {
            setCurrentSelectedPair(pair);
            setActivePairList(false);
        };

        const renderInformation = (data) => {
            return data.map(({
                title,
                tooltip,
                leftPercent
            }, index) => (
                <div key={'title' + title} className="py-[8px] flex  w-full w-100">
                    <Tooltip
                        id={title}
                        place="top"
                        effect="solid"
                        className="!bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2"
                        backgroundColor="bg-darkBlue-4"
                    >
                        <div>
                            <label className="font-medium text-white text-sm leading-[18px]">
                                {t('futures:' + title)}
                            </label>
                            <div className="mt-3 text-3 font-normal text-white leading-[18px]">
                                {t('futures:' + tooltip)}
                            </div>
                        </div>
                    </Tooltip>
                    <Row>
                        <div
                            className={`flex items-center text-sm font-medium leading-6 text-left  dark:text-txtDarkBlue `}
                        >
                            {t('futures:' + title)}
                            <div className="flex px-2" data-tip="" data-for={title} id={tooltip}>
                                {/* <img src={getS3Url("/images/nao/ic_info.png")} height={"10"} width={"10"} alt="" className="mx-auto" /> */}
                                <img
                                    src={getS3Url('/images/nao/ic_info.png')}
                                    height={14}
                                    width={14}
                                />
                            </div>
                        </div>
                        <Span>{renderContent(title)}</Span>
                    </Row>
                    {/* <div className="divide-y divide-[#36445A]"></div> */}
                </div>
            ));
        };

        const onViewAll = () => {
            window.open(`/${router.locale}/futures/trading-rule`)
        }

        return (
            <Modal
                isVisible={isShowModalInfo}
                onBackdropCb={() => setIsShowModalInfo(false)}
                containerClassName={'w-[650px]'}
            >
                <div className={'px-1 flex justify-between w-full'}>
                    <p
                        className={
                            'leading-6 text-sm text-txtPrimary dark:text-txtPrimary-dark font-semibold'
                        }
                    >
                        {t('futures:trading_rules')}
                    </p>
                    <X
                        onClick={() => handleToggleModalInfo(false)}
                        size={16}
                        strokeWidth={1.2}
                        className="cursor-pointer text-darkBlue dark:text-darkBlue-5"
                    />
                </div>

                <div className="w-full h-[1px] bg-divider dark:bg-divider-dark"></div>

                <div className={'pb-[16px] pt-[24px] relative flex justify-between'}>
                    {/* Select */}
                    <div className="flex-1">
                        <div
                            className="relative cursor-pointer group max-w-[100px]"
                            onMouseOver={() => setIsShowModalPriceList(true)}
                            onMouseLeave={() => setIsShowModalPriceList(false)}
                        >
                            <div className="relative z-10 flex items-center text-lg font-bold leading-6 ">
                                {currentExchangeConfig?.config?.baseAsset
                                    ? currentExchangeConfig?.config?.baseAsset +
                                    '/' +
                                    currentExchangeConfig?.config?.quoteAsset
                                    : '-/-'}
                                <ChevronDown
                                    size={16}
                                    className={classNames(
                                        'mt-1 ml-2 transition-transform duration-75',
                                        {
                                            'rotate-180': isShowModalPriceList
                                        }
                                    )}
                                />
                            </div>
                            <div
                                className="relative z-10 text-xs font-medium leading-5 text-txtSecondary dark:text-txtSecondary-dark">
                                {t('futures:tp_sl:perpetual')}
                            </div>
                            <div
                                className="absolute left-0 z-30 hidden group-hover:block top-full"
                                ref={pairListModalRef}
                            >
                                <FuturesPairList
                                    mode={pairListMode}
                                    setMode={setPairListMode}
                                    isAuth={isAuth}
                                    activePairList={isShowModalPriceList}
                                    onSelectPair={onSelectPair}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-end flex-1">
                        {renderLastPrice(true)}
                        <div
                            className={classNames('text-dominant text-xs ', {
                                '!text-red': priceFromMarketWatch?.priceChangePercent < 0
                            })}
                        >
                            {formatNumber(
                                roundTo(priceFromMarketWatch?.priceChangePercent * 100 || 0, 2),
                                2,
                                2,
                                true
                            )}
                            %
                        </div>
                    </div>
                </div>

                <div className="w-full h-[1px] bg-divider dark:bg-divider-dark mb-[16px]"></div>

                <div className={'flex w-full'}>
                    <div className={'flex flex-1 flex-col pr-4'}>
                        {renderInformation(ITEMS_WITH_TOOLTIPS)}
                    </div>
                    <div className={'flex flex-1 flex-col pl-4'}>
                        {renderInformation(RIGHT_ITEMS_WITH_TOOLTIPS)}
                    </div>
                </div>
                <div onClick={onViewAll} className="text-sm h-11 rounded-md bg-teal text-white w-full mt-6 flex items-center justify-center font-medium cursor-pointer">
                    {t('futures:view_all_trading_rule')}
                </div>
            </Modal>
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
                className="relative cursor-pointer group"
                onMouseOver={() => setActivePairList(true)}
                onMouseLeave={() => setActivePairList(false)}
            >
                <div className="relative z-10 flex items-center font-bold text-[18px]">
                    {pairPrice?.baseAsset
                        ? pairPrice?.baseAsset + '/' + pairPrice?.quoteAsset
                        : '-/-'}
                    <ChevronDown
                        size={16}
                        className={classNames('mt-1 ml-2 transition-transform duration-75', {
                            'rotate-180': activePairList
                        })}
                    />
                </div>
                <div
                    className="relative z-10 flex items-center text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    {t('futures:tp_sl:perpetual')}
                    <div onClick={handleToggleModalInfo} className={'ml-1'}>
                        <img
                            src={getS3Url('/images/icon/ic_book-open.png')}
                            height={14}
                            width={14}
                        />
                    </div>
                </div>
                <div
                    className="absolute left-0 z-30 hidden group-hover:block top-full"
                    ref={pairListRef}
                >
                    <FuturesPairList
                        mode={pairListMode}
                        setMode={setPairListMode}
                        isAuth={isAuth}
                        activePairList={activePairList}
                    />
                </div>
                {/* )} */}
            </div>

            {/* Price */}
            {renderLastPrice()}
            {RenderInfoModal()}

            {/* Details */}
            <InfoSlider forceUpdateState={forceUpdateState} className="ml-2">
                {renderPairPriceItems()}
            </InfoSlider>
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
        const url = router.locale === 'en'
            ? 'https://nami.exchange/support/announcement/announcement/apply-funding-rates-on-nami-futures-and-onus-futures'
            : 'https://nami.exchange/vi/support/announcement/thong-bao/thong-bao-ra-mat-co-che-funding-rate-tren-nami-futures-va-onus-futures';
        window.open(url);
    };

    return (
        <>
            {/* <div className="cursor-pointer min-w-[10px]" onClick={() => setShowModal(true)}>
                <img src={getS3Url('/images/icon/ic_help.png')} height={10} width={10} />
            </div> */}
            <Modal isVisible={visible} onBackdropCb={onClose} containerClassName="max-w-[342px]"
            >
                <div className="font-semibold">{isFunding ? 'Funding' : t('futures:countdown')}</div>
                <div className="text-gray4 text-sm pt-4"> {isFunding ? t('futures:funding_rate_des') : t('common:countdown_tooltip')}
                    {isFunding && <span onClick={onDetail} className="text-teal font-semibold cursor-pointer">{t('common:read_more')}</span>}
                </div>
                {isFunding && <div onClick={onRedirect}
                    className="bg-teal pd-[10px] text-white text-center w-full text-sm font-semibold cursor-pointer rounded-md mt-4 h-11 flex items-center justify-center">{t('futures:funding_history')}</div>}
            </Modal>
        </>
    );
};

const PAIR_PRICE_DETAIL_ITEMS = [
    {
        key: 2,
        code: 'fundingCountdown',
        localized: 'futures:funding_countdown',
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
    },
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
        title: 'swap_fee',
        tooltip: 'swap_fee_tooltips',
        leftPercent: 30
    }
];

const Row = styled.div.attrs({
    className: 'flex items-center justify-between border-b border-onus-input2 last:border-0 w-full'
})``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `font-medium text-darkBlue dark:text-white leading-[22px] text-sm text-right `
}))``;

export default FuturesPairDetail

