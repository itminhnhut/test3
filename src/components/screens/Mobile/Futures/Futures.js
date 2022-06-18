import React, { useEffect, useMemo, useState } from 'react';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { FUTURES_DEFAULT_SYMBOL } from 'pages/futures';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import { UserSocketEvent } from 'redux/actions/const';
import { LOCAL_STORAGE_KEY } from 'constants/constants';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import TabOrders from 'components/screens/Mobile/Futures/TabOrders/TabOrders';
import { getOrdersList } from 'redux/actions/futures';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import PlaceOrderMobile from 'components/screens/Mobile/Futures/PlaceOrder/PlaceOrderMobile';
import SocketLayout from 'components/screens/Mobile/Futures/SocketLayout';
import ChartMobile from 'components/screens/Mobile/Futures/Chart/ChartMobile';
import styled from 'styled-components';
import { countDecimals, emitWebViewEvent } from 'redux/actions/utils';

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
    const timestamp = useSelector((state) => state.heath.timestamp);
    const router = useRouter();
    const [side, setSide] = useState(VndcFutureOrderType.Side.BUY);
    const avlbAsset = useSelector((state) => state.wallet?.FUTURES);
    const [availableAsset, setAvailableAsset] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [scrollSnap, setScrollSnap] = useState(false);
    const [forceRender, setForceRender] = useState(false);



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
                );
                return;
            }
            setState({ pair: router.query.pair });
            localStorage.setItem(
                LOCAL_STORAGE_KEY.PreviousFuturesPair,
                router.query.pair
            );
        }
    }, [router]);

    useEffect(()=>{
        emitWebViewEvent('nami_futures')
    }, [])

    useEffect(() => {
        setState({ isVndcFutures: pairConfig?.quoteAsset === 'VNDC' });
    }, [pairConfig, userSettings, state.layouts]);

    useEffect(() => {
        if (auth && timestamp) getOrders();
    }, [auth, timestamp]);

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

    const decimals = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
        const decimalScaleQtyLimit = pairConfig?.filters.find(rs => rs.filterType === 'LOT_SIZE');
        const decimalScaleQtyMarket = pairConfig?.filters.find(rs => rs.filterType === 'MARKET_LOT_SIZE');
        return {
            decimalScalePrice: countDecimals(decimalScalePrice?.tickSize),
            decimalScaleQtyLimit: countDecimals(decimalScaleQtyLimit?.stepSize),
            decimalScaleQtyMarket: countDecimals(decimalScaleQtyMarket?.stepSize)
        };
    }, [pairConfig]);

    useEffect(() => {
        if (avlbAsset) {
            const _avlb = avlbAsset?.[pairConfig?.quoteAssetId];
            setAvailableAsset(Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0));
        }
    }, [avlbAsset, pairConfig]);

    const futuresScreen = useMemo(() => {
        if (typeof window !== "undefined") {
            setScrollSnap(false);
            const vh = window.innerHeight * 0.01;
            const el = document.querySelector('#futures-mobile .form-order');
            if (el) {
                const scrollSnap = el.clientHeight <= vh * 100;
                if (scrollSnap) {
                    setScrollSnap(true);
                    return { isFullScreen: true, style: { height: vh * 100, scrollSnapAlign: 'start' } }
                }
                return { isFullScreen: false, style: { height: 'max-content' } }
            }
            return { isFullScreen: false, style: { height: 'max-content' } }
        } else {
            return { isFullScreen: false, style: { height: 'max-content' } }
        }
    }, [state.pair, typeof window])

    const onBlurInput = () => {
        const offset = document.activeElement.getBoundingClientRect()
        if (offset && offset?.top < 10) {
            document.activeElement.blur();
        }
    }

    const onScroll = (e) => {
        onBlurInput();
    }

    return (
        <>
            <SocketLayout pair={state.pair} pairConfig={pairConfig}>
                <FuturesPageTitle
                    pair={state.pair}
                    pricePrecision={pairConfig?.pricePrecision}
                    pairConfig={pairConfig}
                />
            </SocketLayout>
            <LayoutMobile>
                <Container id="futures-mobile" onScroll={onScroll}>
                    <Section className="form-order bg-onus"
                        style={{ ...futuresScreen.style }}>
                        <ChartMobile
                            pair={state.pair} pairConfig={pairConfig}
                            isVndcFutures={isVndcFutures}
                            setCollapse={setCollapse} collapse={collapse}
                            forceRender={forceRender}
                            isFullScreen={futuresScreen.isFullScreen}
                            decimals={decimals}
                        />
                        <SocketLayout pair={state.pair} pairConfig={pairConfig}>
                            <PlaceOrderMobile
                                setSide={setSide}
                                decimals={decimals} side={side}
                                pair={state.pair} isAuth={!!auth} availableAsset={availableAsset}
                                pairConfig={pairConfig} isVndcFutures={isVndcFutures}
                                collapse={collapse} onBlurInput={onBlurInput}
                            />
                        </SocketLayout>
                    </Section>
                    <Section className="bg-onus" style={{ ...futuresScreen.style }}>
                        <TabOrders scrollSnap={scrollSnap} isVndcFutures={isVndcFutures}
                            pair={state.pair} pairConfig={pairConfig} isAuth={!!auth}
                            setForceRender={setForceRender} forceRender={forceRender}
                            isFullScreen={futuresScreen.isFullScreen}
                        />
                    </Section>
                </Container>
            </LayoutMobile>
        </>
    );
};
const Container = styled.div`
scroll-snap-type:y mandatory;
overflow-y:scroll;
height:calc(var(--vh, 1vh) * 100);
`

const Section = styled.div`
width: 100%;
height:unset;
${'' /* height:calc(var(--vh, 1vh) * 100); */}
${'' /* scroll-snap-align:start */}
`

export default FuturesMobile;
