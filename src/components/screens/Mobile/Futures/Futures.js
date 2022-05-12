import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import DynamicNoSsr from 'components/DynamicNoSsr';
import { useSelector, useDispatch } from 'react-redux';
import { FUTURES_DEFAULT_SYMBOL } from 'pages/futures';
import { PATHS } from 'constants/paths';
import FuturesMarketWatch from 'models/FuturesMarketWatch'
import FuturesMarkPrice from 'models/FuturesMarkPrice'
import Emitter from 'redux/actions/emitter';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { ApiStatus, PublicSocketEvent, UserSocketEvent } from 'redux/actions/const';
import { API_GET_FUTURES_MARK_PRICE, API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import TabOrders from './TabOrders/TabOrders'
import { getOrdersList } from 'redux/actions/futures'
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import SideOrder from './SideOrder';
import PlaceOrderMobile from './PlaceOrder/PlaceOrderMobile'
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';


const INITIAL_STATE = {
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

const FuturesMobile = () => {
    const [state, set] = useState(INITIAL_STATE);
    const dispatch = useDispatch();
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const userSocket = useSelector((state) => state.socket.userSocket);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const marketWatch = useSelector((state) => state.futures?.marketWatch);
    const auth = useSelector((state) => state.auth?.user);
    const userSettings = useSelector((state) => state.futures?.userSettings);
    const router = useRouter();
    const [side, setSide] = useState(VndcFutureOrderType.Side.BUY)
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES)
    const [availableAsset, setAvailableAsset] = useState(null)

    const pairConfig = useMemo(
        () => allPairConfigs?.find((o) => o.pair === state.pair),
        [allPairConfigs, state.pair]
    );

    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;

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


    // Re-load Previous Pair
    useEffect(() => {
        if (router?.query?.pair) {
            if (router.query.pair.indexOf('USDT') !== -1) {
                router.push(
                    `/mobile${PATHS.FUTURES_V2.DEFAULT}/${FUTURES_DEFAULT_SYMBOL}`,
                    undefined,
                    { shallow: true }
                )
                return;
            }
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

    const countDecimals = (value) => {
        if (Math.floor(value) === value || !value) return 0;
        return value.toString().split(".")[1]?.length || 0;
    }

    const decimals = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
        const decimalScaleQtyLimit = pairConfig?.filters.find(rs => rs.filterType === 'LOT_SIZE');
        const decimalScaleQtyMarket = pairConfig?.filters.find(rs => rs.filterType === 'MARKET_LOT_SIZE');
        return {
            decimalScalePrice: countDecimals(decimalScalePrice?.tickSize),
            decimalScaleQtyLimit: countDecimals(decimalScaleQtyLimit?.stepSize),
            decimalScaleQtyMarket: countDecimals(decimalScaleQtyMarket?.stepSize)
        }
    }, [pairConfig])

    useEffect(() => {
        if (avlbAsset) {
            const _avlb = avlbAsset?.[pairConfig?.quoteAssetId]
            setAvailableAsset(_avlb?.value - _avlb?.locked_value)
        }
    }, [avlbAsset, pairConfig])

    const pairPriceTemp = useRef(null);
    const mount = useRef(false);

    useEffect(() => {
        pairPriceTemp.current = state.pairPrice;
    }, [state.pairPrice])

    const getPairPrice = useCallback(() => {
        return pairPriceTemp.current
    }, [])

    return (
        <>
            <FuturesPageTitle
                pair={state.pair}
                price={state.pairPrice?.lastPrice}
                pricePrecision={pairConfig?.pricePrecision}
            />
            <DynamicNoSsr>
                <LayoutMobile>
                    <SideOrder side={side} setSide={setSide} />
                    <PlaceOrderMobile
                        decimals={decimals} side={side} pairPrice={state.pairPrice}
                        pair={state.pair} isAuth={!!auth} availableAsset={availableAsset}
                        pairConfig={pairConfig} isVndcFutures={isVndcFutures} getPairPrice={getPairPrice}
                    />
                    <TabOrders isVndcFutures={isVndcFutures} pair={state.pair} />
                </LayoutMobile>
            </DynamicNoSsr>
        </>
    );
};

export default FuturesMobile;