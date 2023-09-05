import { countDecimals, getDecimalPrice, getDecimalQty, getUnit } from 'redux/actions/utils';
import classNames from 'classnames';
import DynamicNoSsr from 'components/DynamicNoSsr';
import { DragHandleArea, RemoveItemArea, ResizeHandleArea } from 'components/common/ReactGridItem';
import FuturesOrderDetailModal from './FuturesModal/FuturesOrderDetailModal';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import useFetchApi from 'hooks/useFetchApi';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import futuresGridConfig, { futuresGridKey, futuresLayoutKey } from 'components/screens/Futures/_futuresGrid';
import { BREAK_POINTS } from 'constants/constants';
import useWindowSize from 'hooks/useWindowSize';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from 'react-use';
import { LOCAL_STORAGE_KEY, NON_LOGIN_KEY, PublicSocketEvent, UserSocketEvent } from 'redux/actions/const';
import Emitter from 'redux/actions/emitter';
import { fetchFuturesSetting, getOrdersList } from 'redux/actions/futures';
import DefaultMobileView from 'src/components/common/DefaultMobileView';
import styled from 'styled-components';

const GridLayout = WidthProvider(Responsive);

const FuturesProfitEarned = dynamic(() => import('components/screens/Futures/TakedProfit'), { ssr: false });
const FuturesFavoritePairs = dynamic(() => import('components/screens/Futures/FavoritePairs'), { ssr: false });
const FuturesChart = dynamic(() => import('components/screens/Futures/FuturesChart'), { ssr: false });
const FuturesPairDetail = dynamic(() => import('components/screens/Futures/PairDetail'), { ssr: false });
const FuturesTradeRecord = dynamic(() => import('components/screens/Futures/TradeRecord'), {
    ssr: false,
    loading: () => {
        const [currentTheme] = useDarkMode();

        return (
            <div className="h-full flex justify-center items-center">
                <Spiner isDark={currentTheme === THEME_MODE.DARK} />
            </div>
        );
    }
});
const FuturesMarginRatioVndc = dynamic(() => import('./PlaceOrder/Vndc/MarginRatioVndc'), { ssr: false });
const FuturesTermsModal = dynamic(() => import('components/screens/Futures/FuturesModal/FuturesTermsModal'), { ssr: false });
const FuturesPlaceOrderVndc = dynamic(() => import('components/screens/Futures/PlaceOrder/Vndc/FuturesPlaceOrderVndc'), { ssr: false });

const INITIAL_STATE = {
    layouts: futuresGridConfig.layoutsVndc,
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
    assumingPrice: null,
    isShowOrderIntegrateFromInsurance: false
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

const Futures = ({ integrate, orderId }) => {
    const isIntegrateFromInsurance = integrate === 'nami_insurance';

    const [state, set] = useState(INITIAL_STATE);

    const [localGridLayouts, setLocalGridLayout] = useLocalStorage(LOCAL_STORAGE_KEY.FUTURE_GRID_LAYOUT);
    const [localLayoutFutures, setLocalLayoutFutures] = useLocalStorage(LOCAL_STORAGE_KEY.FUTURE_SETTING_LAYOUT);
    const [componentLayoutFutures, setComponentLayoutFutures] = useState(localLayoutFutures || initFuturesComponent);

    const dispatch = useDispatch();
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const userSocket = useSelector((state) => state.socket.userSocket);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
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

    /* INSURANCE INTEGRATE ORDER ID  */
    const { data: orderIntegrateFromInsurance, error } = useFetchApi(
        {
            url: API_ORDER_DETAIL,
            params: {
                orderId
            }
        },
        isIntegrateFromInsurance,
        [isIntegrateFromInsurance, orderId]
    );

    useEffect(() => {
        if (Boolean(orderIntegrateFromInsurance) && !error) {
            setState({ isShowOrderIntegrateFromInsurance: true });
        }
    }, [orderIntegrateFromInsurance, error]);

    const insuranceIntegrateDecimals = useMemo(() => {
        const getDecimalPrice = (symbol) => {
            const decimalScalePrice = symbol?.filters.find((rs) => rs.filterType === 'PRICE_FILTER') ?? 1;
            return countDecimals(decimalScalePrice?.tickSize);
        };

        const symbol = allPairConfigs.find((rs) => rs.symbol === orderIntegrateFromInsurance?.symbol);
        const decimalSymbol = assetConfig.find((rs) => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
        const decimalScalePrice = getDecimalPrice(symbol);
        return {
            price: decimalScalePrice || 0,
            symbol: decimalSymbol || 0
        };
    }, [orderIntegrateFromInsurance, allPairConfigs, assetConfig]);
    /* INSURANCE INTEGRATE ORDER ID  */

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
        setLayoutFutures({ ...initFuturesComponent, ...params });

        setState({ layouts: INITIAL_STATE.layouts });
        setLocalGridLayout({ ...localGridLayouts, [auth?.code || NON_LOGIN_KEY]: INITIAL_STATE.layouts });
    };

    const setLayoutFutures = (newLayoutParams) => {
        setLocalLayoutFutures(newLayoutParams);
        setComponentLayoutFutures(newLayoutParams);
    };

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            qty: getDecimalQty(pairConfig),
            symbol: unitConfig?.assetDigit ?? 0
        };
    }, [unitConfig, pairConfig]);

    const getDataGrid = useCallback((key) => state.layouts[state.breakpoint]?.find((layout) => layout.i === key), [state.layouts, state.breakpoint]);

    return (
        <>
            {isMediumDevices && <FuturesTermsModal />}
            <FuturesPageTitle pair={state.pair} price={state.pairPrice?.lastPrice} pricePrecision={pairConfig?.pricePrecision} />
            <DynamicNoSsr>
                <MaldivesLayout
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
                                layouts={localGridLayouts?.[auth?.code || NON_LOGIN_KEY] || state.layouts}
                                breakpoints={futuresGridConfig.breakpoints}
                                cols={futuresGridConfig.cols}
                                margin={[-1, -1]}
                                containerPadding={[0, 0]}
                                rowHeight={24}
                                draggableHandle=".dragHandleArea"
                                resizeHandles={['se']}
                                resizeHandle={<ResizeHandleArea className="!z-[21]" />}
                                onLayoutChange={(_currentBPLayout, allBreakPointLayouts) => {
                                    const flatLayout = [...allBreakPointLayouts?.[state.breakpoint], ...futuresGridConfig.layoutsVndc[state.breakpoint]].filter(
                                        (layout, index, originLayouts) => {
                                            const firstIndex = originLayouts.findIndex((l) => l.i === layout.i);
                                            return firstIndex === index;
                                        }
                                    );

                                    setLocalGridLayout({
                                        ...localGridLayouts,
                                        [auth?.code || NON_LOGIN_KEY]: { ...allBreakPointLayouts, [state.breakpoint]: flatLayout }
                                    });

                                    setState({ layouts: { ...allBreakPointLayouts, [state.breakpoint]: flatLayout } });
                                }}
                                onBreakpointChange={(breakpoint) => setState({ breakpoint })}
                            >
                                {componentLayoutFutures?.isShowFavorites && (
                                    <GridItem
                                        className={classNames({
                                            '!border-t-transparent': getDataGrid(futuresGridKey.favoritePair).y === 0
                                        })}
                                        data-grid={getDataGrid(futuresGridKey.favoritePair)}
                                        key={futuresGridKey.favoritePair}
                                    >
                                        <RemoveItemArea
                                            onClick={() => setLayoutFutures({ ...componentLayoutFutures, [futuresLayoutKey.favoritePair]: false })}
                                        />
                                        <DragHandleArea />
                                        <FuturesFavoritePairs favoritePairLayout={state.favoritePairLayout} pairConfig={pairConfig} />
                                    </GridItem>
                                )}
                                {componentLayoutFutures?.isShowPairDetail && (
                                    <GridItem
                                        data-grid={getDataGrid(futuresGridKey.pairDetail)}
                                        key={futuresGridKey.pairDetail}
                                        className={classNames('relative z-20', {
                                            '!border-t-transparent': getDataGrid(futuresGridKey.pairDetail).y === 0
                                        })}
                                    >
                                        <RemoveItemArea onClick={() => setLayoutFutures({ ...componentLayoutFutures, [futuresLayoutKey.pairDetail]: false })} />
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
                                    <GridItem
                                        id="futures_containter_chart"
                                        key={futuresGridKey.chart}
                                        className={classNames({
                                            '!border-t-transparent': getDataGrid(futuresGridKey.chart).y === 0
                                        })}
                                        data-grid={getDataGrid(futuresGridKey.chart)}
                                    >
                                        <RemoveItemArea onClick={() => setLayoutFutures({ ...componentLayoutFutures, [futuresLayoutKey.chart]: false })} />
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
                                        className={classNames({
                                            '!border-t-transparent': getDataGrid(futuresGridKey.chart).y === 0
                                        })}
                                    >
                                        <RemoveItemArea
                                            className="!z-[21]"
                                            onClick={() => setLayoutFutures({ ...componentLayoutFutures, [futuresLayoutKey.tradeRecord]: false })}
                                        />
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
                                    <GridItem
                                        data-grid={getDataGrid(futuresGridKey.placeOrder)}
                                        key={futuresGridKey.placeOrder}
                                        className={classNames({
                                            '!border-t-transparent': getDataGrid(futuresGridKey.placeOrder).y === 0
                                        })}
                                    >
                                        <RemoveItemArea onClick={() => setLayoutFutures({ ...componentLayoutFutures, [futuresLayoutKey.placeOrder]: false })} />
                                        <DragHandleArea height={24} />
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
                                    <GridItem
                                        data-grid={getDataGrid(futuresGridKey.marginRatio)}
                                        key={futuresGridKey.marginRatio}
                                        className={classNames({
                                            '!border-t-transparent': getDataGrid(futuresGridKey.marginRatio).y === 0
                                        })}
                                    >
                                        <RemoveItemArea
                                            onClick={() => setLayoutFutures({ ...componentLayoutFutures, [futuresLayoutKey.marginRatio]: false })}
                                        />
                                        <DragHandleArea height={32} />
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
            <FuturesOrderDetailModal
                order={orderIntegrateFromInsurance}
                isVisible={state.isShowOrderIntegrateFromInsurance}
                onClose={() => setState({ isShowOrderIntegrateFromInsurance: false })}
                decimals={insuranceIntegrateDecimals}
            />

            <FuturesProfitEarned isVisible={false} />
        </>
    );
};

const GridItem = styled.div.attrs({ className: 'group border border-divider dark:border-divider-dark dark:bg-dark-dark bg-white ' })``;
export default Futures;
