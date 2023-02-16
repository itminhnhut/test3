import { useEffect, useMemo, useRef, useState } from 'react';
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants';
import { ApiStatus, PublicSocketEvent, UserSocketEvent } from 'redux/actions/const';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDispatch, useSelector } from 'react-redux';
import { API_GET_FUTURES_MARK_PRICE } from 'redux/actions/apis';
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
import Axios from 'axios';
import 'react-grid-layout/css/styles.css';
import { getOrdersList } from 'redux/actions/futures';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import FuturesMarkPrice from 'models/FuturesMarkPrice';
import { getDecimalPrice, getDecimalQty, getUnit } from 'redux/actions/utils';
import FuturesMarginRatioVndc from './PlaceOrder/Vndc/MarginRatioVndc';

const GridLayout = WidthProvider(Responsive);

const FuturesProfitEarned = dynamic(() => import('components/screens/Futures/TakedProfit'), { ssr: false });

const INITIAL_STATE = {
    layouts: futuresGridConfig.layoutsVndc,
    loading: false,
    pair: null,
    prevPair: null,
    socketStatus: false,
    pairPrice: null,
    markPrice: null,
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
};

const Futures = () => {
    const [state, set] = useState(INITIAL_STATE);
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
    const isMediumDevices = width >= BREAK_POINTS.md;
    const [filterLayout, setFilterLayout] = useState({ ...initFuturesComponent });

    // Memmoized Variable
    const pairConfig = useMemo(() => allPairConfigs?.find((o) => o.pair === state.pair), [allPairConfigs, state.pair]);
    const unitConfig = useSelector((state) => getUnit(state, pairConfig?.quoteAsset));

    // Helper
    const getPairMarkPrice = async (symbol) => {
        if (!symbol) return;
        setState({ loading: true });
        try {
            const { data } = await Axios.get(API_GET_FUTURES_MARK_PRICE, {
                params: { symbol }
            });
            if (data?.status === ApiStatus.SUCCESS) {
                setState({
                    markPrice: FuturesMarkPrice.create(data?.data?.[0])
                });
            }
        } catch (e) {
            console.log(`Can't get ${symbol} marketWatch `, e);
        }
    };

    const subscribeFuturesSocket = (pair) => {
        if (!publicSocket) {
            setState({ socketStatus: !!publicSocket });
        } else {
            if (!state.prevPair || state.prevPair !== pair || !!publicSocket !== state.socketStatus) {
                publicSocket.emit('subscribe:futures:depth', pair);
                publicSocket.emit('subscribe:futures:recent_trade', pair);
                // publicSocket.emit('subscribe:futures:ticker', pair)
                publicSocket.emit('subscribe:futures:mark_price', pair);
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
        publicSocket?.emit('unsubscribe:futures:mark_price', pair);
        // publicSocket?.emit('unsubscribe:futures:mini_ticker', 'all')
    };

    useEffect(() => {
        if (auth) getOrders();
    }, [auth]);

    const getOrders = () => {
        if (auth) dispatch(getOrdersList());
    };

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
            }
        };
    }, [userSocket]);

    const getLayouts = (layouts) => {
        return futuresGridConfig.layoutsVndc;
    };

    const onLayoutChange = (layout, layouts, isVNDC) => {
        const _layouts = getLayouts(layouts);
        setState({
            layouts: _layouts,
            // favoritePairLayout: layout?.find((o) => o.i === futuresGridKey.favoritePair),
            // orderBookLayout: layout?.find((o) => o.i === futuresGridKey.orderBook),
            // tradeRecordLayout: layout?.find((o) => o.i === futuresGridKey.tradeRecord),
            forceUpdateState: state.forceUpdateState + 1
        });
    };

    // ? Init Price and MarkPrice
    useEffect(() => {
        if (marketWatch?.[state.pair]) {
            setState({
                pairPrice: marketWatch[state.pair],
                forceUpdateState: state.forceUpdateState + 1
            });
        }
    }, [marketWatch, state.pair]);

    useEffect(() => {
        setState({ markPrice: null });
        getPairMarkPrice(state.pair);
    }, [state.pair]);

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
            // if (router.query.pair.indexOf('USDT') !== -1) {
            //     router.push(
            //         `${PATHS.FUTURES_V2.DEFAULT}/${FUTURES_DEFAULT_SYMBOL}`,
            //         undefined,
            //         { shallow: true }
            //     );
            //     return;
            // }
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

        // ? Get Mark Price
        Emitter.on(PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE + state.pair, async (data) => {
            const markPrice = FuturesMarkPrice.create(data);
            if (state.pair === markPrice?.symbol && !!markPrice?.markPrice) {
                setState({ markPrice });
            }
        });

        // ? Unsubscribe publicSocket
        return () => {
            publicSocket && unsubscribeFuturesSocket(state.pair);
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE + pairConfig?.symbol);
            Emitter.off(PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE);
        };
    }, [publicSocket, state.pair]);

    useEffect(() => {
        setState({ isVndcFutures: pairConfig?.quoteAsset === 'VNDC' });
    }, [pairConfig, userSettings, state.layouts]);

    const resetDefault = () => {
        localStorage.setItem('settingLayoutFutures', JSON.stringify(initFuturesComponent));
        setFilterLayout({ ...initFuturesComponent });
    };

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            qty: getDecimalQty(pairConfig),
            symbol: unitConfig?.assetDigit ?? 0
        };
    }, [unitConfig, pairConfig]);

    return (
        <>
            <FuturesPageTitle pair={state.pair} price={state.pairPrice?.lastPrice} pricePrecision={pairConfig?.pricePrecision} />
            <DynamicNoSsr>
                <MaldivesLayout
                    // useGridSettings
                    navStyle={{
                        boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)'
                    }}
                    hideFooter
                    page="futures"
                    spotState={filterLayout}
                    onChangeSpotState={setFilterLayout}
                    resetDefault={resetDefault}
                >
                    <div className="w-full">
                        {isMediumDevices && (
                            <GridLayout
                                className="layout"
                                layouts={state.layouts}
                                breakpoints={futuresGridConfig.breakpoints}
                                cols={futuresGridConfig.cols}
                                margin={[-1, -1]}
                                containerPadding={[0, 0]}
                                rowHeight={24}
                                // draggableHandle=".dragHandleArea"
                                // draggableCancel=".dragCancelArea"
                                onLayoutChange={(_layout, _layouts) => onLayoutChange(_layout, _layouts)}
                                onResize={(e) =>
                                    setState({
                                        forceUpdateState: state.forceUpdateState + 1
                                    })
                                }
                            >
                                {auth && filterLayout.isShowFavorites && (
                                    <div key={futuresGridKey.favoritePair} className={`border-b border-r border-divider dark:border-divider-dark`}>
                                        <FuturesFavoritePairs favoritePairLayout={state.favoritePairLayout} pairConfig={pairConfig} />
                                    </div>
                                )}
                                {filterLayout.isShowPairDetail && (
                                    <div key={futuresGridKey.pairDetail} className={`relative z-20 border-b border-r border-divider dark:border-divider-dark`}>
                                        <FuturesPairDetail
                                            pairPrice={state.pairPrice}
                                            markPrice={state.markPrice}
                                            pairConfig={pairConfig}
                                            forceUpdateState={state.forceUpdateState}
                                            isVndcFutures={state.isVndcFutures}
                                            isAuth={!!auth}
                                        />
                                    </div>
                                )}
                                {filterLayout.isShowChart && (
                                    <div id="futures_containter_chart" key={futuresGridKey.chart} className={`border border-divider dark:border-divider-dark`}>
                                        <FuturesChart
                                            chartKey="futures_containter_chart"
                                            pair={pairConfig?.pair}
                                            initTimeFrame="1D"
                                            isVndcFutures={state.isVndcFutures}
                                            ordersList={ordersList}
                                        />
                                    </div>
                                )}
                                {filterLayout.isShowOpenOrders && (
                                    <div key={futuresGridKey.tradeRecord} className={`border-t border-r border-divider dark:border-divider-dark`}>
                                        <FuturesTradeRecord
                                            isVndcFutures={true}
                                            layoutConfig={state.tradeRecordLayout}
                                            pairConfig={pairConfig}
                                            pairPrice={state.pairPrice}
                                            isAuth={!!auth}
                                            pair={state.pair}
                                        />
                                    </div>
                                )}
                                {filterLayout.isShowPlaceOrder && (
                                    <div key={futuresGridKey.placeOrder} className={`border-l  border-divider dark:border-divider-dark`}>
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
                                    </div>
                                )}
                                {filterLayout.isShowAssets && !!auth && (
                                    <div key={futuresGridKey.marginRatio} className={`border border-b-0 border-divider dark:border-divider-dark`}>
                                        <FuturesMarginRatioVndc
                                            pairConfig={pairConfig}
                                            auth={auth}
                                            lastPrice={state.pairPrice?.lastPrice}
                                            decimals={decimals}
                                        />
                                    </div>
                                )}
                            </GridLayout>
                        )}
                    </div>
                </MaldivesLayout>
            </DynamicNoSsr>

            <FuturesProfitEarned isVisible={false} />
        </>
    );
};

export default Futures;
