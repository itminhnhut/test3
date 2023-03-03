import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import DynamicNoSsr from 'components/DynamicNoSsr';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import useWindowSize from 'hooks/useWindowSize';
import { BREAK_POINTS } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { X } from 'react-feather';
import { useRouter } from 'next/router';
import { API_ORDER_DETAIL, API_GET_FUTURES_ORDER } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { VndcFutureOrderType, getProfitVndc, getRatioProfit } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import FuturesPairDetail from 'components/screens/Futures/PairDetail';
import { useSelector, useDispatch } from 'react-redux';
import FuturesChart from 'components/screens/Futures/FuturesChart';
import { formatNumber, formatTime, getUnit, getDecimalQty, getDecimalPrice, TypeTable } from 'redux/actions/utils';
import { ShareIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import ChevronDown from 'components/svg/ChevronDown';
import styled from 'styled-components';
import { UserSocketEvent, DefaultFuturesFee, ApiStatus } from 'redux/actions/const';
import { getOrdersList } from 'redux/actions/futures';
import MiniTickerData from 'components/screens/Futures/MiniTickerData';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import EditSLTPV2 from 'components/screens/Futures/PlaceOrder/EditOrderV2/EditSLTPV2';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import ModifyOrder from 'components/screens/Futures/PlaceOrder/EditOrderV2/ModifyOrder';
import FuturesOrderDetailModal from 'components/screens/Futures/FuturesModal/FuturesOrderDetailModal';
import FututesShareModal from 'components/screens/Futures/FuturesModal/FututesShareModal';
import FuturesCloseOrder from 'components/screens/Futures/FuturesModal/FuturesCloseOrder';
import OrderLogs from 'components/screens/Futures/OrderDetail/OrderLogs';
import OrderLogsPending from 'components/screens/Futures/OrderDetail/OrderLogsPending';
import OrderDetailHistory from 'components/screens/Futures/OrderDetail/OrderDetailHistory';
import classNames from 'classnames';

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
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const [showEditVol, setShowEditVol] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const message = useRef({
        status: '',
        title: '',
        message: '',
        notes: ''
    });

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
        if (Array.isArray(ordersList) && orderDetail && !isHistory && mount.current) {
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
    }, [ordersList, orderDetail, isHistory]);

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
        const pending =
            !isHistory && (orderDetail?.status === VndcFutureOrderType.Status.PENDING || orderDetail?.status === VndcFutureOrderType.Status.REQUESTING);

        return {
            isBuy,
            profit,
            percent,
            price: +(orderDetail?.status === VndcFutureOrderType.Status.PENDING
                ? orderDetail?.price
                : orderDetail?.status === VndcFutureOrderType.Status.ACTIVE
                ? orderDetail?.open_price
                : orderDetail?.close_price),
            pending: pending,
            dca_close: orderDetail?.metadata?.dca_order_metadata || orderDetail?.metadata?.partial_close_metadata
        };
    }, [orderDetail, pairTicker, isHistory]);

    const fetchOrder = async (method = 'GET', params, cb) => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_GET_FUTURES_ORDER,
                options: { method },
                params: params
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data?.orders);
            } else {
                setShowEditSLTP(false);
                setShowAlert(true);
                message.current = {
                    status: 'error',
                    title: t('common:failed'),
                    message: message
                };
            }
        } catch (e) {
            if (cb) cb(e?.message);
        } finally {
            setTimeout(() => {
                getDetail(id);
            }, 2000);
        }
    };

    const onConfirmEdit = (params) => {
        fetchOrder('PUT', params, () => {
            localStorage.setItem('edited_id', params.displaying_id);
            setShowEditSLTP(false);
            setShowAlert(true);
            message.current = {
                status: 'success',
                title: t('common:success'),
                message: t('futures:modify_order_success')
            };
        });
    };

    const getValue = (number, decimal = 0) => {
        if (number) {
            return formatNumber(number, decimal, 0, true);
        } else {
            return '-';
        }
    };
    const isModify = orderDetail?.sl > 0 || orderDetail?.tp > 0;
    if (!orderDetail) return null;
    return (
        <DynamicNoSsr>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type={message.current.status}
                title={message.current.title}
                message={message.current.message}
                className="max-w-[448px]"
            />
            <FuturesOrderDetailModal order={orderDetail} isVisible={showOrderDetail} onClose={() => setShowOrderDetail(false)} decimals={decimals} />
            <FututesShareModal
                order={orderDetail}
                isVisible={showShareModal}
                onClose={() => setShowShareModal(false)}
                decimals={decimals}
                pairTicker={pairTicker}
            />
            <FuturesCloseOrder
                order={orderDetail}
                isVisible={showCloseModal}
                onClose={() => setShowCloseModal(false)}
                decimals={decimals}
                marketWatch={marketWatch}
                pairConfig={pairConfig}
                forceFetchOrder={() => getDetail(id)}
            />
            <EditSLTPV2
                isVisible={showEditSLTP}
                order={orderDetail}
                onClose={() => setShowEditSLTP(false)}
                status={orderDetail?.status}
                onConfirm={onConfirmEdit}
                pairConfig={pairConfig}
                decimals={decimals}
                marketWatch={marketWatch}
            />
            <ModifyOrder
                isVisible={showEditVol}
                order={orderDetail}
                onClose={() => setShowEditVol(false)}
                pairConfig={pairConfig}
                decimals={decimals}
                marketWatch={marketWatch}
                forceFetchOrder={() => getDetail(id)}
            />
            <MaldivesLayout
                navStyle={{
                    boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)'
                }}
                hideFooter
            >
                <div className="w-full">
                    {isMediumDevices && (
                        <div>
                            <div className={`border-b border-divider dark:border-divider-dark w-full flex items-center p-6`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-2xl leading-[30px] font-semibold">{t('futures:mobile:order_detail')}</div>
                                    <X size={20} className="cursor-pointer" onClick={() => router.back()} />
                                </div>
                            </div>
                            <div className="flex h-full">
                                <div
                                    className={classNames('border-divider dark:border-divider-dark', {
                                        'w-[calc(100%-368px)] border-r': !isHistory,
                                        'w-full': isHistory
                                    })}
                                >
                                    <div className="border-b border-divider dark:border-divider-dark py-5 max-h-[90px]">
                                        <FuturesPairDetail pairPrice={pairTicker} pairConfig={pairConfig} isVndcFutures={isVndcFutures} isAuth={!!auth} />
                                    </div>
                                    <div className={classNames('h-[calc(100%-90px)]')}>
                                        <FuturesChart
                                            key="futures_detail_containter_chart"
                                            chartKey="futures_detail_containter_chart"
                                            pair={pairConfig?.symbol}
                                            initTimeFrame="1D"
                                            isVndcFutures={isVndcFutures}
                                            ordersList={[orderDetail]}
                                        />
                                    </div>
                                </div>
                                {!isHistory && (
                                    <div className="w-[368px] py-10 h-full">
                                        <div className="pl-4 pr-6 flex items-center space-x-1 text-xs leading-5 text-txtSecondary dark:text-txtSecondary-dark">
                                            <span>ID #{orderDetail?.displaying_id}</span>
                                            <span>•</span>
                                            <span>{formatTime(orderDetail?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                                        </div>
                                        <div className="pl-4 pr-6 mt-5 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-semibold">{orderDetail?.symbol}</span>
                                                    <span className="py-0.5 px-1 bg-gray-11 dark:bg-dark-2 rounded-[3px] text-xs font-semibold">
                                                        {orderDetail?.leverage}x
                                                    </span>
                                                    <ShareIcon
                                                        onClick={() => setShowShareModal(true)}
                                                        color={isDark ? colors.white : colors.darkBlue}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                                <div className={`flex items-center text-xs leading-4 ${general.isBuy ? 'text-teal' : 'text-red'}`}>
                                                    {orderDetail?.metadata?.dca_order_metadata && general.pending && (
                                                        <span>{t('futures:mobile:adjust_margin:added_volume')}&nbsp;/&nbsp;</span>
                                                    )}
                                                    {orderDetail?.metadata?.partial_close_metadata && general.pending && (
                                                        <span>{t('futures:mobile:adjust_margin:close_partially')}&nbsp;/&nbsp;</span>
                                                    )}
                                                    <TypeTable type="side" data={orderDetail} />
                                                    <span>&nbsp;/&nbsp;</span>
                                                    <TypeTable type="type" data={orderDetail} />
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {general.pending ? (
                                                    <div
                                                        className={`bg-onus-bg3 px-4 py-1 rounded-full text-xs ${
                                                            general?.cancelled ? 'text-onus-grey' : 'text-yellow-2 bg-yellow-2/[0.15]'
                                                        }`}
                                                    >
                                                        {t(`futures:mobile:${general?.cancelled ? 'cancelled_order' : 'pending_order'}`)}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className={`${general.profit < 0 ? 'text-red' : 'text-teal'} font-semibold`}>
                                                            {general.profit < 0 ? '' : '+'}
                                                            {formatNumber(general.profit, decimals.symbol, 0, true)}
                                                        </span>
                                                        <span
                                                            className={`${
                                                                general.percent < 0 ? 'text-red' : 'text-teal'
                                                            } text-xs leading-4 flex items-center justify-end`}
                                                        >
                                                            <ChevronDown
                                                                color={general.percent < 0 ? colors.red2 : colors.teal}
                                                                className={`${general.percent >= 0 ? '!rotate-0' : ''}`}
                                                            />
                                                            {formatNumber(Math.abs(general.percent), 2, 0, true)}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-8 flex items-center w-full border-t border-b border-divider dark:border-divider-dark">
                                            <Row className="p-6 w-full border-r border-divider dark:border-divider-dark text-center">
                                                <Item>{general.pending ? t('futures:mobile:quote_price') : t('futures:stop_loss')}</Item>
                                                {general.pending ? (
                                                    <Item>{renderQuoteprice()}</Item>
                                                ) : (
                                                    <Item className="text-red flex flex-col text-base">
                                                        <span>{getValue(orderDetail?.sl)}</span>
                                                        {!!orderDetail?.sl && <span>{`(${getRatioProfit(orderDetail?.sl, orderDetail)}%)`}</span>}
                                                    </Item>
                                                )}
                                            </Row>
                                            <Row className="p-6 w-full text-center">
                                                <Item>{general.pending ? t('futures:order_table:open_price') : t('futures:take_profit')}</Item>
                                                {general.pending ? (
                                                    <Item>{formatNumber(general.price, decimals.price, 0, true)}</Item>
                                                ) : (
                                                    <Item className="text-teal flex flex-col text-base">
                                                        <span>{getValue(orderDetail?.tp)}</span>
                                                        {!!orderDetail?.tp && <span>{`(${getRatioProfit(orderDetail?.tp, orderDetail)}%)`}</span>}
                                                    </Item>
                                                )}
                                            </Row>
                                        </div>
                                        <div className="mt-10 grid grid-cols-3 pl-4 pr-6 gap-y-6">
                                            <Row>
                                                <Item>{general.pending ? t('futures:stop_loss') : t('futures:order_table:open_price')}</Item>
                                                <Item className={general.pending ? 'text-red' : ''}>
                                                    {general.pending ? getValue(orderDetail?.sl) : formatNumber(general.price, decimals.price)}
                                                </Item>
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
                                                <Item>{general.pending ? t('futures:take_profit') : t('futures:mobile:quote_price')}</Item>
                                                <Item className={general.pending ? 'text-teal' : ''}>
                                                    {general.pending ? getValue(orderDetail?.tp) : renderQuoteprice()}
                                                </Item>
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
                                            {!general.pending && (
                                                <ButtonV2 onClick={() => setShowEditVol(true)} variants="secondary">
                                                    {t('futures:mobile:modify_order')}
                                                </ButtonV2>
                                            )}
                                            {!(general.dca_close && general.pending) && (
                                                <ButtonV2
                                                    className={general.pending ? 'col-span-2' : ''}
                                                    onClick={() => setShowEditSLTP(true)}
                                                    variants="secondary"
                                                >
                                                    {t(`futures:tp_sl:${isModify ? 'modify' : 'add'}_tpsl`)}
                                                </ButtonV2>
                                            )}
                                            <ButtonV2
                                                className={general.dca_close && general.pending ? 'col-span-2' : ''}
                                                onClick={() => setShowOrderDetail(true)}
                                                variants="secondary"
                                            >
                                                {t('futures:mobile:order_detail')}
                                            </ButtonV2>
                                            <ButtonV2
                                                className={general.dca_close && general.pending ? 'col-span-2' : ''}
                                                onClick={() => setShowCloseModal(true)}
                                                variants="secondary"
                                            >
                                                {t('common:close')}
                                            </ButtonV2>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-divider dark:border-divider-dark px-6">
                                {isHistory && (
                                    <>
                                        <div className="mt-12 mb-6 font-semibold">{t('futures:mobile:order_detail')}</div>
                                        <OrderDetailHistory
                                            orderDetail={orderDetail}
                                            decimals={decimals}
                                            setShowShareModal={setShowShareModal}
                                            isDark={isDark}
                                            general={general}
                                            pairConfig={pairConfig}
                                            renderLiqPrice={renderLiqPrice}
                                            getValue={getValue}
                                            isVndcFutures={isVndcFutures}
                                        />
                                    </>
                                )}
                                <div className="mt-12 mb-6 font-semibold">{t('futures:order_history:adjustment_history')}</div>
                                <div className="pb-12">
                                    {general.pending ? (
                                        <OrderLogsPending orderDetail={orderDetail} decimals={decimals} />
                                    ) : (
                                        <OrderLogs orderDetail={orderDetail} decimals={decimals} />
                                    )}
                                </div>
                            </div>
                        </div>
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
