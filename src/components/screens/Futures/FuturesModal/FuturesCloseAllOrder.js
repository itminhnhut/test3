import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { BxsInfoCircle, ShareIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { API_CLOSE_ALL_ORDERS_BY_CONDTION, API_GET_ALL_ORDERS_BY_CONDTION } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { formatNumber, formatTime, TypeTable, getDecimalPrice, getUnit } from 'redux/actions/utils';
import { VndcFutureOrderType, getProfitVndc } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useSelector } from 'react-redux';
import ChevronDown from 'components/svg/ChevronDown';
import colors from 'styles/colors';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { ApiStatus } from 'redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import NoData from 'components/common/V2/TableV2/NoData';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import FututesShareModal from 'components/screens/Futures/FuturesModal/FututesShareModal';
import classNames from 'classnames';

const FuturesCloseAllOrder = ({ isVisible, onClose, marketWatch, pairConfig, closeType, isPosition }) => {
    const { t } = useTranslation();
    const unitConfig = useSelector((state) => getUnit(state, pairConfig?.quoteAsset));
    const quoteAsset = pairConfig?.quoteAsset;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [closing, setClosing] = useState(false);
    const message = useRef({
        status: '',
        title: '',
        message: '',
        notes: ''
    });

    useEffect(() => {
        if (pairConfig && isVisible) {
            profit.current = 0;
            getOrdersByCloseType();
        }
    }, [pairConfig, isVisible, closeType]);

    const getOrdersByCloseType = async () => {
        setLoading(true);
        try {
            const { data } = await FetchApi({
                url: API_GET_ALL_ORDERS_BY_CONDTION,
                options: {
                    method: 'POST'
                },
                params: {
                    type: closeType?.type,
                    pair: pairConfig?.symbol
                }
            });
            if (data) setOrders(data);
        } catch (error) {
            console.log('Error when get orders by close type', error);
        } finally {
            setLoading(false);
        }
    };

    const onCloseAll = async () => {
        setClosing(true);
        try {
            const { data, status } = await FetchApi({
                url: API_CLOSE_ALL_ORDERS_BY_CONDTION,
                options: {
                    method: 'POST'
                },
                params: {
                    type: closeType?.type,
                    pair: pairConfig?.symbol
                }
            });
            if (status === ApiStatus.SUCCESS) {
                message.current = {
                    status: 'success',
                    title: t('futures:mobile:close_all_positions:close_orders_success'),
                    message: t('futures:close_order:request_successfully')
                };
            }
        } catch (error) {
            console.log('Error when get orders by close type', error);
            message.current = {
                status: 'error',
                title: t('common:failed'),
                message: error?.message
            };
        } finally {
            setClosing(false);
            setShowAlert(true);
            if (onClose) onClose();
        }
    };

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            symbol: unitConfig?.assetDigit ?? 0
        };
    }, [unitConfig, pairConfig]);

    const profit = useRef({});
    const calProfit = (e) => {
        profit.current = { ...profit.current, ...e };
    };

    const totalProfit = useMemo(() => {
        return Object.keys(profit.current).reduce((sum, key) => sum + parseFloat(profit.current[key] || 0), 0);
    }, [profit.current]);

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type={message.current?.status}
                title={message.current?.title}
                message={message.current?.message}
                notes={message.current?.notes}
            />
            <ModalV2 className={isPosition ? '!max-w-[800px]' : '!max-w-[448px]'} isVisible={isVisible} onBackdropCb={onClose}>
                <div className="text-2xl font-semibold">{closeType?.label}</div>
                <div className={classNames('grid gap-6 mt-6', { 'grid-cols-2': isPosition })}>
                    <div className={`flex flex-col justify-between ${isPosition ? 'space-y-6' : 'space-y-10'}`}>
                        <div className="space-y-6">
                            <div className="border border-divider dark:border-divider-dark p-4 rounded-md">
                                {isPosition && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                                {t('futures:mobile:close_all_positions:estimated_pnl')}
                                            </span>
                                            {loading ? (
                                                <Skeletor width={80} height={12} className="rounded-lg" />
                                            ) : (
                                                <span className={`font-semibold ${totalProfit < 0 ? 'text-red' : 'text-teal'}`}>
                                                    {totalProfit < 0 ? '' : '+'}
                                                    {formatNumber(totalProfit, decimals.symbol, 0, true)} {quoteAsset}
                                                </span>
                                            )}
                                        </div>
                                        <div className="h-[0.5px] bg-divider dark:bg-divider-dark w-full my-3"></div>
                                    </>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                        {t('futures:mobile:close_all_positions:estimated_time')}
                                    </span>
                                    {loading ? (
                                        <Skeletor width={80} height={12} className="rounded-lg" />
                                    ) : (
                                        <span className="font-semibold">{orders.length * 0.5}s</span>
                                    )}
                                </div>
                                <div className="h-[0.5px] bg-divider dark:bg-divider-dark w-full my-3"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                        {isPosition ? closeType?.label : t('futures:mobile:close_all_positions:estimated_orders')}
                                    </span>
                                    {loading ? (
                                        <Skeletor width={80} height={12} className="rounded-lg" />
                                    ) : (
                                        <span className="font-semibold">
                                            {orders.length} {t('futures:mobile:close_all_positions:orders')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div
                                className={`${
                                    isPosition ? 'px-6' : 'px-4'
                                } py-4 bg-gray-13 dark:bg-dark-4 rounded-md text-txtSecondary dark:text-txtSecondary-dark flex space-x-4`}
                            >
                                <BxsInfoCircle />
                                <span>{t('futures:mobile:close_all_positions:confirm_description')}</span>
                            </div>
                        </div>
                        <ButtonV2 disabled={closing || !orders.length || loading} loading={closing} onClick={onCloseAll}>
                            {t('common:confirm')}
                        </ButtonV2>
                    </div>
                    {isPosition && (
                        <div className="bg-gray-13 dark:bg-dark-4 rounded-xl py-4 relative">
                            <div className="font-semibold mb-6 px-4">{t('futures:mobile:close_all_positions:position_list')}</div>
                            <OrdersList loading={loading} orders={orders} marketWatch={marketWatch} decimals={decimals} calProfit={calProfit} />
                        </div>
                    )}
                </div>
            </ModalV2>
        </>
    );
};

export default FuturesCloseAllOrder;

const OrdersList = ({ orders, marketWatch, decimals, calProfit, loading }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const [showShareModal, setShowShareModal] = useState(false);
    const rowData = useRef(null);

    const onShareModal = (order) => {
        rowData.current = order;
        setShowShareModal(true);
    };

    if (loading) {
        return (
            <div className="max-h-[514px] overflow-auto px-4 divide-y divide-divider dark:divide-divider-dark">
                <div className="space-y-2 py-3 first:pt-0 last:pb-0">
                    <Skeletor width={200} height={12} className="rounded-lg" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Skeletor width={200} height={24} className="rounded-lg" />
                            <Skeletor width={200} height={16} className="rounded-lg" />
                        </div>
                        <div className="text-right">
                            <Skeletor width={30} height={24} className="rounded-lg" />
                            <Skeletor width={30} height={16} className="rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2 py-3 first:pt-0 last:pb-0">
                    <Skeletor width={200} height={12} className="rounded-lg" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Skeletor width={200} height={24} className="rounded-lg" />
                            <Skeletor width={200} height={16} className="rounded-lg" />
                        </div>
                        <div className="text-right">
                            <Skeletor width={30} height={24} className="rounded-lg" />
                            <Skeletor width={30} height={16} className="rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length <= 0) return <NoData className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full" />;

    return (
        <>
            <FututesShareModal
                order={rowData.current}
                isVisible={showShareModal}
                onClose={() => setShowShareModal(false)}
                decimals={decimals}
                pairTicker={marketWatch[rowData.current?.symbol]}
            />
            <div className="max-h-[514px] overflow-auto px-4 divide-y divide-divider dark:divide-divider-dark">
                {orders &&
                    Array.isArray(orders) &&
                    orders.length > 0 &&
                    orders?.map((order, i) => {
                        const isBuy = order?.side === VndcFutureOrderType.Side.BUY;
                        const pairTicker = marketWatch[order?.symbol];
                        const profit = getProfitVndc(order, isBuy ? pairTicker?.bid : pairTicker?.ask, true);
                        const percent = (profit / order?.margin) * 100;
                        calProfit({ [order?.displaying_id]: profit });
                        return (
                            <div key={i} className="space-y-2 py-3 first:pt-0 last:pb-0">
                                <div className="flex items-center space-x-1 text-xxs leading-3 text-txtSecondary dark:text-txtSecondary-dark py-1">
                                    <span>ID #{order?.displaying_id}</span>
                                    <span>•</span>
                                    <span>{formatTime(order?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="leading-6 space-x-2 flex items-center">
                                            <span className="font-semibold">{order?.symbol}</span>
                                            <span className="px-1 py-0.5 text-xs font-semibold bg-gray-11 dark:bg-dark-2 rounded-[3px]">
                                                {order?.leverage}x
                                            </span>
                                            <ShareIcon onClick={() => onShareModal(order)} className="cursor-pointer" color={isDark ? '#e2e8f0' : '#1e1e1e'} />
                                        </div>
                                        <div className={`flex items-center text-xs leading-4 ${isBuy ? 'text-teal' : 'text-red'}`}>
                                            <TypeTable type="side" data={order} />
                                            <span>&nbsp;/&nbsp;</span>
                                            <TypeTable type="type" data={order} />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`${profit < 0 ? 'text-red' : 'text-teal'} font-semibold`}>
                                            {profit < 0 ? '' : '+'}
                                            {formatNumber(profit, decimals.symbol, 0, true)}
                                        </span>
                                        <span className={`${percent < 0 ? 'text-red' : 'text-teal'} text-xs leading-4 flex items-center justify-end`}>
                                            <ChevronDown color={percent < 0 ? colors.red2 : colors.teal} className={`${percent >= 0 ? '!rotate-0' : ''}`} />
                                            {formatNumber(Math.abs(percent), 2, 0, true)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    );
};
