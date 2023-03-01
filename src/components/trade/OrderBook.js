import { IconLoading } from 'src/components/common/Icons';
import { reverse } from 'lodash';
import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { ExchangeOrderEnum, PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { getOrderBook } from 'src/redux/actions/market';
import { SET_SPOT_SELECTED_ORDER } from 'src/redux/actions/types';
import { formatPrice, getFilter, getSymbolString, RefCurrency } from 'src/redux/actions/utils';
import LastPrice from '../markets/LastPrice';
import OrderBookAll from 'src/components/svg/OrderBookAll';
import OrderBookBids from 'src/components/svg/OrderBookBids';
import OrderBookAsks from 'src/components/svg/OrderBookAsks';
import { ORDER_BOOK_MODE } from 'redux/actions/const';
import SvgChevronDown from 'src/components/svg/ChevronDown';
import { getDecimalScale } from 'redux/actions/utils';
import { handleTickSize } from 'utils/MarketDepthMerger';
import classNames from 'classnames';
import PopoverV2 from 'components/common/V2/PopoverV2';

const OrderBook = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const { symbol, layoutConfig, parentState, isPro } = props;
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const { base, quote } = props.symbol;
    const dispatch = useDispatch();
    const setSelectedOrder = (order) => {
        dispatch({
            type: SET_SPOT_SELECTED_ORDER,
            payload: order
        });
    };
    const quoteAsset = useSelector((state) => state.user.quoteAsset) || 'USDT';
    const router = useRouter();
    const popover = useRef(null);

    const symbolString = useMemo(() => {
        return base + quote;
    }, [base, quote]);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const [tickSize, setTickSize] = useState(0.01);
    const [decimal, setDecimal] = useState(2);
    const [tickSizeOptions, setTickSizeOptions] = useState([]);
    const [loadingAsks, setLoadingAsks] = useState(true);
    const [loadingBids, setLoadingBids] = useState(true);
    const [orderBookMode, setOrderBookMode] = useState(ORDER_BOOK_MODE.ALL);

    const [height, setHeight] = useState(0);
    const ref = useRef(null);
    const lastPrice = useRef(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref.current, layoutConfig?.h]);

    useAsync(async () => {
        // Get symbol list
        const _orderBook = await getOrderBook(getSymbolString(symbol));
        await setOrderBook(_orderBook);
        setLoadingAsks(false);
        setLoadingBids(false);
    }, [symbol]);

    const handleRouteChange = async () => {
        setLoadingAsks(true);
        setLoadingBids(true);
    };

    useEffect(() => {
        if (orderBook) {
            parentState({ orderBook });
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
                setLoadingAsks(false);
                setLoadingBids(false);
                setOrderBook(data);
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
        const currentExchangeConfig = exchangeConfig.find((e) => e.symbol === getSymbolString(symbol));
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, currentExchangeConfig || []);
        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(+priceFilter?.tickSize * 10 ** i);
        }
        setTickSizeOptions(result);
        setTickSize(+priceFilter?.tickSize);
    }, [exchangeConfig, symbol]);

    useEffect(() => {
        setDecimal(getDecimalScale(tickSize));
    }, [tickSize]);

    const divide = orderBookMode === ORDER_BOOK_MODE.ALL ? 2 : 1;

    const MAX_LENGTH = Math.floor((height - 145) / divide / 20);
    let asks = [];
    let bids = [];

    const originAsks = orderBook?.asks?.length > 0 ? orderBy(orderBook?.asks, [(e) => +e[0]]) : [];
    const originBids = orderBook?.bids?.length > 0 ? orderBy(orderBook?.bids, [(e) => +e[0]], 'desc') : [];

    for (let i = 0; i < Math.min(MAX_LENGTH, orderBook?.asks?.length || 0); i++) {
        if (originAsks[i]) {
            asks.push(originAsks[i]);
        } else {
            asks.push([0, 0]);
        }
    }
    for (let i = 0; i < Math.min(MAX_LENGTH, orderBook?.bids?.length || 0); i++) {
        if (originBids[i]) {
            bids.push(originBids[i]);
        } else {
            bids.push([0, 0]);
        }
    }

    // const handleTickSize = (data, type) => {
    //     const _data = data.map((e) => {
    //         const rate = type === 'ask' ? ceil((+e[0]), decimal)  : floor((+e[0]) , decimal);
    //         return { rate, amount: +e[1] };
    //     });

    //     const groupedData = groupBy(_data, 'rate');
    //     const output = [];
    //     map(groupedData, (objs, key) => {
    //         output.push([key, sumBy(objs, 'amount')]);
    //         return true;
    //     });
    //     return output;
    // };

    asks = reverse(asks);
    asks = handleTickSize(asks, tickSize, 'ask');
    bids = handleTickSize(bids, tickSize, 'bids');
    asks = orderBy(asks, [(e) => +e[0]], ['desc']);
    bids = orderBy(bids, [(e) => -e[0]]);
    const maxAsk = maxBy(asks, (o) => {
        return o[1];
    });
    const maxBid = maxBy(bids, (o) => {
        return o[1];
    });

    const renderOrderRow = (order, index, side) => {
        const [p, q] = order;
        const maxQuote = side === 'buy' ? maxAsk?.[1] : maxBid?.[1];
        const percentage = (q / maxQuote) * 100;
        return (
            <div
                className={`progress-container my-[1px] cursor-pointer hover:bg-teal-lightTeal dark:hover:bg-darkBlue-3 ${isPro ? 'pr-4' : 'pr-3'}`}
                key={index}
                onClick={() => setSelectedOrder({ price: +p, quantity: +q })}
            >
                <div className="flex items-center flex-1">
                    <div className={`flex-1  text-xs font-medium leading-table ${side === 'buy' ? 'text-red' : 'text-teal'}`}>
                        {p ? formatPrice(p, decimal || 8) : '-'}
                    </div>
                    <div className="flex-1 text-Primary dark:text-txtPrimary-dark text-xs font-medium leading-table text-right">
                        {q ? formatPrice(+q, exchangeConfig, symbolString) : '-'}
                    </div>
                    <div className="flex-1 text-Primary dark:text-txtPrimary-dark text-xs font-medium leading-table text-right">
                        {p > 0 ? formatPrice(p * q, quoteAsset === 'VNDC' ? 0 : 2) : '-'}
                    </div>
                </div>
                <div className={`progress-bar ${side === 'buy' ? 'ask-bar' : 'bid-bar'} `} style={{ width: `${parseInt(percentage, 10)}%` }} />
            </div>
        );
    };

    const renderOrderBook = (side) => {
        // side: buy|sell
        let inner;
        if (side === 'buy' && [ORDER_BOOK_MODE.ASKS, ORDER_BOOK_MODE.ALL].includes(orderBookMode)) {
            inner = loadingAsks ? (
                <div className="flex items-center justify-center h-full">
                    <IconLoading color="#0c0e14" />
                </div>
            ) : (
                <div className="mt-6">
                    {asks.map((order, index) => {
                        return renderOrderRow(order, index, 'buy');
                    })}
                </div>
            );
        } else if (side === 'sell' && [ORDER_BOOK_MODE.BIDS, ORDER_BOOK_MODE.ALL].includes(orderBookMode)) {
            inner = loadingBids ? (
                <div className="flex items-center justify-center h-full">
                    <IconLoading color="#0c0e14" />
                </div>
            ) : (
                <div className="">
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
                ref={popover}
                label={(open) => (
                    <div className="flex min-w-[63px] justify-between items-center h-6 rounded-[3px] bg-gray-10 dark:bg-dark-2 pl-2 pr-1 ">
                        <span className="text-xs font-semibold text-txtPrimary dark:text-txtSecondary-dark mr-2 ">{tickSize}</span>
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
                                        setTickSize(item);
                                        popover.current.close();
                                    }}
                                    key={index}
                                    className={classNames(
                                        'h-8 leading-8 px-4 cursor-pointer w-full text-xs text-center text-txtSecondary dark:text-txtSecondary-dark hover:bg-gray-13 dark:hover:bg-hover-dark',
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
            <div className={`${isPro ? 'pl-4' : 'pl-6'} relative h-full bg-bgSpotContainer dark:bg-bgSpotContainer-dark flex flex-col box-border`} ref={ref}>
                <div className={`flex items-center justify-between my-6 ${isPro ? 'pr-4' : 'pr-3'}`}>
                    <div className="flex justify-start space-x-3">
                        <OrderBookAll
                            className={`cursor-pointer ${orderBookMode === ORDER_BOOK_MODE.ALL ? '' : 'opacity-50'}`}
                            onClick={() => setOrderBookMode(ORDER_BOOK_MODE.ALL)}
                        />
                        <OrderBookBids
                            className={`cursor-pointer ${orderBookMode === ORDER_BOOK_MODE.BIDS ? '' : 'opacity-50'}`}
                            onClick={() => setOrderBookMode(ORDER_BOOK_MODE.BIDS)}
                        />
                        <OrderBookAsks
                            className={`cursor-pointer ${orderBookMode === ORDER_BOOK_MODE.ASKS ? '' : 'opacity-50'}`}
                            onClick={() => setOrderBookMode(ORDER_BOOK_MODE.ASKS)}
                        />
                    </div>
                    {renderTickSizeOptions()}
                </div>
                <div className="flex flex-col flex-1">
                    <div className="">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-1 justify-start text-txtSecondary dark:text-txtSecondary-dark text-xs">
                                {t('price')} ({quote})
                            </div>
                            <div className="flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs">
                                {t('quantity')} ({base})
                            </div>
                            <div className={`flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs ${isPro ? 'pr-4' : 'pr-3'}`}>
                                {t('total')} ({quote})
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        {renderOrderBook('buy')}
                        <div className=" dark:border-divider-dark py-2 my-3 flex justify-center items-center">
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
