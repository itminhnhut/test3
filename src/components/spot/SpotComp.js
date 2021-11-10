import Axios from 'axios';
import DefaultMobileView from 'components/common/DefaultMobileView';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import SimplePlaceOrderForm from 'components/trade/SimplePlaceOrderForm';
import SymbolDetail from 'components/trade/SymbolDetail';
import find from 'lodash/find';
import size from 'lodash/size';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { API_GET_FAVORITE } from 'redux/actions/apis';
import Chart from 'src/components/trade/Chart';
import OrderBook from 'src/components/trade/OrderBook';
import SpotHead from 'src/components/trade/SpotHead';
import SpotOrderList from 'src/components/trade/SpotOrderList';
import SymbolList from 'src/components/trade/SymbolList';
import Trades from 'src/components/trade/Trades';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import {
    getMarketWatch,
    getUserSymbolList,
    postSymbolViews
} from 'src/redux/actions/market';
import { getSymbolString } from 'src/redux/actions/utils';
import { useWindowSize } from 'utils/customHooks';

const ReactGridLayout = WidthProvider(RGL);

const layoutOnSidebar = [
    {
        i: 'symbolDetail',
        x: 0,
        y: 0,
        w: 23,
        h: 2,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'orderbook',
        x: 0,
        y: 3,
        w: 7,
        h: 22,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'chart',
        x: 7,
        y: 3,
        w: 16,
        h: 12,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'placeOrderForm',
        x: 7,
        y: 6,
        w: 16,
        h: 10,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'symbolList',
        x: 23,
        y: 3,
        w: 7,
        h: 13,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'trades',
        x: 23,
        y: 14,
        w: 7,
        h: 11,
        isDraggable: false,
        isResizable: false,
    },
    {
        i: 'orderList',
        x: 0,
        y: 26,
        w: 30,
        h: 10,
        isDraggable: false,
        isResizable: false,
    },
];

const initialLayout = layoutOnSidebar;

const SpotComp = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { id, timeframe, indicator } = router.query;
    const [chartSize, setChartSize] = useState('');
    const [orderBookLayout, setOrderBookLayout] = useState({});
    const [tradesLayout, setTradesLayout] = useState({});
    const [symbolDetailLayout, setSymbolDetailLayout] = useState({});

    // Check pattern
    let symbolFromUrl = null;
    if (typeof id === 'string' && id.length) {
        const [base, quote] = id.split('-');
        if (base && quote) {
            symbolFromUrl = { base, quote };
        }
    }
    const [symbol, setSymbol] = useState(symbolFromUrl);
    const publicSocket = useSelector((state) => state.socket.publicSocket);

    // Spot layout
    const [lastSymbol, setLastSymbol] = useState(null);
    const [publicSocketStatus, setPublicSocketStatus] = useState(false);
    const [favorite, setFavorite] = useState([]);
    const [watchList, setWatchList] = useState([]);

    const [gridLayout, setGridLayout] = useState(initialLayout);

    const [isMaxChart, setIsMaxChart] = useState(false);
    const [isOnSidebar, setIsOnSidebar] = useState(true);
    const [initTimeFrame, setInitTimeFrame] = useState('');
    const [extendsIndicators, setExtendsIndicators] = useState('');
    const [isResizingOrderList, setIsResizingOrderList] = useState(false);
    const [orderListWrapperHeight, setOrderListWrapperHeight] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    // compact state
    const [state, set] = useState({ orderBook: null });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const user = useSelector((state) => state.auth.user) || null;
    const cancelButtonRegisterRef = useRef();
    const orderListWrapperRef = useRef(null);

    // console.log('orderListWrapperRef', orderListWrapperRef?.current);

    const updateOrderListHeight = () => {
        setOrderListWrapperHeight(orderListWrapperRef?.current?.clientHeight);
    };

    useEffect(() => {
        setTimeout(() => {
            updateOrderListHeight();
        }, 200);
        return () => clearTimeout(updateOrderListHeight());
    }, [orderListWrapperRef, isResizingOrderList, isOnSidebar]);
    const { width } = useWindowSize();

    useEffect(() => {
        if (indicator) {
            setExtendsIndicators(indicator);
        }
        if (timeframe) {
            setInitTimeFrame(timeframe);
        }
    }, [indicator, timeframe]);

    useAsync(async () => {
        if (user) {
            if (watchList && watchList.length === 0) {
                const result = await getUserSymbolList();
                if (result && result.length > 0) {
                    await setWatchList(result);
                }
            }
            if (watchList && watchList.length > 0) {
                setFavorite(
                    watchList.filter((list) => list.type === 'FAVORITE')[0]
                        ?.assets,
                );
            }
        }
    }, [user, watchList]);

    useAsync(async () => {
        if (user) {
            const { data } = await Axios.get(API_GET_FAVORITE, {
                params: { tradingMode: 1 },
            });
            if (data?.status === 'ok' && data?.data) {
                setFavorite(data.data);
            }
        }
    }, [user]);

    const changeSymbolList = (symbList) => {
        setFavorite(symbList);
    };

    // Spot Socket

    const subscribeExchangeSocket = (s) => {
        if (!publicSocket) {
            setPublicSocketStatus(!!publicSocket);
        } else {
            if (
                !lastSymbol ||
                lastSymbol !== s ||
                !!publicSocket !== publicSocketStatus
            ) {
                // Vao day subscrible thoi
                publicSocket.emit('subscribe:depth', s);
                publicSocket.emit('subscribe:recent_trade', s);
                publicSocket.emit('subscribe:ticker', s);
                publicSocket.emit('subscribe:mini_ticker', 'all');

                setPublicSocketStatus(!!publicSocket);
                setLastSymbol(symbol);
            }
        }
    };

    const unsubscribeExchangeSocket = (s) => {
        if (!publicSocket) return;
        publicSocket.emit('unsubscribe:all', s);
    };

    useEffect(() => {
        postSymbolViews(getSymbolString(symbol));
    }, [symbol]);

    useEffect(() => {
        if (
            symbolFromUrl?.quote !== symbol?.quote ||
            symbolFromUrl?.base !== symbol?.base
        ) {
            setSymbol(symbolFromUrl);
        }
    }, [symbolFromUrl]);

    useAsync(async () => {
        if (symbol) {
            const [newSymbolTicker] = await getMarketWatch(
                getSymbolString(symbol),
            );
            Emitter.emit(PublicSocketEvent.SPOT_TICKER_UPDATE, newSymbolTicker);
        }
    }, [symbol]);

    useEffect(() => {
        if (symbol) {
            subscribeExchangeSocket(getSymbolString(symbol));
        }

        return function cleanup() {
            if (symbol) {
                unsubscribeExchangeSocket(getSymbolString(symbol));
            }
        };
    }, [publicSocket, symbol]);

    useEffect(() => {
        const _layout = layoutOnSidebar;
        const _orderbookLayout = find(_layout, { i: 'orderbook' });
        const _chartLayout = find(_layout, { i: 'chart' });
        const _tradesLayout = find(_layout, { i: 'trades' });
        const _symbolDetailLayout = find(_layout, { i: 'symbolDetail' });
        setChartSize(_chartLayout?.w);
        setOrderBookLayout(_orderbookLayout);
        setSymbolDetailLayout(_symbolDetailLayout);
        setTradesLayout(_tradesLayout);
        setGridLayout(_layout);
    }, [isOnSidebar, isMaxChart, fullScreen]);

    const handleCallback = (childData) => {
        const isTrue = childData === 'true';
        setIsOnSidebar(isTrue);
    };
    const handleCallbackChart = (childData) => {
        const isTrue = childData === 'true';
        setIsMaxChart(isTrue);
    };

    const handleChangeSymbol = async (
        sym,
        time_frame,
        userId,
        symId,
        extIndicator,
    ) => {
        if (extIndicator) {
            setExtendsIndicators(extIndicator);
        }
        router.push(`/trade/${sym.base}-${sym.quote}`, undefined, {
            shallow: true,
        });
        setInitTimeFrame(time_frame);
    };

    const clearExtendsIndicators = () => {
        setExtendsIndicators('');
    };

    const renderSymbolList = useMemo(() => {
        if (size(tradesLayout) > 0) {
            return (
                <SymbolList
                    parentCallback={handleCallback}
                    publicSocket={publicSocket}
                    symbol={symbol}
                    changeSymbolList={changeSymbolList}
                    watchList={watchList}
                    favorite={favorite}
                    handleChangeSymbol={handleChangeSymbol}
                />
            );
        }
        return null;
    }, [watchList, favorite, tradesLayout]);

    const customChartFullscreen = () => {
        setFullScreen(!fullScreen);
    };

    if (!symbol) return null;

    return (
        <MaldivesLayout hideNavBar={fullScreen}>
            <SpotHead symbol={symbol} />
            <MobileView  className="bg-white">
                <DefaultMobileView />
            </MobileView>
            <BrowserView className="bg-backgroundSecondary dark:bg-get-darkBlue2">
                <div className="2xl:container">
                    <ReactGridLayout
                        className="layout"
                        layout={gridLayout}
                        breakpoints={{ xl: 1400, lg: 2200 }}
                        cols={30}
                        margin={[4, 4]}
                        containerPadding={[4, 4]}
                        rowHeight={30}
                        draggableHandle=".dragHandleArea"
                        draggableCancel=".dragCancelArea"
                    >
                        <div key="symbolDetail">
                            <SymbolDetail
                                symbol={symbol}
                                layoutConfig={symbolDetailLayout}
                                changeSymbolList={changeSymbolList}
                                watchList={watchList}
                                favorite={favorite}
                                parentCallback={handleCallbackChart}
                                fullScreen={false}
                            />
                        </div>

                        <div key="orderbook">
                            <OrderBook
                                layoutConfig={orderBookLayout}
                                symbol={symbol}
                                parentState={setState}
                            />
                        </div>

                        <div
                            key="symbolList"
                            className={`${fullScreen && 'hidden'} z-[3]`}
                        >
                            {renderSymbolList}
                        </div>
                        <div
                            key="chart"
                            className={`${
                                fullScreen &&
                                '!w-screen !h-screen transition !transform-none'
                            } z-[2]`}
                        >
                            <Chart
                                parentCallback={handleCallbackChart}
                                symbol={symbol}
                                isOnSidebar={isOnSidebar}
                                changeSymbolList={changeSymbolList}
                                watchList={watchList}
                                favorite={favorite}
                                chartSize={chartSize}
                                initTimeFrame={initTimeFrame}
                                extendsIndicators={extendsIndicators}
                                clearExtendsIndicators={clearExtendsIndicators}
                                customChartFullscreen={customChartFullscreen}
                                fullScreen={fullScreen}
                            />
                        </div>

                        <div key="trades">
                            <Trades
                                layoutConfig={tradesLayout}
                                symbol={symbol}
                                publicSocket={publicSocket}
                            />
                        </div>
                        <div key="placeOrderForm">
                            <SimplePlaceOrderForm
                                symbol={symbol}
                                orderBook={state.orderBook}
                            />
                        </div>
                        <div key="orderList">
                            <div ref={orderListWrapperRef} className="h-full">
                                <SpotOrderList
                                    isOnSidebar={isOnSidebar}
                                    orderListWrapperHeight={
                                        orderListWrapperHeight
                                    }
                                />
                            </div>
                        </div>
                    </ReactGridLayout>
                </div>
            </BrowserView>
        </MaldivesLayout>
    );
};

export default SpotComp;
