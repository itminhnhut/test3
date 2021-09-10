import { reverse } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { formatPrice, getFilter, getSymbolString } from 'src/redux/actions/utils';
import { getOrderBook } from 'src/redux/actions/market';

import { ExchangeOrderEnum, PublicSocketEvent } from 'src/redux/actions/const';
import { SET_SPOT_SELECTED_ORDER } from 'src/redux/actions/types';
import { useAsync } from 'react-use';
import Emitter from 'src/redux/actions/emitter';

import sumBy from 'lodash/sumBy';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';
import { Listbox, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { IconLoading } from 'components/common/Icons';
import LastPrice from '../markets/LastPrice';

const OrderBook = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const { symbol, layoutConfig, isOnSidebar } = props;
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const { base, quote } = props.symbol;
    const dispatch = useDispatch();
    const setSelectedOrder = (order) => {
        dispatch({
            type: SET_SPOT_SELECTED_ORDER,
            payload: order,
        });
    };
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const router = useRouter();

    const symbolString = useMemo(() => {
        return base + quote;
    }, [base, quote]);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const [tickSize, setTickSize] = useState(0.01);
    const [tickSizeOptions, setTickSizeOptions] = useState([]);
    const [loadingAsks, setLoadingAsks] = useState(true);
    const [loadingBids, setLoadingBids] = useState(true);

    const [height, setHeight] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref.current, layoutConfig?.h]);

    useAsync(async () => {
        // Get symbol list
        await setOrderBook(await getOrderBook(getSymbolString(symbol)));
        setLoadingAsks(false);
        setLoadingBids(false);
    }, [symbol]);

    const handleRouteChange = async () => {
        setLoadingAsks(true);
        setLoadingBids(true);
    };

    useEffect(() => {
        const event = PublicSocketEvent.SPOT_DEPTH_UPDATE + 'order_book';
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
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [symbol]);

    useEffect(() => {
        const currentExchangeConfig = exchangeConfig.find(e => e.symbol === getSymbolString(symbol));
        const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, currentExchangeConfig || []);
        const result = [];
        for (let i = 0; i < 5; i++) {
            result.push(+priceFilter?.tickSize * 10 ** i);
        }
        setTickSizeOptions(result);
        setTickSize(+priceFilter?.tickSize);
    }, [exchangeConfig, symbol]);

    // const maxQuote = quote === 'USDT' ? 50000 : 200e6;
    const MAX_LENGTH = Math.round((height - 186) / 2 / 22);
    let asks = [];
    let bids = [];

    const originAsks = orderBook?.asks?.length > 0 ? orderBy(orderBook?.asks, [e => +e[0]]) : [];
    const originBids = orderBook?.bids?.length > 0 ? orderBy(orderBook?.bids, [e => +e[0]], 'desc') : [];

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

    const handleTickSize = (data, type) => {
        const _data = data.map((e) => {
            const rate = type === 'ask' ? Math.ceil((+e[0]) / tickSize) * tickSize : Math.floor((+e[0]) / tickSize) * tickSize;

            return { rate, amount: +e[1] };
        });
        const groupedData = groupBy(_data, 'rate');
        const output = [];
        map(groupedData, (objs, key) => {
            output.push([key, sumBy(objs, 'amount')]);
            return true;
        });
        return output;
    };

    asks = reverse(asks);
    // asks = handleTickSize(asks, 'ask');
    // bids = handleTickSize(bids, 'bids');
    asks = orderBy(asks, [e => +e[0]], ['desc']);
    bids = orderBy(bids, [e => -e[0]]);
    const maxAsk = maxBy(asks, (o) => { return o[1]; });
    const maxBid = maxBy(bids, (o) => { return o[1]; });

    const shouldShowTotalCol = !isOnSidebar && quote === 'USDT';
    const renderOrderRow = (order, index, side, showTotal) => {
        const [p, q] = order;
        const maxQuote = side === 'buy' ? maxAsk?.[1] : maxBid?.[1];
        const percentage = (q / maxQuote) * 100;
        return (
            <div
                className="progress-container py-0.5 cursor-pointer hover:bg-blue-50"
                key={index}
                onClick={() => setSelectedOrder({ price: +p, quantity: +q })}
            >
                <div className="flex items-center flex-1">
                    <div className={`flex-1  text-xs leading-table ${side === 'buy' ? 'text-red' : 'text-green'}`}>
                        {p ? formatPrice(p, exchangeConfig, symbolString) : '-'}
                    </div>
                    <div className="flex-1 text-black-700 text-xs leading-table text-right">
                        {q ? formatPrice(+q, exchangeConfig, symbolString) : '-'}
                    </div>
                    {
                        showTotal && (
                            <div className="flex-1 text-black-700 text-xs leading-table text-right">
                                {p > 0 ? formatPrice(p * q, quoteAsset === 'VNDC' ? 0 : 2) : '-'}
                            </div>
                        )
                    }
                </div>
                <div
                    className={`progress-bar ${side === 'buy' ? 'ask-bar' : 'bid-bar'} `}
                    style={{ width: `${parseInt(percentage, 10)}%` }}
                />
            </div>
        );
    };
    return (
        <>
            <div className="relative h-full rounded bg-white px-1.5 pb-[26px] flex flex-col box-border" ref={ref}>
                <div className="flex items-center justify-between pt-[24px] pb-[16px] px-1.5 dragHandleArea">
                    <div className="font-semibold text-lg text-black">{t('orderbook')}</div>
                    {/* <div className="max-w-max">
                        <Listbox
                            value={tickSize}
                            onChange={setTickSize}
                        >
                            {({ open }) => (
                                <>
                                    <div className="relative z-50">
                                        <Listbox.Button
                                            className="relative w-full text-left cursor-pointer focus:outline-none sm:text-sm border border-black-200 rounded px-[0.75rem] py-[0.25rem] h-[30px]"
                                        >
                                            <div className="text-xs text-black-500 font-medium text-right flex items-center">
                                                <span className>
                                                    {tickSize.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 20 })}
                                                </span>
                                                <svg
                                                    className="ml-1.5 inline"
                                                    width="8"
                                                    height="5"
                                                    viewBox="0 0 8 5"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M1.31208 0C0.43606 0 -0.0165491 1.04647 0.583372 1.68483L3.22245 4.49301C3.6201 4.91614 4.29333 4.91276 4.68671 4.48565L7.27316 1.67747C7.8634 1.03664 7.40884 0 6.53761 0H1.31208Z"
                                                        fill="#8B8C9B"
                                                    />
                                                </svg>
                                            </div>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options
                                                static
                                                className="absolute right-0 z-10 mt-1 bg-white border border-black-200 rounded transform  shadow-lg outline-none"
                                            >
                                                {tickSizeOptions.map((item, index) => (
                                                    <Listbox.Option
                                                        key={index}
                                                        className={({ selected, active }) => `${selected ? 'font-medium text-teal' : 'text-black-500'} text-sm  cursor-pointer hover:text-teal py-1 text-right hover:bg-gray-100 px-4`}
                                                        value={item}
                                                    >
                                                        {({ selected, active }) => item.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 20 })}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div> */}
                </div>
                <div className="flex flex-col flex-1">
                    <div className="ats-tbheader px-1.5">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex flex-1 justify-start text-black-500 text-xs font-medium">
                                {t('price')}
                            </div>
                            <div className="flex flex-1 justify-end text-black-500 text-xs font-medium">
                                {t('quantity')}
                            </div>
                            {
                                (shouldShowTotalCol) && (
                                    <div className="flex flex-1 justify-end text-black-500 text-xs font-medium">
                                        {t('total')}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        <div className="flex flex-col justify-end flex-1">
                            {
                                loadingAsks ? <div className="flex items-center justify-center h-full"><IconLoading color="#4021D0" /></div> : (
                                    <div className="px-1.5">
                                        {asks.map((order, index) => {
                                            return renderOrderRow(order, index, 'buy', shouldShowTotalCol);
                                        })}
                                    </div>
                                )
                            }
                        </div>
                        <div
                            className="border-t-2 border-b-2 border-black-200 my-3 py-2 flex justify-between items-center px-1.5 min-h-[41px]"
                        >
                            <div className="text-sm w-full">
                                <span className="font-semibold">
                                    <LastPrice
                                        symbol={symbol}
                                        colored
                                        exchangeConfig={exchangeConfig}
                                    />
                                </span>
                                {/* <span className="text-black-500"> ≈ </span> */}
                                {/* <span className="text-black-500 ">1,412,232.23 VNDC</span> */}
                            </div>
                            {/* <div className="text-teal-700 font-semibold">Xem thêm</div> */}
                        </div>
                        <div className="flex flex-col justify-start flex-1">
                            {
                                loadingBids ? <div className="flex items-center justify-center h-full"><IconLoading color="#4021D0" /></div> : (
                                    <div className="px-1.5">
                                        {bids.map((order, index) => {
                                            return renderOrderRow(order, index, 'sell', shouldShowTotalCol);
                                        })}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderBook;
