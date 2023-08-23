import React, { useEffect, useMemo, useRef, useState } from 'react';
import FuturesPageTitle from 'components/screens/Futures/FuturesPageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { FUTURES_DEFAULT_SYMBOL } from 'pages/futures';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import { ApiStatus, UserSocketEvent, TRADING_MODE, LOCAL_STORAGE_KEY } from 'redux/actions/const';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import TabOrders from 'components/screens/Nao_futures/Futures/TabOrders/TabOrders';
import { fetchFuturesSetting, getFuturesMarketWatch, getOrdersList, updateSymbolView, getFuturesFavoritePairs } from 'redux/actions/futures';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import PlaceOrderMobile from 'components/screens/Nao_futures/Futures/PlaceOrder/PlaceOrderMobile';
import ChartMobile from 'components/screens/Nao_futures/Futures/Chart/ChartMobile';
import styled from 'styled-components';
import { convertSymbol, countDecimals, emitWebViewEvent } from 'redux/actions/utils';
import EventModalMobile from './EventModalMobile';
import { API_FUTURES_CAMPAIGN_STATUS } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { PromotionStatus } from 'components/screens/Nao_futures/Futures/onboardingType';
import AnnouncementPopup from 'components/screens/Nao_futures/AnnouncementPopup';
import ContestModal from './ContestModal';
import { getAssetConfig, getPairConfig } from 'redux/selectors';

const INITIAL_STATE = {
    loading: false,
    pair: null,
    isVndcFutures: false,
    socketStatus: false
};

const FuturesMobile = ({ symbol }) => {
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
    const avlbAsset = useSelector((state) => state.wallet?.NAO_FUTURES);
    const [availableAsset, setAvailableAsset] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [scrollSnap, setScrollSnap] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [showOnBoardingModal, setShowOnBoardingModal] = useState(false);
    const campaign = useRef(null);

    const pairConfig = useSelector((state) => getPairConfig(state, symbol));
    const assetConfig = useSelector((state) => getAssetConfig(state, pairConfig?.quoteAssetId));

    useEffect(() => {
        if (!symbol) return;
        if (!pairConfig && allPairConfigs?.length > 0) {
            const newPair = allPairConfigs?.find((o) => o.pair === FUTURES_DEFAULT_SYMBOL)?.pair || allPairConfigs[0].pair;
            router.replace(`/mobile${PATHS.FUTURES_V2.DEFAULT}/${newPair}`);
        }
    }, [symbol, pairConfig]);

    const isVndcFutures = router.asPath.indexOf('VNDC') !== -1 || router.asPath.indexOf('VNST') !== -1;

    // Re-load Previous Pair
    useEffect(() => {
        if (router?.query?.pair) {
            setState({ pair: router.query.pair });
            localStorage.setItem(LOCAL_STORAGE_KEY.PreviousFuturesPair, router.query.pair);
            dispatch(updateSymbolView({ symbol: router.query.pair }));
        }
    }, [router]);

    const getCampaignStatus = async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_FUTURES_CAMPAIGN_STATUS,
                options: { method: 'GET' }
            });
            if (status === ApiStatus.SUCCESS) {
                campaign.current = data.filter((rs) => rs.status === PromotionStatus.PENDING);
                if (Array.isArray(campaign.current) && campaign.current.length > 0) {
                    setShowOnBoardingModal(true);
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };
    const subscribeFuturesSocket = (pair) => {
        if (!publicSocket) {
            setState({ socketStatus: !!publicSocket });
        } else {
            if (!state.prevPair || state.prevPair !== pair || !!publicSocket !== state.socketStatus) {
                publicSocket.emit('subscribe:futures:ticker', convertSymbol(pair));
                // publicSocket.emit('subscribe:futures:mini_ticker', 'all');
                setState({
                    socketStatus: !!publicSocket,
                    prevPair: pair
                });
            }
        }
    };

    const unsubscribeFuturesSocket = (pair) => {
        // publicSocket?.emit('unsubscribe:futures:mini_ticker', 'all');
    };

    useEffect(() => {
        if (!state.pair) return;

        // ? Subscribe publicSocket
        subscribeFuturesSocket(state.pair);

        // ? Unsubscribe publicSocket
        return () => {
            publicSocket && unsubscribeFuturesSocket(state.pair);
        };
    }, [publicSocket, state.pair]);

    useEffect(() => {
        dispatch(getFuturesMarketWatch());
        dispatch(fetchFuturesSetting({ isNao: true }));
        getCampaignStatus();
        emitWebViewEvent('nami_futures');
        dispatch(getFuturesFavoritePairs(TRADING_MODE.NAO));
    }, []);

    useEffect(() => {
        setState({ isVndcFutures: pairConfig?.quoteAsset === 'VNDC' });
    }, [pairConfig, userSettings, state.layouts]);

    useEffect(() => {
        if (auth && timestamp) getOrders();
    }, [auth, timestamp]);

    const getOrders = () => {
        if (auth) dispatch(getOrdersList({ product: 2 }));
    };

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER_NAO, getOrders);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER_NAO, getOrders);
            }
        };
    }, [userSocket]);

    const decimals = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find((rs) => rs.filterType === 'PRICE_FILTER');
        const decimalScaleQtyLimit = pairConfig?.filters.find((rs) => rs.filterType === 'LOT_SIZE');
        const decimalScaleQtyMarket = pairConfig?.filters.find((rs) => rs.filterType === 'MARKET_LOT_SIZE');
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
        if (typeof window !== 'undefined') {
            setScrollSnap(false);
            const vh = window.innerHeight * 0.01;
            const el = document.querySelector('#futures-mobile .form-order');
            if (el) {
                const scrollSnap = el.clientHeight <= vh * 100;
                if (scrollSnap) {
                    setScrollSnap(true);
                    return {
                        isFullScreen: true,
                        style: {
                            height: vh * 100,
                            scrollSnapAlign: 'start'
                        }
                    };
                }
                return {
                    isFullScreen: false,
                    style: { height: 'max-content' }
                };
            }
            return {
                isFullScreen: false,
                style: { height: 'max-content' }
            };
        } else {
            return {
                isFullScreen: false,
                style: { height: 'max-content' }
            };
        }
    }, [state.pair, typeof window]);

    const onBlurInput = () => {
        const offset = document.activeElement.getBoundingClientRect();
        if (offset && offset?.top < 10) {
            document.activeElement.blur();
        }
    };

    const onScroll = (e) => {
        onBlurInput();
    };

    return (
        <>
            <AnnouncementPopup />
            <FuturesPageTitle pair={state.pair} pricePrecision={pairConfig?.pricePrecision} pairConfig={pairConfig} />
            <LayoutMobile>
                <ContestModal />
                {showOnBoardingModal && <EventModalMobile campaign={campaign.current} onClose={() => setShowOnBoardingModal(false)} />}
                <Container id="futures-mobile" onScroll={onScroll}>
                    <Section className="form-order bg-bgPrimary dark:bg-bgPrimary-dark" style={{ ...futuresScreen.style }}>
                        <ChartMobile
                            key={'ChartMobile' + state.pair}
                            pair={state.pair}
                            pairConfig={pairConfig}
                            isVndcFutures={isVndcFutures}
                            setCollapse={setCollapse}
                            collapse={collapse}
                            forceRender={forceRender}
                            isFullScreen={futuresScreen.isFullScreen}
                            decimals={decimals}
                        />
                        <PlaceOrderMobile
                            key={'PlaceOrderMobile' + state.pair}
                            setSide={setSide}
                            decimals={decimals}
                            side={side}
                            pair={state.pair}
                            isAuth={!!auth}
                            availableAsset={availableAsset}
                            pairConfig={pairConfig}
                            isVndcFutures={isVndcFutures}
                            collapse={collapse}
                            onBlurInput={onBlurInput}
                            decimalSymbol={assetConfig?.assetDigit ?? 0}
                        />
                    </Section>
                    <Section className="bg-bgPrimary dark:bg-bgPrimary-dark" style={{ ...futuresScreen.style }}>
                        <TabOrders
                            scrollSnap={scrollSnap}
                            isVndcFutures={isVndcFutures}
                            key={'TabOrders' + state.pair}
                            pair={state.pair}
                            pairConfig={pairConfig}
                            isAuth={!!auth}
                            setForceRender={setForceRender}
                            forceRender={forceRender}
                            isFullScreen={futuresScreen.isFullScreen}
                            decimals={decimals}
                        />
                    </Section>
                </Container>
            </LayoutMobile>
        </>
    );
};
const Container = styled.div`
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: calc(var(--vh, 1vh) * 100);
`;

const Section = styled.div`
    width: 100%;
    height: unset;
    ${'' /* height:calc(var(--vh, 1vh) * 100); */}
    ${'' /* scroll-snap-align:start */}
`;

export default FuturesMobile;
