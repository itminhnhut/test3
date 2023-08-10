import classNames from 'classnames';
import Tooltip from 'components/common/Tooltip';
import PopoverV2 from 'components/common/V2/PopoverV2';
import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';
import reverse from 'lodash/reverse';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { ORDER_BOOK_MODE } from 'redux/actions/const';
import { IconLoading } from 'components/common/Icons';
import SvgChevronDown from 'components/svg/ChevronDown';
import { ExchangeOrderEnum, PublicSocketEvent } from 'redux/actions/const';
import Emitter from 'redux/actions/emitter';
import { getOrderBook } from 'redux/actions/market';
import { SET_SPOT_SELECTED_ORDER } from 'redux/actions/types';
import { RefCurrency, exponentialToDecimal, formatNumber, getFilter, getSymbolString } from 'redux/actions/utils';
import { handleTickSize } from 'utils/MarketDepthMerger';
import LastPrice from '../markets/LastPrice';

import dynamic from 'next/dynamic';

const OrderBookAll = dynamic(() => import('components/svg/OrderBookAll'), { ssr: false });
const OrderBookBids = dynamic(() => import('components/svg/OrderBookBids'), { ssr: false });
const OrderBookAsks = dynamic(() => import('components/svg/OrderBookAsks'), { ssr: false });

const initHoverData = {
    index: null,
    side: null
};

const OrderBook = ({ symbol, layoutConfig, parentState, isPro, decimals }) => {
    const { t } = useTranslation(['common', 'spot']);
    const { base, quote } = symbol;
    const dispatch = useDispatch();
    const setSelectedOrder = (order) => {
        dispatch({
            type: SET_SPOT_SELECTED_ORDER,
            payload: order
        });
    };
    const quoteAsset = useSelector((state) => state.user.quoteAsset) || 'USDT';
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const router = useRouter();
    const popover = useRef(null);

    const [tickSize, setTickSize] = useState(0.01);
    const [tickSizeOptions, setTickSizeOptions] = useState([]);

    const [orderBook, setOrderBook] = useState({ bids: [], asks: [], mode: ORDER_BOOK_MODE.ALL, loading: true });

    const [height, setHeight] = useState(0);
    const ref = useRef(null);
    const lastPrice = useRef(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref.current, layoutConfig?.h, isPro]);

    useAsync(async () => {
        // Get symbol list
        const _orderBook = await getOrderBook(getSymbolString(symbol));
        setOrderBook((prev) => ({ ...prev, ..._orderBook, loading: false }));
    }, [symbol]);

    const handleRouteChange = async () => {
        setOrderBook((prev) => ({ ...prev, loading: true }));
    };

    useEffect(() => {
        if (orderBook) {
            parentState({
                orderBook: {
                    bids: orderBook.bids,
                    asks: orderBook.asks
                }
            });
        }
    }, [orderBook]);

    useEffect(() => {
        const event = PublicSocketEvent.SPOT_DEPTH_UPDATE + 'order_book';
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            if (data?.s === `${symbol.base}${symbol.quote}`) {
                lastPrice.current = data?.p;
            }
        });
        Emitter.on(event, async (data) => {
            if (data?.symbol === `${symbol.base}${symbol.quote}`) {
                setOrderBook((prev) => ({ ...prev, ...data, loading: false }));
            }
        });
        router.events.on('routeChangeStart', handleRouteChange);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return function cleanup() {
            Emitter.off(event);
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [symbol]);

    useEffect(() => {
        if (exchangeConfig.length <= 0) return;
        const currentExchangeConfig = exchangeConfig.find((e) => e.symbol === getSymbolString(symbol));
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, currentExchangeConfig || []);
        if (!priceFilter) return;
        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(exponentialToDecimal(+priceFilter?.tickSize * 10 ** i));
        }
        setTickSizeOptions(result);
        setTickSize(+priceFilter?.tickSize);
    }, [exchangeConfig, symbol]);

    const divide = orderBook.mode === ORDER_BOOK_MODE.ALL ? 2 : 1;

    const MAX_LENGTH = Math.floor((height - 165) / divide / 20);

    const asks = useMemo(() => {
        const originAsks = orderBook?.asks?.length > 0 ? orderBy(orderBook?.asks, [(e) => +e[0]]) : [];
        const reverseAsks = reverse([...originAsks]);
        return orderBy(handleTickSize(reverseAsks, tickSize, 'ask').slice(-MAX_LENGTH), [(e) => +e[0]], ['desc']);
    }, [orderBook?.asks, tickSize]);

    const bids = useMemo(() => {
        const originBids = orderBook?.bids?.length > 0 ? orderBy(orderBook?.bids, [(e) => +e[0]], 'desc') : [];
        return orderBy(handleTickSize(originBids, tickSize, 'bids').slice(0, MAX_LENGTH), [(e) => -e[0]]);
    }, [orderBook?.bids, tickSize]);

    const [hoverData, setHoverData] = useState(initHoverData);

    const hoveringDataCalculate = useMemo(() => {
        const { index, side } = hoverData;
        if (isNaN(index) || !side)
            return {
                totalQuantity: 0,
                totalQuote: 0,
                priceAvg: 0
            };
        const rows = side === 'buy' ? asks : bids;
        const startSlice = side === 'buy' ? index : 0;
        const endSlice = side === 'buy' ? rows.length : index + 1;
        const newRows = [...rows].slice(startSlice, endSlice);
        return {
            totalQuantity: newRows.reduce((quantity, [_, curQuantity]) => quantity + curQuantity, 0) ?? 0,
            totalQuote: newRows.reduce((quote, [curPrice, curQuantity]) => quote + curQuantity * curPrice, 0) ?? 0,
            priceAvg: newRows.reduce((price, [curPrice, _]) => +price + +curPrice, 0) / newRows.length ?? 0
        };
    }, [asks, bids, hoverData.index]);

    const renderOrderRow = useCallback(
        (order, index, side) => {
            const [p, q] = order;
            const rows = side === 'buy' ? asks : bids;
            const maxQuote = maxBy(rows, (o) => {
                return o[1];
            })?.[1];

            const percentage = (q / maxQuote) * 100;
            const isSameSide = side === hoverData?.side;
            const isHover = isSameSide && (side === 'buy' ? index >= hoverData?.index : index <= hoverData?.index);
            return (
                <>
                    <Tooltip
                        overridePosition={({ top, left }) => {
                            const gap = isPro ? 11 : -10;
                            return {
                                top,
                                left: left + gap
                            };
                        }}
                        place={isPro ? 'left' : 'right'}
                        className={`max-w-[400px] !px-4 !py-3`}
                        effect="solid"
                        isV3
                        id={`${index}-${side}`}
                    >
                        <div className="w-[200px] text-sm z-50 space-y-1">
                            <div className="flex gap-6 justify-between items-center">
                                <span>{t('spot:orderbook_tooltip.avg_price')} </span>
                                <span>≈ {formatNumber(+hoveringDataCalculate.priceAvg, decimals.price)}</span>
                            </div>
                            <div className="flex gap-6 justify-between items-center">
                                <span>
                                    {' '}
                                    {t('common:total')} {base?.toUpperCase()}:{' '}
                                </span>
                                <span>{formatNumber(+hoveringDataCalculate.totalQuantity, decimals.qty)}</span>
                            </div>
                            <div className="flex gap-6 justify-between items-center">
                                <span>
                                    {' '}
                                    {t('common:total')} {quote?.toUpperCase()}:{' '}
                                </span>
                                <span>{formatNumber(+hoveringDataCalculate.totalQuote, quoteAsset === 'VNDC' ? 0 : 2)}</span>
                            </div>
                        </div>
                    </Tooltip>

                    <div
                        data-tip=""
                        data-for={`${index}-${side}`}
                        className={classNames(
                            `progress-container my-[1px] cursor-pointer hover:bg-teal-lightTeal dark:hover:bg-darkBlue-3 border-transparent`,
                            {
                                'border-t': side === 'buy',
                                'border-b': side === 'sell',
                                [`px-4  `]: isPro,
                                'pr-3': !isPro,
                                'bg-teal-lightTeal dark:bg-darkBlue-3': isHover,
                                [`${side === 'buy' ? 'border-t' : 'border-b'} border-hover-dark dark:border-hover border-dashed`]:
                                    hoverData?.index === index && isSameSide
                            }
                        )}
                        onMouseOver={() => {
                            setHoverData({ index, side });
                        }}
                        key={index}
                        onClick={() => setSelectedOrder({ price: +p, quantity: +q })}
                    >
                        <div className="flex items-center flex-1">
                            <div className={`flex-1  text-xs font-medium leading-table ${side === 'buy' ? 'text-red' : 'text-teal'}`}>
                                {p ? formatNumber(p, decimals.price) : '-'}
                            </div>
                            <div className="flex-1 text-Primary dark:text-txtPrimary-dark text-xs font-medium leading-table text-right">
                                {q ? formatNumber(+q, decimals.qty) : '-'}
                            </div>
                            <div className="flex-1 text-Primary dark:text-txtPrimary-dark text-xs font-medium leading-table text-right">
                                {p > 0 ? formatNumber(p * q, quoteAsset === 'VNDC' ? 0 : 2) : '-'}
                            </div>
                        </div>
                        <div className={`progress-bar ${side === 'buy' ? 'ask-bar' : 'bid-bar'} `} style={{ width: `${parseInt(percentage, 10)}%` }} />
                    </div>
                </>
            );
        },
        [decimals, quoteAsset, isPro, asks, bids, hoverData, hoveringDataCalculate]
    );

    const renderOrderBook = (side) => {
        // side: buy|sell
        let inner;
        if (side === 'buy' && [ORDER_BOOK_MODE.ASKS, ORDER_BOOK_MODE.ALL].includes(orderBook.mode)) {
            inner = orderBook.loading ? (
                <div className="flex items-center justify-center h-full">
                    <IconLoading color="#0c0e14" />
                </div>
            ) : (
                <div
                    onMouseLeave={() => {
                        setHoverData(initHoverData);
                    }}
                    className=""
                >
                    {asks.map((order, index) => {
                        return renderOrderRow(order, index, 'buy');
                    })}
                </div>
            );
        } else if (side === 'sell' && [ORDER_BOOK_MODE.BIDS, ORDER_BOOK_MODE.ALL].includes(orderBook.mode)) {
            inner = orderBook.loading ? (
                <div className="flex items-center justify-center h-full">
                    <IconLoading color="#0c0e14" />
                </div>
            ) : (
                <div
                    onMouseLeave={() => {
                        setHoverData(initHoverData);
                    }}
                    className=""
                >
                    {bids.map((order, index) => {
                        return renderOrderRow(order, index, 'sell');
                    })}
                </div>
            );
        }

        if (inner) {
            return <div className={classNames('flex flex-col justify-start flex-1', { '!justify-end': side === 'buy' })}>{inner}</div>;
        }
        return null;
    };

    const renderTickSizeOptions = () => {
        return (
            <PopoverV2
                className="w-max"
                ref={popover}
                label={(open) => (
                    <div className="flex min-w-[63px] justify-between items-center h-6 rounded-[3px] bg-gray-10 dark:bg-dark-2 pl-2 pr-1 ">
                        <span className="text-xs font-semibold text-txtPrimary dark:text-txtSecondary-dark mr-2 ">{exponentialToDecimal(tickSize)}</span>
                        <SvgChevronDown className={`${open ? '!rotate-0' : ''}`} size={16} />
                    </div>
                )}
            >
                <div className="overflow-hidden rounded-md shadow-lg bg-white dark:bg-darkBlue-3">
                    <div className="relative py-2">
                        {tickSizeOptions.map((item, index) => {
                            const isActive = tickSize === item;
                            return (
                                <div
                                    onClick={() => {
                                        setTickSize(Number(item));
                                        popover.current.close();
                                    }}
                                    key={index}
                                    className={classNames(
                                        'h-8 leading-8 px-4 cursor-pointer w-max text-xs text-center text-txtSecondary dark:text-txtSecondary-dark hover:bg-gray-13 dark:hover:bg-hover-dark',
                                        { 'bg-opacity-10 dark:bg-opacity-10 !text-txtPrimary dark:!text-white font-semibold': isActive }
                                    )}
                                >
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopoverV2>
        );
    };

    return (
        <>
            <div
                className={classNames('relative h-full bg-bgSpotContainer dark:bg-bgSpotContainer-dark flex flex-col box-border overflow-hidden', {
                    'pl-6': !isPro
                })}
                ref={ref}
            >
                <div
                    className={classNames('flex items-center justify-between my-6', {
                        'px-4': isPro,
                        'pr-3': !isPro
                    })}
                >
                    <div className="flex justify-start space-x-3">
                        <OrderBookAll
                            className={`cursor-pointer ${orderBook.mode === ORDER_BOOK_MODE.ALL ? '' : 'opacity-50'}`}
                            onClick={() => setOrderBook((prev) => ({ ...prev, mode: ORDER_BOOK_MODE.ALL }))}
                        />
                        <OrderBookBids
                            className={`cursor-pointer ${orderBook.mode === ORDER_BOOK_MODE.BIDS ? '' : 'opacity-50'}`}
                            onClick={() => setOrderBook((prev) => ({ ...prev, mode: ORDER_BOOK_MODE.BIDS }))}
                        />
                        <OrderBookAsks
                            className={`cursor-pointer ${orderBook.mode === ORDER_BOOK_MODE.ASKS ? '' : 'opacity-50'}`}
                            onClick={() => setOrderBook((prev) => ({ ...prev, mode: ORDER_BOOK_MODE.ASKS }))}
                        />
                    </div>
                    {renderTickSizeOptions()}
                </div>
                <div className="flex flex-col flex-1 over">
                    <div className="">
                        <div
                            className={classNames('flex justify-between items-center  mb-6', {
                                'px-4': isPro
                            })}
                        >
                            <div className="flex flex-1 justify-start text-txtSecondary dark:text-txtSecondary-dark text-xs">
                                {t('price')} ({quote})
                            </div>
                            <div className="flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs">
                                {t('quantity')} ({base})
                            </div>
                            <div
                                className={classNames('flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs', {
                                    'pr-4': isPro,
                                    'pr-3': !isPro
                                })}
                            >
                                {t('total')} ({quote})
                            </div>
                        </div>
                    </div>
                    <div className=" flex flex-col">
                        {renderOrderBook('buy')}
                        <div
                            className={classNames(
                                'dark:border-divider-dark py-2 my-3 flex justify-center items-center',

                                {
                                    'px-4': isPro
                                }
                            )}
                        >
                            <div className="w-full flex items-center space-x-2">
                                <div className="font-semibold">
                                    <LastPrice symbol={symbol} colored exchangeConfig={exchangeConfig} />
                                </div>
                                <span className="text-txtSecondary dark:text-txtSecondary-dark text-xs">
                                    ~
                                    <RefCurrency price={lastPrice.current} quoteAsset={quote} />
                                </span>
                            </div>
                        </div>
                        {renderOrderBook('sell')}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderBook;
