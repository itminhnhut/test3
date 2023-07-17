import DefaultMobileView from 'src/components/common/DefaultMobileView';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import PlaceOrderForm from 'src/components/trade/PlaceOrderForm';
import SimplePlaceOrderForm from 'src/components/trade/SimplePlaceOrderForm';
import SymbolDetail from 'src/components/trade/SymbolDetail';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { useSelector } from 'react-redux';
import { useAsync, useLocalStorage } from 'react-use';
import { LOCAL_STORAGE_KEY, NON_LOGIN_KEY, SPOT_LAYOUT_MODE } from 'redux/actions/const';
import Chart from 'src/components/trade/Chart';
import OrderBook from 'src/components/trade/OrderBook';
import SpotHead from 'src/components/trade/SpotHead';
import SpotOrderList from 'src/components/trade/SpotOrderList';
import SymbolList from 'src/components/trade/SymbolList';
import Trades from 'src/components/trade/Trades';
import { PublicSocketEvent } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { getMarketWatch, postSymbolViews } from 'src/redux/actions/market';
import { getSymbolString, getDecimalPrice, getDecimalQty } from 'src/redux/actions/utils';
import { useWindowSize } from 'utils/customHooks';
import find from 'lodash/find';
import useDarkMode from 'hooks/useDarkMode';
import classNames from 'classnames';
import { spotGridKey, layoutPro, layoutSimple, initSpotSetting, spotSettingKey } from './_spotLayout';
import DragHandleArea from 'components/common/ReactGridItem/DragHandleArea';
import RemoveItemArea from 'components/common/ReactGridItem/RemoveItemArea';

const ReactGridLayout = WidthProvider(RGL);

const SpotComp = () => {
    const router = useRouter();
    const { id, timeframe, indicator, layout } = router.query;
    const [currentTheme] = useDarkMode();
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const user = useSelector((state) => state.auth?.user) || null;

    const [layoutConfig, setLayoutConfig] = useState(() => (layout === SPOT_LAYOUT_MODE.PRO ? layoutPro : layoutSimple));
    const [layoutMode, setLayoutMode] = useState(() => (layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE));
    const [symbol, setSymbol] = useState(symbolFromUrl);
    const isPro = layoutMode === SPOT_LAYOUT_MODE.PRO;

    // compact state
    const [state, set] = useState({
        orderBook: null,
        prevLayout: layoutConfig
    });

    // Spot layout
    const [lastSymbol, setLastSymbol] = useState(null);
    const [publicSocketStatus, setPublicSocketStatus] = useState(false);

    const [orderBookLayout, setOrderBookLayout] = useState({});
    const [tradesLayout, setTradesLayout] = useState({});

    const [initTimeFrame, setInitTimeFrame] = useState('');

    const [localProLayout, setLocalProLayout] = useLocalStorage(LOCAL_STORAGE_KEY.SPOT_GRID_LAYOUT);
    const [localSetting, setLocalSetting] = useLocalStorage(LOCAL_STORAGE_KEY.SPOT_SETTING_LAYOUT);
    const [componentSetting, setComponentSetting] = useState(localSetting || initSpotSetting);

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

    useEffect(() => {
        setLayoutConfig(layout === SPOT_LAYOUT_MODE.PRO ? localProLayout?.[user?.code || NON_LOGIN_KEY] || layoutPro : layoutSimple);
        setLayoutMode(layout === SPOT_LAYOUT_MODE.PRO ? SPOT_LAYOUT_MODE.PRO : SPOT_LAYOUT_MODE.SIMPLE);
    }, [layout, user?.code]);

    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const onLayoutSettingChangeHandler = (newSetting) => {
        setComponentSetting(newSetting);
        setLocalSetting(newSetting);
    };

    const resetDefault = () => {
        setLayoutConfig(isPro ? layoutPro : layoutSimple);

        if (isPro) {
            setLocalProLayout({ ...localProLayout, [user?.code || NON_LOGIN_KEY]: layoutPro });
        }
        onLayoutSettingChangeHandler(initSpotSetting);
    };

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

    const decimals = useMemo(() => {
        const config = exchangeConfig.find((rs) => rs.symbol === symbol?.base + symbol?.quote);
        return {
            price: getDecimalPrice(config),
            qty: getDecimalQty(config)
        };
    }, [exchangeConfig, symbol]);

    const getDataGrid = useCallback((key) => find(isPro ? state.prevLayout : layoutSimple, { i: key }), [state.prevLayout, isPro]);

    if (!symbol) return null;

    return (
        <MaldivesLayout
            hideFooter
            page="spot"
            changeLayoutCb={setLayoutMode}
            spotState={componentSetting}
            onChangeSpotState={setComponentSetting}
            resetDefault={resetDefault}
        >
            <SpotHead symbol={symbol} decimals={decimals} />
            <MobileView>
                <DefaultMobileView />
            </MobileView>
            <BrowserView className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                <div className={layoutMode === SPOT_LAYOUT_MODE.PRO ? 'w-full' : ''}>
                    <ReactGridLayout
                        className="layout"
                        layout={layoutConfig}
                        onLayoutChange={(currentLayout) => {
                            // save to localstorage only on layout PRO
                            if (isPro) {
                                setLocalProLayout({ ...localProLayout, [user?.code || NON_LOGIN_KEY]: currentLayout });
                                const flatLayout = [...currentLayout, ...state.prevLayout].filter((layout, index, originLayouts) => {
                                    const firstIndex = originLayouts.findIndex((l) => l.i === layout.i);
                                    return firstIndex === index;
                                });
                                setState({ prevLayout: flatLayout });
                            }

                            setLayoutConfig(currentLayout);
                        }}
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
                        resizeHandle={() => (
                            <span
                                className={classNames('z-[1] react-resizable-handle react-resizable-handle-se opacity-0 group-hover:opacity-100', {
                                    'nami-react-resizable-handle--dark': currentTheme === 'dark',
                                    'nami-react-resizable-handle': currentTheme !== 'dark'
                                })}
                            />
                        )}
                    >
                        {!isPro && componentSetting[spotSettingKey.SYMBOL_LIST] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.SYMBOL_LIST)}
                                key={spotGridKey.SYMBOL_LIST}
                                className={classNames('z-10 group border-l border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark')}
                            >
                                <SymbolList publicSocket={publicSocket} symbol={symbol} />
                            </div>
                        )}
                        {componentSetting[spotSettingKey.CHART] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.CHART)}
                                key={spotGridKey.CHART}
                                id="spot_containter_chart"
                                className={classNames(
                                    `group border-t border-b border-r border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark`,
                                    {
                                        '!border': isPro
                                    }
                                )}
                            >
                                {isPro && (
                                    <>
                                        <RemoveItemArea onClick={() => onLayoutSettingChangeHandler({ ...componentSetting, [spotSettingKey.CHART]: false })} />
                                        <DragHandleArea height={20} />
                                    </>
                                )}

                                <Chart chartKey="spot_containter_chart" symbol={symbol} initTimeFrame={initTimeFrame} isPro={isPro} />
                            </div>
                        )}
                        {componentSetting[spotSettingKey.SYMBOL_DETAIL] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.SYMBOL_DETAIL)}
                                key={spotGridKey.SYMBOL_DETAIL}
                                className={classNames(
                                    `group border-b border-r border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark`,
                                    {
                                        '!border': isPro
                                    }
                                )}
                            >
                                {isPro && (
                                    <>
                                        <RemoveItemArea
                                            onClick={() => onLayoutSettingChangeHandler({ ...componentSetting, [spotSettingKey.SYMBOL_DETAIL]: false })}
                                        />

                                        <DragHandleArea height={20} />
                                    </>
                                )}
                                <SymbolDetail isPro={isPro} layoutMode={layoutMode} symbol={symbol} publicSocket={publicSocket} decimals={decimals} />
                            </div>
                        )}

                        {componentSetting[spotSettingKey.TRADES] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.TRADES)}
                                key={spotGridKey.TRADES}
                                className={classNames(
                                    `group border-l overflow-auto border-t border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark`,
                                    {
                                        '!border': isPro
                                    }
                                )}
                            >
                                {isPro && (
                                    <>
                                        <RemoveItemArea onClick={() => onLayoutSettingChangeHandler({ ...componentSetting, [spotSettingKey.TRADES]: false })} />

                                        <DragHandleArea height={20} />
                                    </>
                                )}
                                <Trades isPro={isPro} symbol={symbol} publicSocket={publicSocket} layoutConfig={tradesLayout} decimals={decimals} />
                            </div>
                        )}
                        {componentSetting[spotSettingKey.ORDER_FORM] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.ORDER_FORM)}
                                key={spotGridKey.ORDER_FORM}
                                className={classNames(
                                    `group border-b border-r border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark`,
                                    {
                                        '!border': isPro
                                    }
                                )}
                            >
                                {!isPro ? (
                                    <SimplePlaceOrderForm symbol={symbol} orderBook={state.orderBook} />
                                ) : (
                                    <>
                                        <RemoveItemArea
                                            onClick={() => onLayoutSettingChangeHandler({ ...componentSetting, [spotSettingKey.ORDER_FORM]: false })}
                                        />

                                        <DragHandleArea height={24} />
                                        <PlaceOrderForm symbol={symbol} orderBook={state.orderBook} />
                                    </>
                                )}
                            </div>
                        )}
                        {componentSetting[spotSettingKey.ORDER_LIST] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.ORDER_LIST)}
                                key={spotGridKey.ORDER_LIST}
                                key="orderList"
                                className={classNames(
                                    `group border-t border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark`,
                                    {
                                        '!border': isPro
                                    }
                                )}
                            >
                                {isPro && (
                                    <RemoveItemArea onClick={() => onLayoutSettingChangeHandler({ ...componentSetting, [spotSettingKey.ORDER_LIST]: false })} />
                                )}
                                <SpotOrderList isPro={isPro} />
                            </div>
                        )}
                        {componentSetting[spotSettingKey.ORDER_BOOK] && (
                            <div
                                data-grid={getDataGrid(spotGridKey.ORDER_BOOK)}
                                key={spotGridKey.ORDER_BOOK}
                                className={classNames(
                                    `group border-r border-t border-b border-divider dark:border-divider-dark bg-bgSpotContainer dark:bg-bgSpotContainer-dark`,
                                    {
                                        '!border': isPro
                                    }
                                )}
                            >
                                {isPro && (
                                    <>
                                        <RemoveItemArea
                                            onClick={() => onLayoutSettingChangeHandler({ ...componentSetting, [spotSettingKey.ORDER_BOOK]: false })}
                                        />
                                        <DragHandleArea height={20} />
                                    </>
                                )}
                                <OrderBook isPro={isPro} symbol={symbol} parentState={setState} layoutConfig={orderBookLayout} decimals={decimals} />
                            </div>
                        )}
                    </ReactGridLayout>
                </div>
            </BrowserView>
        </MaldivesLayout>
    );
};

export default SpotComp;
