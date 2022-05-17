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
import TabOrders from 'components/screens/Mobile/Futures/TabOrders/TabOrders'
import { getOrdersList } from 'redux/actions/futures'
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import SideOrder from 'components/screens/Mobile/Futures/SideOrder';
import PlaceOrderMobile from 'components/screens/Mobile/Futures/PlaceOrder/PlaceOrderMobile'
import { FuturesOrderTypes as OrderTypes, FuturesOrderTypes } from 'redux/reducers/futures';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout';
import ChartMobile from 'components/screens/Mobile/Futures/Chart/ChartMobile';
import styled from 'styled-components';

const INITIAL_STATE = {
    loading: false,
    pair: null,
    isVndcFutures: false,
};

const FuturesMobile = () => {
    const [state, set] = useState(INITIAL_STATE);
    const dispatch = useDispatch();
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const userSocket = useSelector((state) => state.socket.userSocket);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const auth = useSelector((state) => state.auth?.user);
    const userSettings = useSelector((state) => state.futures?.userSettings);
    const router = useRouter();
    const [side, setSide] = useState(VndcFutureOrderType.Side.BUY)
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES)
    const [availableAsset, setAvailableAsset] = useState(null)
    const [collapse, setCollapse] = useState(false);

    const pairConfig = useMemo(
        () => allPairConfigs?.find((o) => o.pair === state.pair),
        [allPairConfigs, state.pair]
    );

    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1;

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

    return (
        <>
            <SocketLayout pair={state.pair} pairConfig={pairConfig}>
                <FuturesPageTitle
                    pair={state.pair}
                    pricePrecision={pairConfig?.pricePrecision}
                    pairConfig={pairConfig}
                />
            </SocketLayout>
            <DynamicNoSsr>
                <LayoutMobile>
                    <Container>
                        <Section>
                            <ChartMobile
                                pair={state.pair} pairConfig={pairConfig}
                                isVndcFutures={isVndcFutures}
                                setCollapse={setCollapse} collapse={collapse}
                            />
                            <SideOrder side={side} setSide={setSide} />
                            <SocketLayout pair={state.pair} pairConfig={pairConfig}>
                                <PlaceOrderMobile
                                    decimals={decimals} side={side}
                                    pair={state.pair} isAuth={!!auth} availableAsset={availableAsset}
                                    pairConfig={pairConfig} isVndcFutures={isVndcFutures}
                                />
                            </SocketLayout>
                        </Section>
                        <Section style={{ overflow: 'hidden' }}>
                            <TabOrders isVndcFutures={isVndcFutures} pair={state.pair} pairConfig={pairConfig} isAuth={!!auth} />
                        </Section>
                    </Container>
                </LayoutMobile>
            </DynamicNoSsr>
        </>
    );
};
const Container = styled.div`
scroll-snap-type:y mandatory;
overflow-y:scroll;
height:calc(var(--vh, 1vh) * 100 - 80px);
`

const Section = styled.div`
width: 100%;
height:calc(var(--vh, 1vh) * 100 - 80px);
scroll-snap-align:start
`

export default FuturesMobile;