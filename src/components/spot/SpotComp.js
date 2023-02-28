import DefaultMobileView from 'src/components/common/DefaultMobileView';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import PlaceOrderForm from 'src/components/trade/PlaceOrderForm';
import SimplePlaceOrderForm from 'src/components/trade/SimplePlaceOrderForm';
import SymbolDetail from 'src/components/trade/SymbolDetail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { SPOT_LAYOUT_MODE } from 'redux/actions/const';
import Chart from 'src/components/trade/Chart';
import OrderBook from 'src/components/trade/OrderBook';
import SpotHead from 'src/components/trade/SpotHead';
import SpotOrderList from 'src/components/trade/SpotOrderList';
import SymbolList from 'src/components/trade/SymbolList';
import Trades from 'src/components/trade/Trades';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { getMarketWatch, postSymbolViews } from 'src/redux/actions/market';
import { getSymbolString } from 'src/redux/actions/utils';
import { useWindowSize } from 'utils/customHooks';
import find from 'lodash/find';
import useDarkMode from 'hooks/useDarkMode';
import classNames from 'classnames';

const ReactGridLayout = WidthProvider(RGL);

const layoutChartFullScreen = [
    {
        i: 'chart',
        x: 0,
        y: 0,
        w: 16,
        h: 30,
        isDraggable: false,
        isResizable: false
    }
];
const layoutSimple = [
    {
        i: 'symbolDetail',
        x: 0,
        y: 0,
        w: 12.5,
        h: 4,
        isDraggable: false,
        isResizable: false
    },
    {
        i: 'orderbook',
        x: 0,
        y: 4,
        w: 3.5,
        h: 39,
        isDraggable: false,
        isResizable: false
    },
    {
        i: 'chart',
        x: 3.5,
        y: 4,
        w: 9,
        h: 21,
        isDraggable: false,
        isResizable: false
    },
    {
        i: 'placeOrderForm',
        x: 3.5,
        y: 6,
        w: 9,
        h: 18,
        isDraggable: false,
        isResizable: false
    },
    {
        i: 'symbolList',
        x: 12.5,
        y: 0,
        w: 3.5,
        h: 20,
        isDraggable: false,
        isResizable: false
    },
    {
        i: 'trades',
        x: 12.5,
        y: 17,
        w: 3.5,
        h: 23,
        minW: 10,
        isDraggable: false,
        isResizable: false
    },
    {
        i: 'orderList',
        x: 0,
        y: 26,
        w: 30,
        h: 34,
        isDraggable: false,
        isResizable: false
    }
];

const layoutPro = [
    {
        i: 'chart',
        x: 0,
        y: 4,
        w: 9,
        h: 24,
        isDraggable: false,
        isResizable: false,
        isDroppable: false
    },
    {
        i: 'orderList',
        x: 0,
        y: 25,
        w: 9,
        h: 22,
        isDraggable: false,
        isResizable: false,
        isDroppable: false
    },
    {
        i: 'symbolDetail',
        x: 0,
        y: 0,
        w: 9,
        h: 4,
        isDraggable: false,
        isResizable: false,
        isDroppable: false
    },
    {
        i: 'orderbook',
        x: 9,
        y: 0,
        w: 3.5,
        h: 28,
        isDraggable: false,
        isResizable: false,
        isDroppable: false
    },
    {
        i: 'trades',
        x: 9,
        y: 17,
        w: 3.5,
        h: 33,
        minW: 10,
        isDraggable: false,
        isResizable: false,
        isDroppable: false
    },
    {
        i: 'placeOrderForm',
        x: 13,
        y: 0,
        w: 3.5,
        h: 42,
        isDraggable: false,
        isResizable: false,
        isDroppable: false
    }
];

const initSpotComponent = {
    isShowChart: true,
    isShowSymbolDetail: true,
    isShowOrderBook: true,
    isShowTrades: true,
    isShowSymbolList: true,
    isShowOrderList: true,
    isShowPlaceOrderForm: true
};

const SpotComp = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { id, timeframe, indicator, layout } = router.query;
    const [layoutConfig, setLayoutConfig] = useState(layout === SPOT_LAYOUT_MODE.PRO ? layoutPro : layoutSimple);
    const [layoutMode, setLayoutMode] = useState(layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE);
    const [currentTheme] = useDarkMode();
    // Check pattern
    let symbolFromUrl = null;
    if (typeof id === 'string' && id.length) {
        const [base, quote] = id.split('-');
        if (base && quote) {
            symbolFromUrl = {
                base,
                quote
            };
        }
    }
    const [symbol, setSymbol] = useState(symbolFromUrl);
    const publicSocket = useSelector((state) => state.socket.publicSocket);

    // Spot layout
    const [lastSymbol, setLastSymbol] = useState(null);
    const [publicSocketStatus, setPublicSocketStatus] = useState(false);

    const [orderBookLayout, setOrderBookLayout] = useState({});
    const [tradesLayout, setTradesLayout] = useState({});

    const [initTimeFrame, setInitTimeFrame] = useState('');
    const [isResizingOrderList, setIsResizingOrderList] = useState(false);
    const [orderListWrapperHeight, setOrderListWrapperHeight] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    // compact state
    const [state, set] = useState({
        orderBook: null,
        ...initSpotComponent
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const resetDefault = () => {
        setLayoutConfig(layout === SPOT_LAYOUT_MODE.PRO ? layoutPro : layoutSimple);
        setState({
            ...state,
            ...initSpotComponent
        });
    };

    const user = useSelector((state) => state.auth.user) || null;
    const orderListWrapperRef = useRef(null);
    const chart = useRef(null);

    // console.log('orderListWrapperRef', orderListWrapperRef?.current);

    const updateOrderListHeight = () => {
        setOrderListWrapperHeight(orderListWrapperRef?.current?.clientHeight);
    };

    useEffect(() => {
        setTimeout(() => {
            updateOrderListHeight();
        }, 200);
        return () => clearTimeout(updateOrderListHeight());
    }, [orderListWrapperRef, isResizingOrderList]);
    const { width } = useWindowSize();

    useEffect(() => {
        if (timeframe) {
            setInitTimeFrame(timeframe);
        }
    }, [indicator, timeframe]);

    useEffect(() => {
        const initLayout = layoutConfig;
        const _orderbookLayout = find(initLayout, { i: 'orderbook' });
        const _tradesLayout = find(initLayout, { i: 'trades' });
        setOrderBookLayout(_orderbookLayout);
        setTradesLayout(_tradesLayout);
    }, []);

    const subscribeExchangeSocket = (s) => {
        if (!publicSocket) {
            setPublicSocketStatus(!!publicSocket);
        } else {
            if (!lastSymbol || lastSymbol !== s || !!publicSocket !== publicSocketStatus) {
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
        if (symbolFromUrl?.quote !== symbol?.quote || symbolFromUrl?.base !== symbol?.base) {
            setSymbol(symbolFromUrl);
        }
    }, [symbolFromUrl]);

    useAsync(async () => {
        if (symbol) {
            const [newSymbolTicker] = await getMarketWatch(getSymbolString(symbol));
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

    const handleResize = (_layout, _oldItem, _newItem, _placeholder, _e, _element) => {
        if (_newItem?.i === 'orderbook') {
            setOrderBookLayout(_newItem);
        }
        if (_newItem?.i === 'trades') {
            setTradesLayout(_newItem);
        }
    };

    if (!symbol) return null;
    const isPro = layoutMode === SPOT_LAYOUT_MODE.PRO;

    return (
        <MaldivesLayout hideFooter page="spot" changeLayoutCb={setLayoutMode} spotState={state} onChangeSpotState={setState} resetDefault={resetDefault}>
            <SpotHead symbol={symbol} />
            <MobileView className="bg-white">
                <DefaultMobileView />
            </MobileView>
            <BrowserView className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                <div className={layoutMode === SPOT_LAYOUT_MODE.PRO ? 'w-full' : ''}>
                    <ReactGridLayout
                        className="layout"
                        layout={layoutMode === SPOT_LAYOUT_MODE.PRO ? layoutPro : layoutSimple}
                        // layout={layoutConfig}
                        // onLayoutChange={(_layout) => setLayoutConfig(_layout)}
                        breakpoints={{
                            xl: 1440,
                            lg: 2200
                        }}
                        cols={16}
                        margin={[-1, -1]}
                        containerPadding={[0, 0]}
                        rowHeight={24}
                        onResize={handleResize}
                        draggableHandle=".dragHandleArea"
                        draggableCancel=".dragCancelArea"
                        // resizeHandle={()=> <span>Hello</span>}
                        resizeHandle={() => (
                            <span
                                className={`react-resizable-handle react-resizable-handle-se  ${
                                    currentTheme === 'dark' ? 'nami-react-resizable-handle--dark' : 'nami-react-resizable-handle'
                                }`}
                            ></span>
                        )}
                    >
                        {!isPro && (
                            <div
                                key="symbolList"
                                className={classNames('border-l border-divider dark:border-divider-dark', {
                                    hidden: !state.isShowSymbolList || fullScreen
                                })}
                            >
                                <SymbolList publicSocket={publicSocket} symbol={symbol} />
                            </div>
                        )}
                        <div
                            key="chart"
                            id="spot_containter_chart"
                            className={classNames(`border-t border-b border-r border-divider dark:border-divider-dark`, {
                                hidden: !state.isShowChart
                            })}
                        >
                            <Chart chartKey="spot_containter_chart" symbol={symbol} initTimeFrame={initTimeFrame} isPro={isPro} />
                        </div>
                        <div
                            key="symbolDetail"
                            className={classNames(`border-b border-r border-divider dark:border-divider-dark`, {
                                hidden: !state.isShowSymbolDetail || fullScreen
                            })}
                        >
                            <SymbolDetail isPro={isPro} layoutMode={layoutMode} symbol={symbol} publicSocket={publicSocket} />
                        </div>

                        <div
                            key="trades"
                            className={classNames(`border-l border-t border-divider dark:border-divider-dark overflow-hidden`, {
                                hidden: !state.isShowTrades || fullScreen,
                                'border-r': isPro
                            })}
                        >
                            <Trades isPro={isPro} symbol={symbol} publicSocket={publicSocket} layoutConfig={tradesLayout} />
                        </div>
                        <div
                            key="placeOrderForm"
                            className={classNames(`border-b border-r border-divider dark:border-divider-dark`, {
                                hidden: !state.isShowPlaceOrderForm || fullScreen,
                                '!border-b-0': isPro
                            })}
                        >
                            {!isPro ? (
                                <SimplePlaceOrderForm symbol={symbol} orderBook={state.orderBook} />
                            ) : (
                                <PlaceOrderForm symbol={symbol} orderBook={state.orderBook} />
                            )}
                        </div>
                        <div
                            key="orderList"
                            className={classNames(`border-t border-divider dark:border-divider-dark`, {
                                hidden: !state.isShowOrderList || fullScreen,
                                'border-r': isPro
                            })}
                        >
                            <div ref={orderListWrapperRef} className="h-full">
                                <SpotOrderList isPro={isPro} orderListWrapperHeight={orderListWrapperHeight} />
                            </div>
                        </div>
                        <div
                            key="orderbook"
                            className={classNames(`border-r border-t border-b border-divider dark:border-divider-dark`, {
                                hidden: !state.isShowOrderBook || fullScreen,
                                'border-l !border-t-0': isPro
                            })}
                        >
                            <OrderBook isPro={isPro} symbol={symbol} parentState={setState} layoutConfig={orderBookLayout} />
                        </div>
                    </ReactGridLayout>
                </div>
            </BrowserView>
        </MaldivesLayout>
    );
};

export default SpotComp;
