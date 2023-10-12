import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Tooltip from 'components/common/Tooltip';
import { countDecimals, formatFundingRate, formatNumber, formatPrice, Countdown, getFilter, emitWebViewEvent, encodeUrlFromApp } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { ExchangeOrderEnum } from 'redux/actions/const';
import styled from 'styled-components';
import { createSelector } from 'reselect';
import { useRouter } from 'next/router'
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import Funding from './Funding';

const getPairPrice = createSelector(
    [
        state => state.futures,
        (state, pair) => pair
    ],
    (futures, pair) => futures.marketWatch[pair]
);

const ITEMS_WITH_TOOLTIPS = [
    {
        title: 'funding',
        tooltip: 'futures:funding_rate_des',
        leftPercent: 40
    },
    {
        title: 'countdown',
        tooltip: 'common:countdown_tooltip',
        leftPercent: 40
    },
    {
        title: 'min_order_size',
        tooltip: 'futures:min_order_size_tooltips',
        leftPercent: 40
    },
    {
        title: 'max_order_size_limit',
        tooltip: 'futures:max_order_size_limit_tooltip',
        leftPercent: 40
    },
    {
        title: 'max_order_size_market',
        tooltip: 'futures:max_order_size_market_tooltip',
        leftPercent: 60
    },
    {
        title: 'total_max_trading_volumn',
        tooltip: 'futures:total_max_trading_volumn_tooltips',
        leftPercent: 70
    },
    {
        title: 'max_number_order',
        tooltip: 'futures:max_number_order_tooltips',
        leftPercent: 70
    },
    {
        title: 'min_limit_order_price',
        tooltip: 'futures:min_limit_order_price_tooltips',
        leftPercent: 40
    },
    {
        title: 'max_limit_order_price',
        tooltip: 'futures:max_limit_order_price_tooltips',
        leftPercent: 40
    },
    {
        title: 'max_leverage',
        tooltip: 'futures:max_leverage_tooltips',
        leftPercent: 30
    },
    {
        title: 'liq_fee_rate',
        tooltip: 'futures:liq_fee_rate_tooltips',
        leftPercent: 41
    },
    {
        title: 'min_difference_ratio',
        tooltip: 'futures:min_difference_ratio_tooltip',
        leftPercent: 41
    },
    // {
    //     title: 'swap_fee',
    //     tooltip: 'swap_fee_tooltips',
    //     leftPercent: 30
    // }
];

export default function OrderInformation({ pair }) {
    const router = useRouter()
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const timesync = useSelector(state => state.utils.timesync)
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;

    const getDecimalPrice = (config) => {
        const decimalScalePrice = config?.filters.find(rs => rs.filterType === 'PRICE_FILTER') ?? 1;
        return countDecimals(decimalScalePrice?.tickSize);
    };

    const [pairPrice, setPairPrice] = useState(null);
    const priceFromMarketWatch = useSelector(state => getPairPrice(state, pair));
    const _pairPrice = pairPrice || priceFromMarketWatch;
    const lastPrice = _pairPrice?.lastPrice;
    // useEffect(() => {
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
    // }, [symbolOptions?.symbol]);

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
        const quantityFilterMarket = getFilter(
            ExchangeOrderEnum.Filter.MARKET_LOT_SIZE,
            exchange || []
        );
        return {
            priceFilter,
            exchange,
            quantityFilter,
            minNotionalFilter,
            maxNumOrderFilter,
            maxNumberVolumeFilter,
            percentPriceFilter,
            quantityFilterMarket
        };
    }, [allPairConfigs, pair]);

    // const priceFilter = getFilter(
    //     ExchangeOrderEnum.Filter.PRICE_FILTER,
    //     currentExchangeConfig || []
    // );
    // const symbolOptions = useMemo(() => {
    //     return allPairConfigs.find(rs => rs.symbol === pair);
    // }, [pair, allPairConfigs]);

    const renderContent = (title) => {
        const quoteAsset = currentExchangeConfig?.exchange?.quoteAsset || '';
        const currentAssetConfig = assetConfig?.find(item => item.assetCode === quoteAsset);
        const decimal = currentAssetConfig?.assetDigit || 0
        switch (title) {
            case 'min_order_size': {
                return formatPrice(currentExchangeConfig.minNotionalFilter?.notional,)
            }
            case 'max_order_size': {
                return formatPrice(currentExchangeConfig.quantityFilter.maxQuoteQty)
            }
            case 'total_max_trading_volumn':
                return formatPrice(currentExchangeConfig.maxNumberVolumeFilter?.notional || 0)
            case 'max_number_order':
                return (currentExchangeConfig?.maxNumOrderFilter?.limit || 0) + ' ' + t('futures:order');
            case 'min_limit_order_price': {
                const _minPrice = currentExchangeConfig.priceFilter?.minPrice;
                let _activePrice = _pairPrice?.lastPrice;
                return formatPrice(Math.max(_minPrice, _activePrice * currentExchangeConfig?.percentPriceFilter?.multiplierDown), decimal)
            }
            case 'max_limit_order_price': {
                const _maxPrice = currentExchangeConfig.priceFilter?.maxPrice;
                let _activePrice = _pairPrice?.lastPrice;
                return formatPrice(Math.min(_maxPrice, _activePrice * currentExchangeConfig?.percentPriceFilter?.multiplierUp), decimal)
            }
            case 'max_leverage':
                return (currentExchangeConfig.exchange?.leverageConfig?.max || '-') + 'x';
            case 'liq_fee_rate':
                return '1%';
            case 'min_difference_ratio': {
                const _minRatio = currentExchangeConfig?.percentPriceFilter?.minDifferenceRatio
                return (
                    formatNumber(
                        _minRatio*100,
                        3
                    ) +
                    '%'
                );
            }
            case 'max_order_size_limit': {
                return formatNumber(currentExchangeConfig?.quantityFilter?.maxQuoteQty, decimal)
            }
            case 'max_order_size_market': {
                return formatNumber(currentExchangeConfig?.quantityFilterMarket?.maxQuoteQty, decimal)
            }
            case 'funding': {
                return <Funding pairPrice={_pairPrice} symbol={pair} />
            }
            case 'countdown': {
                return <Funding.Countdown pairPrice={_pairPrice} symbol={pair} />
            }
            default:
                return '-';
        }
    };

    const onViewAll = () => {
        const uri = `/${router.locale}/futures/trading-rule?theme=dark&source=app&head=false&title=${t('futures:trading_rules')}`;
        emitWebViewEvent(encodeUrlFromApp(uri));
    };

    return (
        <div className={'py-4 px-4 overflow-y-auto h-[calc(100%-70px)]'}>
            <p className="text-lg my-4 leading-6 font-semibold">{t('futures:trading_rules')}</p>
            <div className="bg-gray-12 dark:bg-dark-4 rounded-[8px]">
                {ITEMS_WITH_TOOLTIPS.map(({ title, tooltip, leftPercent }, index) => (
                    <div
                        key={index}
                        className={classNames('px-3 w-full', {
                            'divide-y border-divider dark:border-divider-dark': !(index === ITEMS_WITH_TOOLTIPS.length - 1)
                        })}
                    >
                        <div className="py-[13px] flex w-full">
                            <Tooltip
                                id={title}
                                place={title === 'funding' ? 'bottom' : 'top'}
                                effect="solid"
                                className={`!mx-7 !px-3 !py-5 !bg-gray-15 dark:!bg-dark-2 !opacity-100 !rounded-lg`}
                                overridePosition={(e) => ({
                                    left: 0,
                                    top: e.top
                                })}
                                arrowColor={isDark ? colors.dark[2] : colors.gray[15]}
                            >
                                <div>
                                    <label className="font-medium text-white dark:text-txtPrimary-dark text-sm leading-[18px]">{t('futures:' + title)}</label>
                                    <div
                                        className="mt-3 text-3 font-normal text-white dark:text-txtPrimary-dark leading-[18px]"
                                        dangerouslySetInnerHTML={{ __html: t(tooltip) }}
                                    ></div>
                                </div>
                            </Tooltip>
                            <Row>
                                <Label className="">
                                    {t('futures:' + title)}
                                    <div className="flex px-2" data-tip="" data-for={title} id={tooltip}>
                                        <QuestionMarkIcon color="currentColor" size={14} />
                                    </div>
                                </Label>
                                <Span className="">{renderContent(title)}</Span>
                            </Row>
                        </div>
                        <div className="divide-y border-divider dark:border-divider-dark"></div>
                    </div>
                ))}
            </div>
            <div onClick={onViewAll} className="text-teal text-sm font-medium mt-6">
                {t('futures:view_all_trading_rule')}
            </div>
        </div>
    );
}

const Row = styled.div.attrs({
    className: 'flex items-center justify-between border-b border-divider dark:border-divider-dark last:border-0 w-full'
})``;

const Label = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-left text-gray-1 dark:text-txtSecondary-dark font-medium text-sm leading-5 font-normal flex items-center`
}))``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `font-medium text-txtPrimary dark:text-txtPrimary-dark leading-[22px] text-sm text-right `
}))``;
