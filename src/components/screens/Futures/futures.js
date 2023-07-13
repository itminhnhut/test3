import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants';
import { ApiStatus, PublicSocketEvent, UserSocketEvent } from 'redux/actions/const';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import FuturesChart from 'components/screens/Futures/FuturesChart';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import FuturesPairDetail from 'components/screens/Futures/PairDetail';
import FuturesTradeRecord from 'components/screens/Futures/TradeRecord';
import FuturesFavoritePairs from 'components/screens/Futures/FavoritePairs';
import FuturesPlaceOrderVndc from 'components/screens/Futures/PlaceOrder/Vndc/FuturesPlaceOrderVndc';
import futuresGridConfig, { futuresGridKey } from 'components/screens/Futures/_futuresGrid';
import useWindowSize from 'hooks/useWindowSize';
import DynamicNoSsr from 'components/DynamicNoSsr';
import dynamic from 'next/dynamic';
import Emitter from 'redux/actions/emitter';
import 'react-grid-layout/css/styles.css';
import { getOrdersList, fetchFuturesSetting } from 'redux/actions/futures';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { getDecimalPrice, getDecimalQty, getUnit } from 'redux/actions/utils';
import FuturesMarginRatioVndc from './PlaceOrder/Vndc/MarginRatioVndc';
import FuturesTermsModal from 'components/screens/Futures/FuturesModal/FuturesTermsModal';
import classNames from 'classnames';
import DefaultMobileView from 'src/components/common/DefaultMobileView';
import { FuturesSettings } from 'redux/reducers/futures';
import { useLocalStorage, usePrevious } from 'react-use';
import styled from 'styled-components';

const GridLayout = WidthProvider(Responsive);

const NON_LOGIN = 'non-login-layouts';

const FuturesProfitEarned = dynamic(() => import('components/screens/Futures/TakedProfit'), { ssr: false });

const INITIAL_STATE = {
    layouts: futuresGridConfig.layoutsVndc,
    prevLayouts: futuresGridConfig.layoutsVndc['2xl'],
    breakpoint: '2xl',
    loading: false,
    pair: null,
    prevPair: null,
    socketStatus: false,
    pairPrice: null,
    forceUpdateState: 1,
    favoritePairLayout: null,
    orderBookLayout: null,
    tradeRecordLayout: null,
    isVndcFutures: true,
    assumingPrice: null
};

const initFuturesComponent = {
    isShowFavorites: true,
    isShowPairDetail: true,
    isShowChart: true,
    isShowOpenOrders: true,
    isShowPlaceOrder: true,
    isShowAssets: true
    // [FuturesSettings.order_confirm]: true,
    // [FuturesSettings.show_sl_tp_order_line]: true
};

const Futures = () => {
    const [state, set] = useState(INITIAL_STATE);

    const [localGridLayouts, setLocalGridLayout] = useLocalStorage('gridLayoutFutures');
    const [localLayoutFutures, setLocalLayoutFutures] = useLocalStorage('settingLayoutFutures');
    const [componentLayoutFutures, setComponentLayoutFutures] = useState(localLayoutFutures || initFuturesComponent);

    const dispatch = useDispatch();
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const userSocket = useSelector((state) => state.socket.userSocket);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const marketWatch = useSelector((state) => state.futures?.marketWatch);
    const auth = useSelector((state) => state.auth?.user);
    const userSettings = useSelector((state) => state.futures?.userSettings);
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const router = useRouter();
    const { width } = useWindowSize();
    const isMediumDevices = width >= BREAK_POINTS.lg;

    // Memmoized Variable
    const pairConfig = useMemo(() => allPairConfigs?.find((o) => o.pair === state.pair), [allPairConfigs, state.pair]);
    const unitConfig = useSelector((state) => getUnit(state, pairConfig?.quoteAsset));

    const subscribeFuturesSocket = (pair) => {
        if (!publicSocket) {
            setState({ socketStatus: !!publicSocket });
        } else {
            if (!state.prevPair || state.prevPair !== pair || !!publicSocket !== state.socketStatus) {
                publicSocket.emit('subscribe:futures:depth', pair);
                publicSocket.emit('subscribe:futures:recent_trade', pair);
                // publicSocket.emit('subscribe:futures:ticker', pair)
                publicSocket.emit('subscribe:futures:ticker', pair);
                // emit socket all
                publicSocket.emit('subscribe:futures:mini_ticker', 'all');

                setState({
                    socketStatus: !!publicSocket,
                    prevPair: pair
                });
            }
        }
    };

    const unsubscribeFuturesSocket = (pair) => {
        publicSocket?.emit('unsubscribe:futures:depth', pair);
        publicSocket?.emit('unsubscribe:futures:recent_trade', pair);
        publicSocket?.emit('unsubscribe:futures:ticker', 'all');
        // publicSocket?.emit('unsubscribe:futures:mini_ticker', 'all')
    };

    useEffect(() => {
        if (auth) {
            dispatch(fetchFuturesSetting());
            dispatch(getOrdersList());
        }
    }, [auth, dispatch]);

    useEffect(() => {
        const getOrders = () => {
            if (auth) dispatch(getOrdersList());
        };

        if (userSocket) {
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
            }
        };
    }, [userSocket, auth]);

    useEffect(() => {
        if (marketWatch?.[state.pair]) {
            setState({
                pairPrice: marketWatch[state.pair],
                forceUpdateState: state.forceUpdateState + 1
            });
        }
    }, [marketWatch, state.pair]);

    useEffect(() => {
        // ? Hide global scroll
        document.body.className += ' no-scrollbar';
        return () => {
            document.body.className = document.body.className?.replace('no-scrollbar', '');
        };
    }, []);

    // Re-load Previous Pair
    useEffect(() => {
        if (router?.query?.pair) {
            setState({ pair: router.query.pair });
            localStorage.setItem(LOCAL_STORAGE_KEY.PreviousFuturesPair, router.query.pair);
        }
    }, [router]);

    useEffect(() => {
        if (!state.pair) return;

        // ? Subscribe publicSocket
        subscribeFuturesSocket(state.pair);

        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + pairConfig?.symbol, async (data) => {
            const pairPrice = FuturesMarketWatch.create(data, pairConfig?.quoteAsset);
            // console.log('__ check pairPrice', pairPrice.symbol, state.pair, pairPrice);
            if (state.pair === pairPrice?.symbol && pairPrice?.lastPrice > 0) {
                setState({ pairPrice });
            }
        });

        // ? Unsubscribe publicSocket
        return () => {
            publicSocket && unsubscribeFuturesSocket(state.pair);
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + pairConfig?.symbol);
        };
    }, [publicSocket, state.pair]);

    useEffect(() => {
        setState({ isVndcFutures: pairConfig?.quoteAsset === 'VNDC' });
    }, [pairConfig, userSettings]);

    useEffect(() => {
        if (!localLayoutFutures) {
            setLocalLayoutFutures(initFuturesComponent);
        }
    }, [localLayoutFutures]);

    const resetDefault = (params) => {
        setLocalLayoutFutures({ ...initFuturesComponent, ...params });

        setComponentLayoutFutures({ ...initFuturesComponent, ...params });

        setState({ layouts: INITIAL_STATE.layouts });
        setLocalGridLayout({ ...localGridLayouts, [auth?.code || NON_LOGIN]: INITIAL_STATE.layouts });
    };

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            qty: getDecimalQty(pairConfig),
            symbol: unitConfig?.assetDigit ?? 0
        };
    }, [unitConfig, pairConfig]);

    const getDataGrid = useCallback((key) => state.prevLayouts?.find((layout) => layout.i === key), [state.prevLayouts]);

    return (
        <>
            {isMediumDevices && <FuturesTermsModal />}
            <FuturesPageTitle pair={state.pair} price={state.pairPrice?.lastPrice} pricePrecision={pairConfig?.pricePrecision} />
            <DynamicNoSsr>
                <MaldivesLayout
                    // useGridSettings
                    navStyle={{
                        boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)'
                    }}
                    hideFooter
                    page="futures"
                    spotState={componentLayoutFutures}
                    onChangeSpotState={setComponentLayoutFutures}
                    resetDefault={resetDefault}
                >
                    <div className="w-full ">
                        {isMediumDevices ? (
                            <GridLayout
                                className="layout"
                                layouts={localGridLayouts?.[auth?.code || NON_LOGIN] || state.layouts}
                                breakpoints={futuresGridConfig.breakpoints}
                                cols={futuresGridConfig.cols}
                                margin={[-1, -1]}
                                containerPadding={[0, 0]}
                                rowHeight={24}
                                draggableHandle=".dragHandleArea"
                                onLayoutChange={(_currentLayout, allNewLayouts) => {
                                    const flatLayout = [...allNewLayouts[state.breakpoint], ...state.prevLayouts].filter((layout, index, originLayouts) => {
                                        const firstIndex = originLayouts.findIndex((l) => l.i === layout.i);
                                        return firstIndex === index;
                                    });

                                    setLocalGridLayout({
                                        ...localGridLayouts,
                                        [auth?.code || NON_LOGIN]: { ...allNewLayouts, [state.breakpoint]: flatLayout }
                                    });

                                    setState({ prevLayouts: flatLayout, layouts: { ...allNewLayouts, [state.breakpoint]: flatLayout } });
                                }}
                                onBreakpointChange={(breakpoint) => setState({ breakpoint })}
                                onResize={(e) =>
                                    setState({
                                        forceUpdateState: state.forceUpdateState + 1
                                    })
                                }
                            >
                                {componentLayoutFutures?.isShowFavorites && (
                                    <GridItem
                                        className="overflow-x-auto"
                                        data-grid={getDataGrid(futuresGridKey.favoritePair)}
                                        key={futuresGridKey.favoritePair}
                                    >
                                        <DragHandleArea />
                                        <FuturesFavoritePairs favoritePairLayout={state.favoritePairLayout} pairConfig={pairConfig} />
                                    </GridItem>
                                )}
                                {componentLayoutFutures?.isShowPairDetail && (
                                    <GridItem
                                        data-grid={getDataGrid(futuresGridKey.pairDetail)}
                                        key={futuresGridKey.pairDetail}
                                        className={classNames('relative z-20')}
                                    >
                                        <DragHandleArea />
                                        <FuturesPairDetail
                                            pairPrice={state.pairPrice}
                                            pairConfig={pairConfig}
                                            forceUpdateState={state.forceUpdateState}
                                            isVndcFutures={state.isVndcFutures}
                                            isAuth={!!auth}
                                        />
                                    </GridItem>
                                )}
                                {componentLayoutFutures?.isShowChart && (
                                    <GridItem id="futures_containter_chart" key={futuresGridKey.chart} data-grid={getDataGrid(futuresGridKey.chart)}>
                                        <DragHandleArea />
                                        <FuturesChart
                                            chartKey="futures_containter_chart"
                                            pair={pairConfig?.pair}
                                            initTimeFrame=""
                                            isVndcFutures={state.isVndcFutures}
                                            ordersList={ordersList}
                                        />
                                    </GridItem>
                                )}
                                {componentLayoutFutures?.isShowOpenOrders && (
                                    <GridItem
                                        data-grid={getDataGrid(futuresGridKey.tradeRecord)}
                                        key={futuresGridKey.tradeRecord}
                                        className={classNames('overflow-auto')}
                                    >
                                        <DragHandleArea />
                                        <FuturesTradeRecord
                                            isVndcFutures={true}
                                            layoutConfig={state.tradeRecordLayout}
                                            pairConfig={pairConfig}
                                            pairPrice={state.pairPrice}
                                            isAuth={!!auth}
                                            pair={state.pair}
                                        />
                                    </GridItem>
                                )}
                                {componentLayoutFutures?.isShowPlaceOrder && (
                                    <GridItem data-grid={getDataGrid(futuresGridKey.placeOrder)} key={futuresGridKey.placeOrder}>
                                        <DragHandleArea />

                                        <FuturesPlaceOrderVndc
                                            isAuth={!!auth}
                                            pairConfig={pairConfig}
                                            userSettings={userSettings}
                                            assumingPrice={state.assumingPrice}
                                            isVndcFutures={state.isVndcFutures}
                                            pairPrice={state.pairPrice}
                                            pair={state.pair}
                                            decimals={decimals}
                                        />
                                    </GridItem>
                                )}
                                {componentLayoutFutures?.isShowAssets && auth && (
                                    <GridItem data-grid={getDataGrid(futuresGridKey.marginRatio)} key={futuresGridKey.marginRatio}>
                                        <DragHandleArea />
                                        <FuturesMarginRatioVndc
                                            pairConfig={pairConfig}
                                            auth={auth}
                                            lastPrice={state.pairPrice?.lastPrice}
                                            decimals={decimals}
                                        />
                                    </GridItem>
                                )}
                            </GridLayout>
                        ) : (
                            <DefaultMobileView />
                        )}
                    </div>
                </MaldivesLayout>
            </DynamicNoSsr>

            <FuturesProfitEarned isVisible={false} />
        </>
    );
};

{
    /* <div className="dragHandleArea w-1.5 space-y-1 absolute right-0  top-1">
    <div className="w-full h-0.5 bg-gray-2 dark:bg-darkBlue-4 rounded-md"></div>
    <div className="w-full h-0.5 bg-gray-2 dark:bg-darkBlue-4 rounded-md"></div>
    <div className="w-full h-0.5 bg-gray-2 dark:bg-darkBlue-4 rounded-md"></div>
</div>; */
}

const GridItem = styled.div.attrs({ className: 'border border-divider dark:bg-dark-dark bg-white dark:border-divider-dark' })``;

const DragHandleArea = () => (
    <div className="dragHandleArea absolute w-[7px] space-y-1 top-1 right-0">
        <div className="h-0.5 w-full bg-gray-2 dark:bg-darkBlue-4 rounded-md" />
        <div className="h-0.5 w-full bg-gray-2 dark:bg-darkBlue-4 rounded-md" />
        <div className="h-0.5 w-full bg-gray-2 dark:bg-darkBlue-4 rounded-md" />
    </div>
);

export default Futures;
