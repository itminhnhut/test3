import Delete from 'src/components/svg/Delete';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Emitter from 'redux/actions/emitter';
import { API_GET_OPEN_ORDER } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum, UserSocketEvent } from 'src/redux/actions/const';
import { formatBalance, formatTime, TypeTable } from 'src/redux/actions/utils';
import fetchAPI, { useCancelToken } from 'utils/fetch-api';
import showNotification from 'utils/notificationService';
import Link from 'next/link';
import { formatNumber } from 'redux/actions/utils';
import TableV2 from '../common/V2/TableV2';
import AlertModalV2 from '../common/V2/ModalV2/AlertModalV2';
import { Store } from 'react-notifications-component';

const SpotOrderList = (props) => {
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'spot']);
    const { toggle } = props;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector((state) => state.socket.userSocket);
    const user = useSelector((state) => state.auth.user);
    const { currentPair, filterByCurrentPair } = props;
    const [showCloseAll, setShowCloseAll] = useState(false);
    const [showSuccess, setshowSuccess] = useState(false);
    const alert = useRef({
        type: '',
        title: '',
        message: ''
    });
    const [loaded, setLoaded] = useState(false);
    const cancelToken = useCancelToken();

    useEffect(() => {
        if (filterByCurrentPair) {
            const filter = orders.filter((hist) => `${hist?.baseAsset}-${hist?.quoteAsset}` === currentPair);
            setFilteredOrders(filter);
        } else {
            setFilteredOrders(orders);
        }
    }, [orders, currentPair, filterByCurrentPair]);

    const closeOrder = async (order) => {
        if (loaded) return;
        try {
            setLoaded(true);
            const { displayingId, symbol } = order;
            const res = await fetchAPI({
                url: '/api/v3/spot/order',
                options: {
                    method: 'DELETE'
                },
                params: {
                    displayingId,
                    symbol
                }
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                alert.current = {
                    type: 'success',
                    title: t('common:success'),
                    message: t('spot:close_order_success', {
                        displayingId,
                        side: data?.side,
                        type: data?.type,
                        token: `${data?.baseAsset}/${data?.quoteAsset}`
                    })
                };
                // message = t('spot:close_order_success', {
                //     displayingId,
                //     side: data?.side,
                //     type: data?.type,
                //     token: `${data?.baseAsset}/${data?.quoteAsset}`
                // });
                // showNotification({ message, title: 'Success', type: 'success' }, null, 'bottom', 'bottom-right');
            } else {
                alert.current = {
                    type: 'error',
                    title: t('common:close_order'),
                    message: t('spot:close_order_failed', {
                        displayingId,
                        side: order?.side,
                        type: order?.type,
                        token: `${order?.baseAsset}/${order?.quoteAsset}`
                    })
                };
                // showNotification(
                //     {
                //         message: t('spot:close_order_failed', {
                //             displayingId,
                //             side: order?.side,
                //             type: order?.type,
                //             token: `${order?.baseAsset}/${order?.quoteAsset}`
                //         }),
                //         title: 'Failure',
                //         type: 'failure'
                //     },
                //     null,
                //     'bottom',
                //     'bottom-right'
                // );
            }
        } catch (error) {
        } finally {
            setLoaded(false);
            setshowSuccess(true);
        }
    };

    const onCloseAll = async () => {
        if (loaded) return;
        const orders = filteredOrders.map((rs) => ({ symbol: rs.symbol, displayingId: rs.displayingId }));
        try {
            setLoaded(true);
            const res = await fetchAPI({
                url: '/api/v3/spot/all_order',
                options: {
                    method: 'DELETE'
                },
                params: {
                    orders: orders,
                    allowNotification: true
                }
            });
            const { status } = res;
            if (status === ApiStatus.SUCCESS) {
                alert.current = {
                    type: 'success',
                    title: t('common:success'),
                    message: t('common:close_all_success')
                };
            } else {
                alert.current = {
                    type: 'error',
                    title: t('common:failed'),
                    message: t('common:close_all_failed')
                };
            }
        } catch (error) {
        } finally {
            setShowCloseAll(false);
            setLoaded(false);
            setshowSuccess(true);
        }
    };

    const updateOrder = (data) => {
        if (data?.displayingId) {
            if ([ExchangeOrderEnum.Status.NEW, ExchangeOrderEnum.Status.PARTIALLY_FILLED].includes(data?.status)) {
                let _orders = orders || [];
                const index = findIndex(_orders, { displayingId: data?.displayingId });
                if (index < 0) {
                    _orders = [data, ..._orders];
                    setOrders(_orders);
                } else {
                    _orders[index] = data;
                    setOrders(_orders);
                }
            } else {
                let _orders = orders || [];
                if (_orders.length) {
                    _orders = filter(_orders, (o) => {
                        return +o.displayingId !== +data?.displayingId;
                    });
                    setOrders(_orders);
                }
            }
        }
    };
    // Handle update order
    useEffect(() => {
        const event = UserSocketEvent.EXCHANGE_UPDATE_ORDER;
        Emitter.on(event, async (data) => {
            updateOrder(data);
        });

        return function cleanup() {
            Emitter.off(event);
        };
    }, [user, userSocket, orders]);

    useEffect(() => {
        if (userSocket) {
            const event = 'exchange:update_opening_order';
            userSocket.removeListener(event, setOrders);
            userSocket.on(event, setOrders);
        }
        return function cleanup() {
            if (userSocket) {
                const event = 'exchange:update_opening_order';
                userSocket.removeListener(event, setOrders);
            }
        };
    }, [userSocket]);

    const columns = useMemo(() => {
        const init = [
            {
                key: 'displayingId',
                title: t('common:order_id'),
                dataIndex: 'displayingId',
                width: 120
            },
            {
                key: 'createdAt',
                title: t('common:time'),
                dataIndex: 'createdAt',
                width: 180,
                render: (v) => <span>{formatTime(v, 'HH:mm:ss dd/MM/yyyy')}</span>
            },
            {
                key: 'symbol',
                title: t('common:pair'),
                dataIndex: 'symbol',
                width: 150,
                render: (v, row) =>
                    currentPair !== `${row?.baseAsset}-${row?.quoteAsset}` ? (
                        <Link href={`/trade/${row?.baseAsset}-${row?.quoteAsset}`}>
                            <a className="dark:text-white text-darkBlue">{`${row?.baseAsset}/${row?.quoteAsset}`}</a>
                        </Link>
                    ) : (
                        `${row?.baseAsset}/${row?.quoteAsset}`
                    )
            },
            {
                key: 'type',
                title: t('common:order_type'),
                dataIndex: 'type',
                width: 150,
                render: (v, row) => <TypeTable type={'type'} data={row} />
            },
            {
                key: 'side',
                title: `${t('common:buy')}/${t('common:sell')}`,
                dataIndex: 'side',
                width: 100,
                render: (v, row) => <TypeTable type={'side'} data={row} />
            },
            {
                key: 'order_price',
                title: t('common:order_price'),
                width: 150,
                align: 'right',
                render: (row) => formatBalance(row.price, 6)
            },
            {
                key: 'open_quantity',
                title: t('common:open_quantity'),
                width: 150,
                align: 'right',
                render: (row) => formatNumber(row.quantity)
            },
            {
                key: 'filled',
                title: t('common:filled'),
                align: 'right',
                width: 100,
                render: (row) => {
                    return <span>{formatBalance((row?.executedQty / row?.quantity) * 100, 2)}%</span>;
                }
            }
        ];
        if (filteredOrders.length > 0)
            init.push({
                key: 'actions',
                title: (
                    <span
                        onClick={() => {
                            if (filteredOrders.length) {
                                Store.removeAllNotifications();
                                setShowCloseAll(true);
                            }
                        }}
                        className="dark:bg-dark-2 px-4 py-2 rounded-md cursor-pointer font-semibold"
                    >
                        {t('common:close_all_orders')}
                    </span>
                ),
                fixed: 'right',
                align: 'center',
                width: 180,
                className: filteredOrders.length > 0 ? '' : 'invisible',
                render: (row) => (
                    <Delete
                        className="cursor-pointer flex m-auto w-full"
                        onClick={() => {
                            closeOrder(row);
                        }}
                    />
                )
            });
        return init;
    }, [toggle, currentPair, showCloseAll, loaded, filteredOrders]);

    useEffect(
        () => () => {
            cancelToken.cancel();
        },
        []
    );

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_OPEN_ORDER,
            options: {
                method: 'GET'
            },
            cancelToken: cancelToken.token
        });
        if (status === ApiStatus.SUCCESS) {
            setOrders(data.orders);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) getOrderList();
    }, [user]);

    return (
        <>
            <AlertModalV2
                isVisible={showCloseAll}
                onClose={() => setShowCloseAll(false)}
                type="warning"
                title={t('common:close_all_orders')}
                message={t('common:close_all_message')}
                textButton={t('common:confirm')}
                onConfirm={onCloseAll}
                loading={loaded}
            />
            <AlertModalV2
                isVisible={showSuccess}
                onClose={() => setshowSuccess(false)}
                type={alert.current.type}
                title={alert.current.title}
                message={alert.current.message}
            />
            <TableV2
                defaultSort={{ key: 'createdAt', direction: 'desc' }}
                useRowHover
                data={filteredOrders}
                columns={columns}
                rowKey={(item) => `${item?.displayingId}`}
                loading={loading}
                limit={10}
                skip={0}
            />
        </>
    );
};

export default SpotOrderList;
