import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Tooltip from 'components/common/Tooltip';
import { countDecimals, formatBalance, formatPrice, formatWallet, getFilter, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { ExchangeOrderEnum, PublicSocketEvent } from 'redux/actions/const';
import Emitter from 'redux/actions/emitter';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import styled from 'styled-components';
import { createSelector } from 'reselect';

const getPairPrice = createSelector(
    [
        state => state.futures,
        (state, pair) => pair
    ],
    (futures, pair) => futures.marketWatch[pair]
);

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
        title: 'swap_fee',
        tooltip: 'swap_fee_tooltips',
        leftPercent: 30
    }
];

export default function OrderInformation({ pair }) {
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const assetConfig = useSelector(state => state.utils.assetConfig);

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const [pairPrice, setPairPrice] = useState(null);
    const [lastSymbol, setLastSymbol] = useState(null);
    const priceFromMarketWatch = useSelector(state => getPairPrice(state, pair));
    const _pairPrice = pairPrice || priceFromMarketWatch;
    const lastPrice = _pairPrice?.lastPrice;
    useEffect(() => {
        if (!symbolOptions?.symbol) return;
        // ? Subscribe publicSocket
        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbolOptions.symbol, async (data) => {
            if (symbolOptions.symbol === data?.s && data?.p > 0) {
                const _pairPrice = FuturesMarketWatch.create(data);
                setPairPrice(_pairPrice);
            }
        });
        return () => {
            // Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol);
        };
    }, [symbolOptions?.symbol]);

    const currentExchangeConfig = useMemo(() => {
        const exchange = allPairConfigs.find(
            (e) => e.symbol === pair);

        const priceFilter = getFilter(
            ExchangeOrderEnum.Filter.PRICE_FILTER,
            exchange || []
        );
        const quantityFilter = getFilter(
            ExchangeOrderEnum.Filter.LOT_SIZE,
            exchange || []
        );
        const minNotionalFilter = getFilter(
            ExchangeOrderEnum.Filter.MIN_NOTIONAL,
            exchange || []
        );
        const maxNumberVolumeFilter = getFilter(
            ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME, exchange || []);
        const maxNumOrderFilter = getFilter(ExchangeOrderEnum.Filter.MAX_NUM_ORDERS, exchange || []);
        const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, exchange || []);

        // const minNotionalFilter = getFilter(
        //     ExchangeOrderEnum.Filter.,
        //     currentExchangeConfig || [],
        // );
        const baseAssetId = currentExchangeConfig?.baseAssetId || 0;
        const quoteAssetId = currentExchangeConfig?.quoteAssetId || 0;

        return {
            priceFilter,
            exchange,
            quantityFilter,
            minNotionalFilter,
            maxNumOrderFilter,
            maxNumberVolumeFilter,
            percentPriceFilter
        };
    }, [allPairConfigs, pair]);

    const priceFilter = getFilter(
        ExchangeOrderEnum.Filter.PRICE_FILTER,
        currentExchangeConfig || []
    );
    const symbolOptions = useMemo(() => {
        return allPairConfigs.find(rs => rs.symbol === pair);
    }, [pair, allPairConfigs]);

    const renderContent = (title) => {
        const quoteAsset = currentExchangeConfig?.exchange?.quoteAsset || '';
        // const formatPriceOpts = getDecimalScale(+currentExchangeConfig.priceFilter?.tickSize) || 6;
        switch (title) {
            case 'min_order_size': {
                return formatPrice(currentExchangeConfig.minNotionalFilter?.notional,) + ' ' + quoteAsset;
            }
            case 'max_order_size': {
                return formatPrice(currentExchangeConfig.quantityFilter.maxQty * pairPrice?.lastPrice,) + ' ' + quoteAsset;
            }
            case 'total_max_trading_volumn':
                return formatPrice(currentExchangeConfig.maxNumberVolumeFilter?.notional || 0) + ' ' + quoteAsset;
            case 'max_number_order':
                return (currentExchangeConfig?.maxNumOrderFilter?.limit || 0) + ' ' + t('futures:order');
            case 'min_limit_order_price': {
                const _maxPrice = currentExchangeConfig.priceFilter?.maxPrice;
                const _minPrice = currentExchangeConfig.priceFilter?.minPrice;
                let _activePrice = _pairPrice?.lastPrice;
                // if (mode !== 'price') {
                //     if (type === 'LIMIT') {
                //         _activePrice = price;
                //     } else if (type === 'STOP_MARKET') {
                //         _activePrice = stopPrice;
                //     }
                // }

                // Truong hop dat lenh market
                const lowerBound = {
                    min: Math.max(_minPrice, _activePrice * currentExchangeConfig?.percentPriceFilter?.multiplierDown),
                    max: Math.min(_activePrice, _activePrice * (1 - currentExchangeConfig?.percentPriceFilter?.minDifferenceRatio))
                };

                const upperBound = {
                    min: Math.max(_activePrice, _activePrice * (1 + currentExchangeConfig?.percentPriceFilter?.minDifferenceRatio)),
                    max: Math.min(_maxPrice, _activePrice * currentExchangeConfig?.percentPriceFilter?.multiplierUp)
                };
                return formatPrice(Math.max(_minPrice, _activePrice * currentExchangeConfig?.percentPriceFilter?.multiplierDown)) + ' ' + quoteAsset;
            }
            case 'max_limit_order_price': {
                const _maxPrice = currentExchangeConfig.priceFilter?.maxPrice;
                const _minPrice = currentExchangeConfig.priceFilter?.minPrice;
                let _activePrice = _pairPrice?.lastPrice;
                return formatPrice(Math.min(_maxPrice, _activePrice * currentExchangeConfig?.percentPriceFilter?.multiplierUp)) + ' ' + quoteAsset;
            }
            case 'max_leverage':
                return (currentExchangeConfig.exchange?.leverageConfig?.max || '-') + 'x';
            case 'liq_fee_rate':
                return '1%';
            case 'swap_fee':
                return '0.0015%';
            default:
                return '-';
        }
    };

    return (
        <div className={'py-4 px-4'}>
            <p className="text-lg my-4 leading-6 font-semibold">
                {t('futures:trading_rules')}
            </p>
            <div className="bg-[#243042] rounded-[8px]">
                {ITEMS_WITH_TOOLTIPS.map(({
                    title,
                    tooltip,
                    leftPercent
                }, index) => (
                    <div
                        className={classNames('px-3 w-full', {
                            'divide-y divide-[#36445A]': !(index === ITEMS_WITH_TOOLTIPS.length - 1)
                        })}
                    >
                        <div className="py-[13px] flex  w-full w-100">
                            <Tooltip id={title} place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                                     className={`!mx-7 !-mt-2 !px-3 !py-5 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2`}
                                     overridePosition={(e) => ({
                                         left: 0,
                                         top: e.top
                                     })}
                            >
                                <div>
                                    <label
                                        className="font-medium text-white text-sm leading-[18px]">{t('futures:' + title)}</label>
                                    <div
                                        className="mt-3 text-3 font-normal text-white leading-[18px]">{t('futures:' + tooltip)}</div>
                                </div>
                            </Tooltip>
                            <Row>
                                <Label className="">
                                    {t('futures:' + title)}
                                    <div className="px-2 flex" data-tip="" data-for={title} id={tooltip}>
                                        <img src={getS3Url('/images/icon/ic_help.png')} height={14} width={14}/>
                                    </div>
                                </Label>
                                <Span className="">{renderContent(title)}</Span>
                            </Row>
                        </div>
                        <div className="divide-y divide-[#36445A]"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const Row = styled.div.attrs({
    className: 'flex items-center justify-between border-b border-onus-input2 last:border-0 w-full'
})``;

const Label = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-gray-1 text-left text-onus-grey font-medium text-sm leading-5 text-gray font-normal flex items-center`
}))``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `font-medium text-white leading-[22px] text-sm text-right `
}))``;
