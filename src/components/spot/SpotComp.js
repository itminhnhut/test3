import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Fragment, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getSymbolString } from 'src/redux/actions/utils';
import { useAsync } from 'react-use';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import SymbolList from 'src/components/trade/SymbolList';
import OrderBook from 'src/components/trade/OrderBook';
import PlaceOrderForm from 'src/components/trade/PlaceOrderForm';
import SpotOrderList from 'src/components/trade/SpotOrderList';
import Trades from 'src/components/trade/Trades';
import Chart from 'src/components/trade/Chart';
import { getMarketWatch, getUserSymbolList, postSymbolViews } from 'src/redux/actions/market';
import SpotHead from 'src/components/trade/SpotHead';
import { DOWNLOAD_APP_LINK, LS_KEYS, OLD_LS_KEYS, PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import size from 'lodash/size';
import find from 'lodash/find';
import maxBy from 'lodash/maxBy';
import { BrowserView, MobileView } from 'react-device-detect';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import FetchApi from 'utils/fetch-api';
import { useWindowSize } from 'utils/customHooks';
import { fi } from 'date-fns/locale';

const ReactGridLayout = WidthProvider(RGL);

const layoutOnSidebar = [
    { i: 'symbolList', x: 0, y: 0, w: 7, h: 52, isBounded: true, isDraggable: false, isResizable: false, static: true },
    { i: 'chart', x: 7, y: 0, w: 19, h: 32, isBounded: true, isDraggable: true, isResizable: true, minW: 19, maxW: 26, minH: 30 },
    { i: 'orderList', x: 7, y: 32, w: 19, h: 20, isBounded: true, isDraggable: true, isResizable: true, minH: 20 },
    { i: 'orderbook', x: 26, y: 0, w: 7, h: 32, isBounded: true, isDraggable: true, isResizable: true, minW: 7, minH: 32 },
    { i: 'trades', x: 26, y: 32, w: 7, h: 20, isBounded: true, isDraggable: true, isResizable: true },
    { i: 'placeOrderForm', x: 33, y: 0, w: 7, h: 32, isBounded: true, isDraggable: true, isResizable: false, static: false },
];
const layout = [
    { i: 'symbolList', x: 0, y: 0, w: 2, h: 52, isBounded: true, isDraggable: false, isResizable: false, static: true },
    { i: 'chart', x: 2, y: 0, w: 22, h: 32, isBounded: true, isDraggable: true, isResizable: true, minW: 22, maxW: 30, minH: 32 },
    { i: 'orderList', x: 2, y: 32, w: 22, h: 20, isBounded: true, isDraggable: true, isResizable: true, minH: 20 },
    { i: 'orderbook', x: 24, y: 0, w: 8, h: 32, isBounded: true, isDraggable: true, isResizable: true, minW: 8, minH: 32 },
    { i: 'trades', x: 24, y: 32, w: 8, h: 20, isBounded: true, isDraggable: true, isResizable: true },
    { i: 'placeOrderForm', x: 32, y: 0, w: 8, h: 32, isBounded: true, isDraggable: true, isResizable: false, static: false },
];
const layoutFullScreenChart = [
    { i: 'chart', x: 0, y: 0, w: 22, h: 32, isBounded: true, isDraggable: false, isResizable: false, minW: 22, maxW: 30, minH: 32 },
];

const initialIsOnSidebar = JSON.parse(localStorage.getItem(LS_KEYS.SPOT_ON_SIDEBAR));
const initialIsMaxChart = JSON.parse(localStorage.getItem(LS_KEYS.SPOT_MAX_CHART));
const initialLayoutOnSidebarLocal = JSON.parse(localStorage.getItem(LS_KEYS.SPOT_LAYOUT_ON_SIDEBAR)) || layoutOnSidebar;
const initialLayoutLocal = JSON.parse(localStorage.getItem(LS_KEYS.SPOT_LAYOUT)) || layout;
let initialLayout = initialIsOnSidebar === 'true' ? initialLayoutOnSidebarLocal : initialLayoutLocal;
const symbolList = find(initialLayout, e => e.i === 'symbolList') || {};

// fix wrong layout || unknown error || auto reset layout
if (initialIsOnSidebar === 'true') {
    if (symbolList.w !== 7) {
        initialLayout = layoutOnSidebar;
    }
}
if (initialIsOnSidebar === 'false') {
    if (symbolList.w !== 2) {
        initialLayout = layout;
    }
}

const SpotComp = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { id, timeframe, indicator } = router.query;
    const [chartSize, setChartSize] = useState('');
    const [orderBookLayout, setOrderBookLayout] = useState({});
    const [tradesLayout, setTradesLayout] = useState({});

    // Check pattern
    let symbolFromUrl = null;
    if (typeof id === 'string' && id.length) {
        const [base, quote] = id.split('_');
        if (base && quote) {
            symbolFromUrl = { base, quote };
        }
    }
    const [symbol, setSymbol] = useState(symbolFromUrl);
    // const [layoutLocal, setLayoutLocal] = useLocalStorage(LS_KEYS.SPOT_LAYOUT, layout);
    // const [layoutOnSidebarLocal, setLayoutOnSidebarLocal] = useLocalStorage(LS_KEYS.SPOT_LAYOUT_ON_SIDEBAR, layoutOnSidebar);
    const publicSocket = useSelector(state => state.socket.publicSocket);

    // Spot layout
    const [lastSymbol, setLastSymbol] = useState(null);
    const [publicSocketStatus, setPublicSocketStatus] = useState(false);
    const [favorite, setFavorite] = useState([]);
    const [watchList, setWatchList] = useState([]);

    const [gridLayout, setGridLayout] = useState(initialLayout);

    const [isMaxChart, setIsMaxChart] = useState(initialIsMaxChart === 'true');
    const [isOnSidebar, setIsOnSidebar] = useState(initialIsOnSidebar === 'true');
    const [initTimeFrame, setInitTimeFrame] = useState('');
    const [extendsIndicators, setExtendsIndicators] = useState('');
    const [isResizingOrderList, setIsResizingOrderList] = useState(false);
    const [orderListWrapperHeight, setOrderListWrapperHeight] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    const user = useSelector(state => state.auth.user) || null;
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
                setFavorite(watchList.filter(list => list.type === 'FAVORITE')[0]?.assets);
            }
        }
    }, [user, watchList]);

    const changeSymbolList = (symbList) => {
        setFavorite(symbList);
    };

    // Spot Socket

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

    const clearOldData = () => {
        OLD_LS_KEYS.forEach((e) => {
            localStorage.removeItem(e);
        });
    };

    useEffect(() => {
        postSymbolViews(getSymbolString(symbol));
    }, [symbol]);

    useEffect(() => {
        clearOldData();
    }, []);

    useEffect(() => {
        if (symbolFromUrl?.quote !== symbol?.quote
            || symbolFromUrl?.base !== symbol?.base
        ) {
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

    const onLayoutChange = (_layout) => {
        if (!fullScreen) {
            if (isOnSidebar) {
                localStorage.setItem(LS_KEYS.SPOT_LAYOUT_ON_SIDEBAR, JSON.stringify(_layout));
            } else {
                localStorage.setItem(LS_KEYS.SPOT_LAYOUT, JSON.stringify(_layout));
            }
        }
    };

    useEffect(() => {
        let _layout;
        if (fullScreen) {
            _layout = layoutFullScreenChart;
        } else {
            const _layoutOnSidebarLocal = JSON.parse(localStorage.getItem(LS_KEYS.SPOT_LAYOUT_ON_SIDEBAR)) || layoutOnSidebar;
            const _layoutLocal = JSON.parse(localStorage.getItem(LS_KEYS.SPOT_LAYOUT)) || layout;

            _layout = isOnSidebar ? _layoutOnSidebarLocal : _layoutLocal;

            const notSymbolListAndFirstItem = _layout.filter(e => e.i !== 'symbolList' && e.y !== 0);
            const highestGridItem = maxBy(notSymbolListAndFirstItem, e => (e.y + e.h));
            const orderListLayout = find(_layout, e => e.i === 'orderList');
            const sameYOrderListLayout = _layout.filter(e => e.y === orderListLayout.y);
            const highestSameYOrderListLayout = maxBy(sameYOrderListLayout, 'h');

            _layout = _layout.map(e => {
                const newLayout = { ...e };
                if (newLayout.i === 'chart') {
                    if (isMaxChart) {
                        newLayout.w = e.maxW;
                    } else {
                        newLayout.w = e.minW;
                    }
                }
                if (newLayout.i === 'orderbook') {
                    if (isMaxChart) {
                        newLayout.w = 0;
                        newLayout.h = 0;
                        newLayout.isDraggable = false;
                        newLayout.isResizable = false;
                    } else {
                        newLayout.w = e.minW;
                        newLayout.h = e.minH;
                        newLayout.isDraggable = true;
                        newLayout.isResizable = true;
                    }
                }
                if (newLayout.i === 'trades') {
                }
                if (newLayout.i === 'symbolList') {
                    newLayout.h = highestGridItem.y + highestGridItem.h;
                }
                if (newLayout.i === 'orderList' && highestSameYOrderListLayout) {
                // newLayout.h = highestSameYOrderListLayout.h;
                }
                return newLayout;
            });

            const _orderbookLayout = find(_layout, { i: 'orderbook' });
            const _chartLayout = find(_layout, { i: 'chart' });
            const _tradesLayout = find(_layout, { i: 'trades' });
            setChartSize(_chartLayout?.w);
            setOrderBookLayout(_orderbookLayout);
            setTradesLayout(_tradesLayout);
        }
        setGridLayout(_layout);
    }, [isOnSidebar, isMaxChart, fullScreen]);

    const handleResize = (_layout, _oldItem, _newItem, _placeholder, _e, _element) => {
        if (_newItem?.i === 'orderbook') {
            setOrderBookLayout(_newItem);
        }
        if (_newItem?.i === 'trades') {
            setTradesLayout(_newItem);
        }
        if (_newItem?.i === 'orderList') {
            setIsResizingOrderList(true);
        }
    };

    const handleResizeStop = (_layout, _oldItem, _newItem, _placeholder, _e, _element) => {
        if (_newItem?.i === 'chart') {
            setChartSize(_newItem?.w + _newItem?.h);
        }
        if (_newItem?.i === 'orderbook') {
            // setOrderBookLayout(_newItem);
        }
        // if (_newItem?.i === 'trades') {
        //     setTradesLayout(_newItem);
        // }
        if (_newItem?.i === 'orderList') {
            setIsResizingOrderList(false);
        }
    };
    const handleDragStop = (_layout, _oldItem, _newItem, _placeholder, _e, _elemen) => {
        const notSymbolListAndFirstItem = _layout.filter(e => e.i !== 'symbolList' && e.y !== 0);
        const highestGridItem = maxBy(notSymbolListAndFirstItem, e => (e.y + e.h));
        const orderListLayout = find(_layout, e => e.i === 'orderList');
        const sameYOrderListLayout = _layout.filter(e => e.y === orderListLayout.y);
        const highestSameYOrderListLayout = maxBy(sameYOrderListLayout, 'h');

        const updatedLayout = _layout.map(e => {
            const newLayout = { ...e };
            if (newLayout.i === 'chart') {
                if (isMaxChart) {
                    newLayout.w = e.maxW;
                } else {
                    newLayout.w = e.minW;
                }
            }
            if (newLayout.i === 'trades') {
            }
            if (newLayout.i === 'symbolList') {
                newLayout.h = highestGridItem.y + highestGridItem.h;
            }
            if (newLayout.i === 'orderList' && highestSameYOrderListLayout) {
                // newLayout.h = highestSameYOrderListLayout.h;
            }
            return newLayout;
        });

        const _chartLayout = find(_layout, { i: 'chart' });
        const _orderbookLayout = find(_layout, { i: 'orderbook' });
        const _tradesLayout = find(_layout, { i: 'trades' });
        setChartSize(_chartLayout?.w);
        setOrderBookLayout(_orderbookLayout);
        setTradesLayout(_tradesLayout);

        setGridLayout(updatedLayout);
    };
    const handleCallback = (childData) => {
        const isTrue = (childData === 'true');
        setIsOnSidebar(isTrue);
    };
    const handleCallbackChart = (childData) => {
        const isTrue = (childData === 'true');
        setIsMaxChart(isTrue);
    };
    const handleReadSignal = (userId, symId) => {
        FetchApi({
            url: '/api/v1/signal/read',
            options: {
                method: 'PUT',
            },
            params: {
                userId,
                id: symId,
            },
        });
    };
    const handleChangeSymbol = async (sym, time_frame, userId, symId, extIndicator) => {
        if (typeof userId === 'number' && typeof symId === 'string') {
            await handleReadSignal(userId, symId);
        }
        if (extIndicator) {
            setExtendsIndicators(extIndicator);
        }
        router.push(`/spot/${sym.base}_${sym.quote}`, undefined, { shallow: true });
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
        <LayoutWithHeader hidden={fullScreen}>
            <SpotHead symbol={symbol} />
            <MobileView>
                <Transition show as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRegisterRef}
                        static
                        open
                        onClose={() => {}}
                    >
                        <div className="md:min-h-screen min-h-[calc(100%-10rem)] px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div
                                    className="inline-block w-full max-w-400 mb-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl "
                                >
                                    <Dialog.Title className="">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-xl font-medium leading-8 text-black-800"
                                            />
                                        </div>
                                    </Dialog.Title>
                                    <div className="text-sm rounded-2xl bg-white">
                                        <div className="bg-black-5 rounded-t-2xl py-4">
                                            <img src="/images/bg/dialog-register-header.svg" alt="" className="mx-auto" />
                                        </div>
                                        <div className="px-6 py-8 text-center !font-bold">
                                            <div className="text-xl">{t('landing:download_app_hint')}</div>
                                            <div className="text-xl text-violet mb-[30px]">Nami Exchange</div>
                                            <div className="">
                                                <a
                                                    href={DOWNLOAD_APP_LINK.IOS}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-black w-full mb-2"
                                                        type="button"
                                                        rel="noreferrer"
                                                    >
                                                        {t('landing:download_app_hint_appstore')}
                                                    </button>
                                                </a>
                                                <a
                                                    href={DOWNLOAD_APP_LINK.ANDROID}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <button
                                                        className="btn btn-primary w-full"
                                                        type="button"
                                                    >
                                                        {t('landing:download_app_hint_googleplay')}
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </MobileView>
            <BrowserView>
                <ReactGridLayout
                    className="layout"
                    layout={gridLayout}
                    breakpoints={{ xl: 1400, lg: 1200 }}
                    cols={40}
                    margin={[8, 8]}
                    containerPadding={[8, 8]}
                    rowHeight={width > 2000 ? 20 : 10}
                    onLayoutChange={(_layout, _layouts) => onLayoutChange(_layout, _layouts)}
                    draggableHandle=".dragHandleArea"
                    draggableCancel=".dragCancelArea"
                    onResizeStop={handleResizeStop}
                    onDragStop={handleDragStop}
                    onResize={handleResize}
                >
                    <div key="symbolList" className={`${fullScreen && 'hidden'} z-[3]`}>
                        {renderSymbolList}
                        {/* <SymbolList
                            parentCallback={handleCallback}
                            publicSocket={publicSocket}
                            symbol={symbol}
                            changeSymbolList={changeSymbolList}
                            watchList={watchList}
                            favorite={favorite}
                            handleChangeSymbol={handleChangeSymbol}
                        /> */}
                    </div>
                    <div key="chart" className={`${fullScreen && '!w-screen !h-screen transition !transform-none'} z-[2]`}>
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
                    <div key="orderList" className={`${fullScreen && 'hidden'}`}>
                        <div ref={orderListWrapperRef} className="h-full">
                            <SpotOrderList isOnSidebar={isOnSidebar} orderListWrapperHeight={orderListWrapperHeight} />
                        </div>
                    </div>
                    <div key="orderbook" className={`${fullScreen && 'hidden'}`}>
                        <OrderBook
                            layoutConfig={orderBookLayout}
                            symbol={symbol}
                            isOnSidebar={isOnSidebar}
                        />
                    </div>
                    <div key="trades" className={`${fullScreen && 'hidden'}`}>
                        <Trades
                            layoutConfig={tradesLayout}
                            symbol={symbol}
                            publicSocket={publicSocket}
                        />
                    </div>
                    <div key="placeOrderForm" className={`${fullScreen && 'hidden'}`}>
                        <PlaceOrderForm
                            symbol={symbol}
                        />
                    </div>
                </ReactGridLayout>
            </BrowserView>
        </LayoutWithHeader>
    );
};

export default SpotComp;
