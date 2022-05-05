import { useEffect, useMemo, useState } from 'react';
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants';
import { ApiStatus, PublicSocketEvent, UserSocketEvent } from 'redux/actions/const';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useSelector, useDispatch } from 'react-redux';
import { API_GET_FUTURES_MARK_PRICE, API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FUTURES_DEFAULT_SYMBOL } from './index';
import { useRouter } from 'next/router';
import FuturesMarketWatch from '../../models/FuturesMarketWatch';
import FuturesMarkPrice from '../../models/FuturesMarkPrice';
import FuturesFavoritePairs from 'components/screens/Futures/FavoritePairs';
import FuturesRecentTrades from 'components/screens/Futures/RecentTrades';
import FuturesTradeRecord from 'components/screens/Futures/TradeRecord';
import FuturesMarginRatio from 'components/screens/Futures/MarginRatio';
import FuturesPairDetail from 'components/screens/Futures/PairDetail';
import FuturesPlaceOrder from 'components/screens/Futures/PlaceOrder';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import FuturesOrderBook from 'components/screens/Futures/OrderBook';
import FuturesChart from 'components/screens/Futures/FuturesChart';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import futuresGridConfig, {
    futuresGridKey,
    getLayoutFromLS,
    setLayoutToLS,
} from 'components/screens/Futures/_futuresGrid';
import useWindowSize from 'hooks/useWindowSize';
import DynamicNoSsr from 'components/DynamicNoSsr';
import dynamic from 'next/dynamic';
import Emitter from 'redux/actions/emitter';
import Axios from 'axios';

import 'react-grid-layout/css/styles.css';
import { log } from 'utils';
import FuturesPlaceOrderVndc from 'components/screens/Futures/PlaceOrder/Vndc/FuturesPlaceOrderVndc';
import FuturesMarginRatioVndc from 'components/screens/Futures/PlaceOrder/Vndc/MarginRatioVndc';
import { useStore } from 'src/redux/store';
import { getOrdersList } from '../../redux/actions/futures'
import { PATHS } from 'constants/paths';

const GridLayout = WidthProvider(Responsive);

const FuturesProfitEarned = dynamic(
    () => import('components/screens/Futures/TakedProfit'),
    { ssr: false }
);

const INITIAL_STATE = {
    layouts: futuresGridConfig.layouts,
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
    isVndcFutures: false,
    assumingPrice: null,
};

const initFuturesComponent = {
    isShowFavorites: true,
    isShowPairDetail: true,
    isShowChart: true,
    isShowOpenOrders: true,
    isShowPlaceOrder: true,
    isShowAssets: true,
    isShowOrderBook: true,
    isShowTrades: true
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
    const ordersList = useSelector(state => state?.futures?.ordersList)


    const router = useRouter();
    const { width } = useWindowSize();
    const isMediumDevices = width >= BREAK_POINTS.md;
    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;
    const [filterLayout, setFilterLayout] = useState({ ...initFuturesComponent })

    // Memmoized Variable
    const pairConfig = useMemo(
        () => allPairConfigs?.find((o) => o.pair === state.pair),
        [allPairConfigs, state.pair]
    );

    // Helper
    const getPairMarkPrice = async (symbol) => {
        if (!symbol) return;
        setState({ loading: true });
        try {
            const { data } = await Axios.get(API_GET_FUTURES_MARK_PRICE, {
                params: { symbol },
            });
            if (data?.status === ApiStatus.SUCCESS) {
                setState({
                    markPrice: FuturesMarkPrice.create(data?.data?.[0]),
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
            if (
                !state.prevPair ||
                state.prevPair !== pair ||
                !!publicSocket !== state.socketStatus
            ) {
                publicSocket.emit('subscribe:futures:depth', pair);
                publicSocket.emit('subscribe:futures:recent_trade', pair);
                // publicSocket.emit('subscribe:futures:ticker', pair)
                publicSocket.emit('subscribe:futures:mark_price', pair);
                publicSocket.emit('subscribe:futures:ticker', pair);
                // emit socket all
                publicSocket.emit('subscribe:futures:mini_ticker', 'all')

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
        if (auth) getOrders()
    }, [auth])

    const getOrders = () => {
        if (auth) dispatch(getOrdersList())
    }

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

    const setItemLayoutVndc = (item, layout) => {
        const _item = futuresGridConfig.layoutsVndc[layout].find(i => i.i === item.i);
        if (_item) {
            item.w = _item.w;
            item.h = _item.h;
            item.x = _item.x;
            item.y = _item.y;
        }
        if (!auth) {
            if (item.i === futuresGridKey.chart) {
                item.h = layout === 'md' ? 31 : layout === 'lg' ? 29 : layout === 'xl' ? 36 : layout === '2xl' ? 32 : item.w;
            }
        }
        return item;
    }

    const setItemLayoutUsdt = (item, layout) => {
        const _item = futuresGridConfig.layouts[layout].find(i => i.i === item.i);
        if (_item) {
            item.w = _item.w;
            item.h = _item.h;
            item.x = _item.x;
            item.y = _item.y;
        }
        return item;
    }

    const getLayouts = (layouts) => {
        const oldLayouts = JSON.parse(JSON.stringify(layouts));
        Object.keys(oldLayouts)
            .map(layout => {
                return oldLayouts[layout].map(item => {
                    return isVndcFutures ? setItemLayoutVndc(item, layout) : setItemLayoutUsdt(item, layout);
                });
            });
        setLayoutToLS(isVndcFutures ? 'VNDC' : 'USDT', oldLayouts);
        return oldLayouts;
    };

    const onLayoutChange = (layout, layouts, isVNDC) => {
        const _layouts = getLayouts(layouts);
        setState({
            layouts: _layouts,
            favoritePairLayout: layout?.find(
                (o) => o.i === futuresGridKey.favoritePair
            ),
            orderBookLayout: layout?.find(
                (o) => o.i === futuresGridKey.orderBook
            ),
            tradeRecordLayout: layout?.find(
                (o) => o.i === futuresGridKey.tradeRecord
            ),
            forceUpdateState: state.forceUpdateState + 1,
        });
    };

    const setOrderInput = (depth = { rate: 0, amount: 0 }) => {
        console.log('Set Input ', depth)
    }

    // ? Init Price and MarkPrice
    useEffect(() => {
        if (marketWatch?.[state.pair]) {
            setState({
                pairPrice: marketWatch[state.pair],
                forceUpdateState: state.forceUpdateState + 1,
            });
        }
    }, [marketWatch, state.pair]);

    useEffect(() => {
        setState({ markPrice: null });
        getPairMarkPrice(state.pair);
    }, [state.pair]);

    useEffect(() => {
        let originLayouts = getLayoutFromLS(isVndcFutures ? 'VNDC' : 'USDT');
        const settingLayoutFutures = localStorage.getItem('settingLayoutFutures')
        if (!settingLayoutFutures) {
            localStorage.setItem('settingLayoutFutures', JSON.stringify(initFuturesComponent));
        } else {
            setFilterLayout(JSON.parse(settingLayoutFutures));
        }
        // ? Hide global scroll
        document.body.className += ' no-scrollbar';
        // Re-init lastest layouts
        if (originLayouts) {
            originLayouts = JSON.parse(JSON.stringify(originLayouts));
        } else {
            originLayouts = getLayouts(futuresGridConfig.layouts);
        }
        setState({
            layouts: originLayouts,
            forceUpdateState: state.forceUpdateState + 1,
        });
        return () => {
            document.body.className = document.body.className?.replace(
                'no-scrollbar',
                ''
            );
        };
    }, [isVndcFutures]);

    // Re-load Previous Pair
    useEffect(() => {
        if (router?.query?.pair) {
            setState({ pair: router.query.pair });
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.pair
            );
        }
    }, [router]);

    useEffect(() => {
        if (!state.pair) return;

        // ? Subscribe publicSocket
        subscribeFuturesSocket(state.pair);

        // ? Get Pair Ticker
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, async (data) => {
            const pairPrice = FuturesMarketWatch.create(data, pairConfig?.quoteAsset);
            // console.log('__ check pairPrice', pairPrice.symbol, state.pair, pairPrice);
            if (state.pair === pairPrice?.symbol && pairPrice?.lastPrice > 0) {
                setState({ pairPrice });
            }
        });

        // ? Get Mark Price
        Emitter.on(
            PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE + state.pair,
            async (data) => {
                const markPrice = FuturesMarkPrice.create(data);
                if (
                    state.pair === markPrice?.symbol &&
                    !!markPrice?.markPrice
                ) {
                    setState({ markPrice });
                }
            }
        );

        // ? Unsubscribe publicSocket
        return () => {
            publicSocket && unsubscribeFuturesSocket(state.pair);
            Emitter.off(PublicSocketEvent.FUTURES_TICKER_UPDATE);
            Emitter.off(PublicSocketEvent.FUTURES_MARK_PRICE_UPDATE);
        };
    }, [publicSocket, state.pair]);

    useEffect(() => {
        setState({ isVndcFutures: pairConfig?.quoteAsset === 'VNDC' });
    }, [pairConfig, userSettings, state.layouts]);

    const resetDefault = () => {
        localStorage.setItem('settingLayoutFutures', JSON.stringify(initFuturesComponent));
        setFilterLayout({ ...initFuturesComponent })
    }

    return (
        <>
            <FuturesPageTitle
                pair={state.pair}
                price={state.pairPrice?.lastPrice}
                pricePrecision={pairConfig?.pricePrecision}
            />
            <DynamicNoSsr>
                <MaldivesLayout
                    // useGridSettings
                    navStyle={{
                        boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)',
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
                                className="layout !h-full"
                                layouts={state.layouts}
                                breakpoints={futuresGridConfig.breakpoints}
                                cols={futuresGridConfig.cols}
                                margin={[-1, -1]}
                                containerPadding={[0, 0]}
                                rowHeight={24}
                                draggableHandle=".dragHandleArea"
                                draggableCancel=".dragCancelArea"
                                onLayoutChange={(_layout, _layouts) =>
                                    onLayoutChange(_layout, _layouts)
                                }
                                onResize={(e) =>
                                    setState({
                                        forceUpdateState:
                                            state.forceUpdateState + 1,
                                    })
                                }
                            >
                                {auth && filterLayout.isShowFavorites && (
                                    <div
                                        key={futuresGridKey.favoritePair}
                                        className={`border border-divider dark:border-divider-dark`}
                                    >
                                        <FuturesFavoritePairs
                                            favoritePairLayout={
                                                state.favoritePairLayout
                                            }
                                            pairConfig={pairConfig}
                                        />
                                    </div>
                                )}
                                {filterLayout.isShowPairDetail &&
                                    <div
                                        key={futuresGridKey.pairDetail}
                                        className={`relative z-20 border border-divider dark:border-divider-dark`}
                                    >
                                        <FuturesPairDetail
                                            pairPrice={state.pairPrice}
                                            markPrice={state.markPrice}
                                            pairConfig={pairConfig}
                                            forceUpdateState={
                                                state.forceUpdateState
                                            }
                                            isVndcFutures={state.isVndcFutures}
                                            isAuth={!!auth}
                                        />
                                    </div>
                                }
                                {filterLayout.isShowChart &&
                                    <div
                                        key={futuresGridKey.chart}
                                        className={`border border-divider dark:border-divider-dark`}
                                    >
                                        <FuturesChart
                                            pair={pairConfig?.pair}
                                            initTimeFrame="1D"
                                            isVndcFutures={state.isVndcFutures}
                                            ordersList={ordersList}
                                        />
                                    </div>
                                }
                                {filterLayout.isShowOrderBook &&
                                    <div
                                        key={futuresGridKey.orderBook}
                                        className={`border z-20 border-divider dark:border-divider-dark ${isVndcFutures ? 'hidden' : ''}`}
                                    >
                                        <FuturesOrderBook
                                            pairConfig={pairConfig}
                                            markPrice={state.markPrice?.markPrice}
                                            lastPrice={state.pairPrice?.lastPrice}
                                            orderBookLayout={state.orderBookLayout}
                                            setOrderInput={setOrderInput}
                                            setAssumingPrice={(assumingPrice) =>
                                                setState({ assumingPrice })
                                            }
                                        />
                                    </div>
                                }
                                {filterLayout.isShowTrades &&
                                    <div
                                        key={futuresGridKey.recentTrades}
                                        className={`border border-divider dark:border-divider-dark ${isVndcFutures ? 'hidden' : ''}`}
                                    >
                                        <FuturesRecentTrades
                                            pairConfig={pairConfig}
                                        />
                                    </div>
                                }
                                {filterLayout.isShowOpenOrders &&
                                    <div
                                        key={futuresGridKey.tradeRecord}
                                        className={`border border-divider dark:border-divider-dark`}
                                    >
                                        <FuturesTradeRecord
                                            isVndcFutures={state.isVndcFutures}
                                            layoutConfig={state.tradeRecordLayout}
                                            pairConfig={pairConfig}
                                            pairPrice={state.pairPrice}
                                            isAuth={!!auth}
                                            pair={state.pair}
                                        />
                                    </div>
                                }
                                {filterLayout.isShowPlaceOrder &&
                                    <div
                                        key={futuresGridKey.placeOrder}
                                        className={`border border-divider dark:border-divider-dark`}
                                    >
                                        {state.isVndcFutures ?
                                            <FuturesPlaceOrderVndc
                                                isAuth={!!auth}
                                                markPrice={state.markPrice?.markPrice}
                                                lastPrice={state.pairPrice?.lastPrice}
                                                pairConfig={pairConfig}
                                                userSettings={userSettings}
                                                assumingPrice={state.assumingPrice}
                                                isVndcFutures={state.isVndcFutures}
                                                ask={state.pairPrice?.ask}
                                                bid={state.pairPrice?.bid}
                                                pair={state.pair}
                                            />
                                            :
                                            <FuturesPlaceOrder
                                                isAuth={!!auth}
                                                markPrice={state.markPrice?.markPrice}
                                                lastPrice={state.pairPrice?.lastPrice}
                                                pairConfig={pairConfig}
                                                userSettings={userSettings}
                                                assumingPrice={state.assumingPrice}
                                            />
                                        }
                                    </div>
                                }
                                {filterLayout.isShowAssets &&
                                    <div
                                        key={futuresGridKey.marginRatio}
                                        className={`border border-divider dark:border-divider-dark`}
                                    >
                                        {state.isVndcFutures ?
                                            <FuturesMarginRatioVndc
                                                pairConfig={pairConfig}
                                                auth={auth}
                                                lastPrice={state.pairPrice?.lastPrice}
                                            />
                                            :
                                            <FuturesMarginRatio
                                                pairConfig={pairConfig}
                                            />
                                        }
                                    </div>
                                }
                            </GridLayout>
                        )}
                    </div>
                </MaldivesLayout>
            </DynamicNoSsr>

            <FuturesProfitEarned isVisible={false} />
        </>
    );
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'spot',
            ])),
        },
    };
};

export const getStaticPaths = async () => {
    return {
        paths: [{ params: { pair: FUTURES_DEFAULT_SYMBOL } }],
        fallback: true,
    };
};

export default Futures;
