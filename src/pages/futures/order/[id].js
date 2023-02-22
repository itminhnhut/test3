import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import DynamicNoSsr from 'components/DynamicNoSsr';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import futuresGridConfig, { futuresGridKey } from 'components/screens/Futures/_futuresGrid';
import useWindowSize from 'hooks/useWindowSize';
import { BREAK_POINTS } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { X } from 'react-feather';
import { useRouter } from 'next/router';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { VndcFutureOrderType, getProfitVndc, getRatioProfit } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import FuturesPairDetail from 'components/screens/Futures/PairDetail';
import { useSelector, useDispatch } from 'react-redux';
import FuturesChart from 'components/screens/Futures/FuturesChart';
import { formatNumber, formatTime, getUnit, getDecimalQty, getDecimalPrice, TypeTable } from 'redux/actions/utils';
import { ShareIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import FututesShareModal from 'components/screens/Futures/FuturesModal/FututesShareModal';
import ChevronDown from 'components/svg/ChevronDown';
import styled from 'styled-components';
import { UserSocketEvent, DefaultFuturesFee } from 'redux/actions/const';
import { getOrdersList } from 'redux/actions/futures';
import MiniTickerData from 'components/screens/Futures/MiniTickerData';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import FuturesOrderDetail from 'components/screens/Futures/FuturesModal/FuturesOrderDetail';

const GridLayout = WidthProvider(Responsive);

const OrderDetail = ({ id }) => {
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const userSocket = useSelector((state) => state.socket.userSocket);
    const timestamp = useSelector((state) => state.heath.timestamp);
    const auth = useSelector((state) => state.auth?.user);
    const dispatch = useDispatch();
    const [currentTheme] = useDarkMode();
    const router = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const isMediumDevices = width >= BREAK_POINTS.md;
    const [orderDetail, setOrderDetail] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const mount = useRef(false);
    const checking = useRef(false);

    const pairConfig = useMemo(() => {
        return allPairConfigs.find((rs) => rs.symbol === orderDetail?.symbol);
    }, [orderDetail, allPairConfigs]);

    const unitConfig = useSelector((state) => getUnit(state, pairConfig?.quoteAsset));

    const pairTicker = marketWatch[pairConfig?.symbol];
    const isVndcFutures = pairConfig?.quoteAsset === 'VNDC';
    const isDark = currentTheme === THEME_MODE.DARK;

    useEffect(() => {
        if (id) getDetail(id);
    }, [id]);

    const isHistory = useMemo(() => {
        return orderDetail?.status === VndcFutureOrderType.Status.CLOSED;
    }, [orderDetail]);

    useEffect(() => {
        if (!mount.current && Array.isArray(ordersList) && ordersList.length > 0 && orderDetail) {
            mount.current = true;
            return;
        }
        if (Array.isArray(ordersList) && orderDetail && !isHistory.current && mount.current) {
            const order = ordersList.find((item) => item.displaying_id === orderDetail?.displaying_id);
            if (!order) {
                router.back();
            } else {
                const mainOrder = order?.metadata?.dca_order_metadata?.is_main_order || order?.metadata?.partial_close_metadata?.is_main_order;
                if (Number(order?.order_value) !== Number(orderDetail?.order_value) && mainOrder && !checking.current) {
                    checking.current = true;
                    getDetail(id);
                }
            }
        }
    }, [ordersList, orderDetail]);

    const getDetail = async (id) => {
        try {
            const { status, data } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: id
                }
            });
            if (data) {
                setOrderDetail(data);
            }
            return data;
        } catch (e) {
            console.log('detail', e);
        } finally {
            checking.current = false;
        }
    };

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

    useEffect(() => {
        if (!publicSocket || !pairConfig) return;
        publicSocket.emit('subscribe:futures:ticker', pairConfig?.symbol);
        return () => {
            publicSocket?.emit('unsubscribe:futures:ticker', pairConfig?.symbol);
        };
    }, [publicSocket, pairConfig]);

    useEffect(() => {
        if (orderDetail) console.log(orderDetail);
    }, [orderDetail]);

    const renderQuoteprice = useCallback(() => {
        return orderDetail?.side === VndcFutureOrderType.Side.BUY ? (
            <MiniTickerData key={orderDetail?.displaying_id + 'bid'} initPairPrice={pairTicker} dataKey={'bid'} symbol={orderDetail?.symbol} />
        ) : (
            <MiniTickerData key={orderDetail?.displaying_id + 'ask'} initPairPrice={pairTicker} dataKey={'ask'} symbol={orderDetail?.symbol} />
        );
    }, [orderDetail]);

    const renderLiqPrice = (row) => {
        const size = row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity;
        const number = row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1;
        const swap = row?.swap || 0;
        const liqPrice =
            (size * row?.open_price + (row?.fee_data?.place_order?.['22'] || 0) + (row?.fee_data?.place_order?.['72'] || 0) + swap - row?.margin) /
            (row?.quantity * (number - DefaultFuturesFee.Nami));
        return liqPrice > 0 ? formatNumber(liqPrice, 0, decimals.price, false) : '-';
    };

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            qty: getDecimalQty(pairConfig),
            symbol: unitConfig?.assetDigit ?? 0
        };
    }, [unitConfig, pairConfig]);

    const general = useMemo(() => {
        const isBuy = orderDetail?.side === VndcFutureOrderType.Side.BUY;
        const profit = getProfitVndc(orderDetail, isBuy ? pairTicker?.bid : pairTicker?.ask, true);
        const percent = (profit / orderDetail?.margin) * 100;

        return {
            isBuy,
            profit,
            percent,
            price: +(orderDetail?.status === VndcFutureOrderType.Status.PENDING
                ? orderDetail?.price
                : orderDetail?.status === VndcFutureOrderType.Status.ACTIVE
                ? orderDetail?.open_price
                : orderDetail?.close_price)
        };
    }, [orderDetail, pairTicker]);

    if (!orderDetail) return null;

    return (
        <DynamicNoSsr>
            <FuturesOrderDetail order={orderDetail} isVisible={showOrderDetail} onClose={() => setShowOrderDetail(false)} decimals={decimals} />
            <FututesShareModal
                order={orderDetail}
                isVisible={showShareModal}
                onClose={() => setShowShareModal(false)}
                decimals={decimals}
                pairTicker={pairTicker}
            />
            <MaldivesLayout
                navStyle={{
                    boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)'
                }}
                hideFooter
            >
                <div className="w-full">
                    {isMediumDevices && (
                        <GridLayout
                            className="layout"
                            layouts={futuresGridConfig.layoutsDetail}
                            breakpoints={futuresGridConfig.breakpoints}
                            cols={futuresGridConfig.cols}
                            margin={[-1, -1]}
                            containerPadding={[0, 0]}
                            rowHeight={24}
                        >
                            <div key={futuresGridKey.title} className={`border-b border-divider dark:border-divider-dark w-full flex items-center px-6`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-2xl font-semibold">{t('futures:mobile:order_detail')}</div>
                                    <X size={20} className="cursor-pointer" onClick={() => router.back()} />
                                </div>
                            </div>
                            <div key={futuresGridKey.pairDetail} className={`relative z-20 border-b border-r border-divider dark:border-divider-dark`}>
                                <FuturesPairDetail pairPrice={pairTicker} pairConfig={pairConfig} isVndcFutures={isVndcFutures} isAuth={!!auth} />
                            </div>
                            <div id="futures_detail_containter_chart" key={futuresGridKey.chart} className={`border border-divider dark:border-divider-dark`}>
                                <FuturesChart
                                    key="futures_detail_containter_chart"
                                    chartKey="futures_detail_containter_chart"
                                    pair={pairConfig?.symbol}
                                    initTimeFrame="1D"
                                    isVndcFutures={isVndcFutures}
                                    ordersList={[orderDetail]}
                                />
                            </div>
                            <div key={futuresGridKey.orderDetail} className={`border-l border-divider dark:border-divider-dark py-10 `}>
                                <div className="pl-4 pr-6 flex items-center space-x-1 text-xs leading-5 text-txtSecondary dark:text-txtSecondary-dark">
                                    <span>ID #{orderDetail?.displaying_id}</span>
                                    <span>•</span>
                                    <span>{formatTime(orderDetail?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                                </div>
                                <div className="pl-4 pr-6 mt-5 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{orderDetail?.symbol}</span>
                                            <span className="py-0.5 px-1 bg-dark-2 rounded-[3px] text-xs">{orderDetail?.leverage}x</span>
                                            <ShareIcon
                                                onClick={() => setShowShareModal(true)}
                                                color={isDark ? colors.white : colors.darkBlue}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                        <div className={`flex items-center text-xs leading-4 ${general.isBuy ? 'text-teal' : 'text-red'}`}>
                                            <TypeTable type="side" data={orderDetail} />
                                            <span>&nbsp;/&nbsp;</span>
                                            <TypeTable type="type" data={orderDetail} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`${general.profit < 0 ? 'text-red' : 'text-teal'} font-semibold`}>
                                            {general.profit < 0 ? '' : '+'}
                                            {formatNumber(general.profit, decimals.symbol, 0, true)}
                                        </span>
                                        <span className={`${general.percent < 0 ? 'text-red' : 'text-teal'} text-xs leading-4 flex items-center justify-end`}>
                                            <ChevronDown
                                                color={general.percent < 0 ? colors.red2 : colors.teal}
                                                className={`${general.percent >= 0 ? 'rotate-0' : ''}`}
                                            />
                                            {formatNumber(Math.abs(general.percent), 2, 0, true)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center w-full border-t border-b border-divider dark:border-divider-dark">
                                    <Row className="p-6 w-full border-r border-divider dark:border-divider-dark text-center">
                                        <Item>{t('futures:stop_loss')}</Item>
                                        <Item className="text-red flex flex-col text-base">
                                            <span>{formatNumber(orderDetail?.sl)}</span>
                                            <span>({getRatioProfit(orderDetail?.sl, orderDetail)}%)</span>
                                        </Item>
                                    </Row>
                                    <Row className="p-6 w-full text-center">
                                        <Item>{t('futures:take_profit')}</Item>
                                        <Item className="text-teal flex flex-col text-base">
                                            <span>{formatNumber(orderDetail?.tp)}</span>
                                            <span>({getRatioProfit(orderDetail?.tp, orderDetail)}%)</span>
                                        </Item>
                                    </Row>
                                </div>
                                <div className="mt-10 grid grid-cols-3 pl-4 pr-6 gap-y-6">
                                    <Row>
                                        <Item>{t('futures:order_table:open_price')}</Item>
                                        <Item>{formatNumber(general.price, decimals.price)}</Item>
                                    </Row>
                                    <Row className="items-center">
                                        <Item>{t('common:volume')}</Item>
                                        <Item>{formatNumber(orderDetail?.order_value, decimals.symbol)}</Item>
                                    </Row>
                                    <Row className="items-end">
                                        <Item>{t('futures:margin')}</Item>
                                        <Item>{formatNumber(orderDetail?.margin, decimals.symbol)}</Item>
                                    </Row>
                                    <Row>
                                        <Item>{t('futures:mobile:quote_price')}</Item>
                                        <Item>{renderQuoteprice()}</Item>
                                    </Row>
                                    <Row className="items-center">
                                        <Item>{t('futures:mobile:liq_price')}</Item>
                                        <Item>{renderLiqPrice(orderDetail)}</Item>
                                    </Row>
                                    <Row className="items-end">
                                        <Item>{t('common:last_price')}</Item>
                                        <Item>{formatNumber(pairTicker?.lastPrice, decimals.price)}</Item>
                                    </Row>
                                </div>
                                <div className="mt-10 pt-3 grid grid-cols-2 pl-4 pr-6 gap-y-3 gap-x-2">
                                    <ButtonV2 variants="secondary">{t('futures:mobile:modify_order')}</ButtonV2>
                                    <ButtonV2 variants="secondary">{t('futures:tp_sl:modify_tpsl')}</ButtonV2>
                                    <ButtonV2 onClick={() => setShowOrderDetail(true)} variants="secondary">
                                        {t('futures:mobile:order_detail')}
                                    </ButtonV2>
                                    <ButtonV2 variants="secondary">{t('common:close')}</ButtonV2>
                                </div>
                            </div>
                            <div key={futuresGridKey.logs} className={`border-t border-divider dark:border-divider-dark`}>
                                4
                            </div>
                        </GridLayout>
                    )}
                </div>
            </MaldivesLayout>
        </DynamicNoSsr>
    );
};

const Row = styled.div.attrs({
    className: `flex flex-col space-y-2`
})``;

const Item = styled.div.attrs(({ tooltip }) => ({
    className: `text-sm first:text-txtSecondary dark:first:text-txtSecondary-dark last:font-semibold whitespace-nowrap ${
        tooltip ? 'border-b border-dashed border-divider dark:border-divider-dark' : ''
    }`
}))``;

export const getServerSideProps = async ({ locale, params }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'trade', 'futures', 'wallet', 'error', 'spot'])),
            id: params?.id
        }
    };
};
export default OrderDetail;
