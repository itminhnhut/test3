import AssetLogo from 'components/wallet/AssetLogo';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { formatNumber, formatPrice, getFilter, getS3Url } from 'redux/actions/utils';
import TableV2 from 'components/common/V2/TableV2';
import SearchInput from 'src/components/markets/SearchInput';
import Tooltip from 'components/common/Tooltip';
import { useSelector } from 'react-redux';
import { ExchangeOrderEnum } from 'redux/actions/const';
import NoData from 'components/common/V2/TableV2/NoData';
import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import ModalV2 from 'components/common/V2/ModalV2';
import useApp from 'hooks/useApp';
import { ChevronLeft } from 'react-feather';
import router from 'next/router';

export const CURRENCIES = [
    {
        name: 'VNDC',
        value: 'VNDC'
    },
    {
        name: 'USDT',
        value: 'USDT'
    }
];
const limit = 10;
const initColumns = [
    {
        title: 'min_order_size',
        tooltip: 'min_order_size_tooltips',
        width: 200
    },
    {
        title: 'max_order_size_limit',
        tooltip: 'max_order_size_limit_tooltip',
        width: 250
    },
    {
        title: 'max_order_size_market',
        tooltip: 'max_order_size_market_tooltip',
        width: 250
    },
    {
        title: 'total_max_trading_volumn',
        tooltip: 'total_max_trading_volumn_tooltips',
        width: 250
    },
    {
        title: 'max_number_order',
        tooltip: 'max_number_order_tooltips',
        width: 300
    },
    {
        title: 'min_limit_order_price',
        tooltip: 'min_limit_order_price_tooltips',
        width: 250
    },
    {
        title: 'max_limit_order_price',
        tooltip: 'max_limit_order_price_tooltips',
        width: 250
    },
    {
        title: 'max_leverage',
        tooltip: 'max_leverage_tooltips',
        width: 180
    },
    {
        title: 'liq_fee_rate',
        tooltip: 'liq_fee_rate_tooltips',
        width: 250
    },
    {
        title: 'min_difference_ratio',
        tooltip: 'min_difference_ratio_tooltip',
        width: 220
    }
];
const TradingRules = () => {
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const isApp = useApp();
    const isMobile = width < 820;
    const pairConfigs = useSelector((state) => state.futures.pairConfigs);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);

    const [strSearch, setStrSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currency, setCurrency] = useState(CURRENCIES[0].value);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!publicSocket) return;
        publicSocket.emit('subscribe:futures:ticker', 'all');
        return () => {
            if (publicSocket) publicSocket?.emit('unsubscribe:futures:ticker', 'all');
        };
    }, [publicSocket]);

    const pairConfigsFilter = useMemo(() => {
        return pairConfigs.filter((i) => i.quoteAsset === currency);
    }, [pairConfigs, currency]);

    const dataSource = useMemo(() => {
        let dataFilter = pairConfigsFilter;
        if (strSearch) {
            dataFilter = dataFilter?.filter((i) => i?.pair?.toLowerCase().includes(strSearch?.toLowerCase()));
        }
        setLoading(false);
        setCurrentPage(1);
        return dataFilter;
    }, [pairConfigsFilter, strSearch]);

    const renderHead = useCallback(
        (title, tooltip) => {
            return (
                <>
                    {!isMobile && (
                        <Tooltip id={title} place="top" effect="solid" isV3>
                            <div className="text-sm max-w-[300px] text-left">{t(tooltip)}</div>
                        </Tooltip>
                    )}
                    <div
                        className={`text-sm flex items-center space-x-1 md:space-x-3 ${
                            isMobile ? '' : 'border-b border-dashed border-divider dark:border-divider-dark'
                        }`}
                        data-tip=""
                        data-for={title}
                        id={tooltip}
                    >
                        {t(title)}
                    </div>
                </>
            );
        },
        [isMobile]
    );

    const general = (item) => {
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, item || []);
        const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, item || []);
        const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, item || []);
        const quantityFilterMarket = getFilter(ExchangeOrderEnum.Filter.MARKET_LOT_SIZE, item || []);
        const maxNumOrderFilter = getFilter(ExchangeOrderEnum.Filter.MAX_NUM_ORDERS, item || []);
        const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, item || []);
        const maxVolumeFilter = getFilter(ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME, item || []);
        return {
            priceFilter,
            percentPriceFilter,
            minNotionalFilter,
            quantityFilterMarket,
            maxNumOrderFilter,
            quantityFilter,
            maxVolumeFilter
        };
    };

    const renderContent = (key, item) => {
        const quoteAsset = item?.quoteAsset || '';
        const currentAssetConfig = assetConfig?.find((i) => i.assetCode === quoteAsset);
        const lastPrice = marketWatch?.[item?.symbol]?.lastPrice ?? 0;
        const { priceFilter, percentPriceFilter, minNotionalFilter, quantityFilterMarket, maxNumOrderFilter, quantityFilter, maxVolumeFilter } = general(item);
        const decimal = currentAssetConfig?.assetDigit || 0;
        switch (key) {
            case 'min_order_size':
                return formatPrice(minNotionalFilter?.notional) + ' ' + quoteAsset;
            case 'max_order_size_limit':
                return lastPrice ? formatNumber(quantityFilter?.maxQuoteQty, decimal) + ' ' + quoteAsset : '-';
            case 'max_order_size_market':
                return lastPrice ? formatNumber(quantityFilterMarket?.maxQuoteQty, decimal) + ' ' + quoteAsset : '-';
            case 'max_number_order':
                return (maxNumOrderFilter?.limit || 0) + ' ' + t('futures:order');
            case 'min_limit_order_price':
                const _minPrice = priceFilter?.minPrice;
                return lastPrice ? formatPrice(Math.max(_minPrice, lastPrice * percentPriceFilter?.multiplierDown), decimal) + ' ' + quoteAsset : '-';
            case 'max_limit_order_price':
                const _maxPrice = priceFilter?.maxPrice;
                return lastPrice ? formatPrice(Math.min(_maxPrice, lastPrice * percentPriceFilter?.multiplierUp), decimal) + ' ' + quoteAsset : '-';
            case 'total_max_trading_volumn':
                return formatPrice(maxVolumeFilter?.notional || 0) + ' ' + quoteAsset;
            case 'max_leverage':
                return (item?.leverageConfig?.max || '-') + 'x';
            case 'liq_fee_rate':
                return '1%';
            case 'min_difference_ratio':
                const _minRatio = percentPriceFilter?.minDifferenceRatio;
                return formatNumber(_minRatio * 100, 3) + '%';
            default:
                return '-';
        }
    };

    const renderLogo = (item) => (
        <div className="flex items-center space-x-3 md:space-x-4 whitespace-nowrap font-semibold">
            <AssetLogo assetId={item?.baseAssetId} size={isMobile ? 24 : 32} />
            <div>
                {item?.baseAsset}/{item?.quoteAsset}&nbsp;{t('futures:funding_history_tab:perpetual')}
            </div>
        </div>
    );

    const columns = useMemo(() => {
        const cls = [
            {
                key: 'symbol',
                dataIndex: 'symbol',
                title: <span className="text-sm">{t('futures:funding_history_tab:contract')}</span>,
                align: 'left',
                width: 250,
                sorter: false,
                fixed: width >= 992 ? 'none' : 'left',
                render: (data, item) => renderLogo(item)
            }
        ].concat(
            initColumns.map((c) => {
                return {
                    key: c.title,
                    dataIndex: c.title,
                    title: renderHead(`futures:${c.title}`, `futures:${c.tooltip}`),
                    align: 'right',
                    width: c?.width ?? 180,
                    sorter: false,
                    render: (data, item) => <span className="text-sm">{renderContent(c.title, item)}</span>
                };
            })
        );

        return cls;
    }, [dataSource, marketWatch]);

    const totalPage = useMemo(() => {
        return Math.ceil(dataSource.length / limit);
    }, [dataSource]);

    return (
        <MaldivesLayout>
            {isApp && (
                <div className="px-4 py-3 border-b border-divider dark:border-divider-dark fixed top-0 w-full bg-white dark:bg-dark z-10">
                    <ChevronLeft onClick={() => router.back()} />
                </div>
            )}
            {isMobile && <GlossaryModal isVisible={showModal} onClose={() => setShowModal(false)} />}
            <div className={classNames('mt-10 sm:mt-20 mx-4 pb-20', { 'pt-12': isApp })}>
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                    <div className="flex justify-between mb-7 sm:mb-20">
                        <div className="text-xl sm:text-[2rem] sm;leading-[2.375rem] font-semibold ">{t('futures:trading_rules')}</div>
                        {isMobile && <HelperIcon onClick={() => setShowModal(true)} />}
                    </div>
                    <div className="sm:flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4 text-sm sm:text-base mb-12 sm:mb-0">
                            {CURRENCIES.map((rs) => (
                                <div
                                    className={classNames(
                                        'text-txtSecondary dark:text-txtSecondary-dark text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-3 border border-divider dark:border-divider-dark rounded-full cursor-pointer',
                                        {
                                            '!border-teal !text-teal font-semibold bg-teal/[0.1]': currency === rs.value
                                        }
                                    )}
                                    onClick={() => setCurrency(rs.value)}
                                >
                                    {rs.name}
                                </div>
                            ))}
                        </div>
                        <SearchInput
                            placeholder={t('futures:funding_history_tab:find_pair')}
                            customWrapperStyle={{ maxWidth: 368 }}
                            handleFilterAssetsList={setStrSearch}
                        />
                    </div>

                    {isMobile ? (
                        dataSource.length > 0 ? (
                            <>
                                <div className="divide-y border-divider dark:divide-divider-dark mt-6">
                                    {dataSource.map((item, index) => {
                                        const hidden = index + 1 > currentPage * limit;
                                        return (
                                            <div key={index} className={`space-y-6 flex flex-col ${index !== 0 ? 'py-8' : 'pb-8'} ${hidden ? 'hidden' : ''}`}>
                                                <div>{renderLogo(item)}</div>
                                                <div className="text-sm leading-6 space-y-4 flex flex-col ">
                                                    {initColumns.map((c) => (
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{renderHead(`futures:${c.title}`, `futures:${c.tooltip}`)}</div>
                                                            <div className="text-txtPrimary dark:text-gray-4">{renderContent(c.title, item)} </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {totalPage > currentPage && (
                                    <div
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="text-teal text-sm font-semibold text-center cursor-pointer mt-2"
                                    >
                                        {t('futures:load_more')}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NoData />
                        )
                    ) : (
                        <TableV2
                            defaultSort={{ key: 'asset', direction: 'desc' }}
                            useRowHover
                            sort={!isMobile}
                            data={dataSource}
                            columns={columns}
                            rowKey={(item) => `${item?.key}`}
                            loading={loading}
                            limit={10}
                            skip={0}
                            onChangePage={setCurrentPage}
                            page={currentPage}
                            isSearch={strSearch}
                            className="border border-divider dark:border-divider-dark rounded-xl"
                            pagingClassName="border-none"
                        />
                    )}
                </div>
            </div>
        </MaldivesLayout>
    );
};

export default TradingRules;

const HelperIcon = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 16h-2v-2h2v2zm.976-4.885c-.196.158-.385.309-.535.459-.408.407-.44.777-.441.793v.133h-2v-.167c0-.118.029-1.177 1.026-2.174.195-.195.437-.393.691-.599.734-.595 1.216-1.029 1.216-1.627a1.934 1.934 0 0 0-3.867.001h-2A3.939 3.939 0 0 1 12 6a3.939 3.939 0 0 1 3.934 3.934c0 1.597-1.179 2.55-1.958 3.181z"
            fill="#47CC85"
        />
    </svg>
);

const GlossaryModal = ({ isVisible, onClose }) => {
    const { t } = useTranslation();
    return (
        <ModalV2 className="!max-w-[488px]" isVisible={isVisible} onBackdropCb={onClose} isMobile>
            <div className="text-xl mb-8">{t('futures:the_glossary')}</div>
            <div className="divide-y divide-divider-dark">
                {initColumns.map((rs) => (
                    <div className="flex items-center justify-between text-sm space-x-7 w-full py-3">
                        <lable className="font-semibold min-w-[120px] max-w-[120px]">{t(`futures:${rs.title}`)}</lable>
                        <span className="text-txtSecondary-dark w-full">{t(`futures:${rs.tooltip}`)}</span>
                    </div>
                ))}
            </div>
        </ModalV2>
    );
};
