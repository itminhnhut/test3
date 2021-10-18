import { useEffect, useMemo, useState } from 'react';

import DataTable from 'react-data-table-component';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { X } from 'react-feather';
import { API_GET_OPEN_ORDER } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum } from 'src/redux/actions/const';
import { formatBalance, formatTime } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import { tableStyle } from 'src/config/tables';
import { iconColor } from 'config/colors';
import showNotification from 'utils/notificationService';
import TableNoData from '../common/table/TableNoData';
import TableLoader from '../loader/TableLoader';

const SpotOrderList = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const { toggle } = props;
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector(state => state.socket.userSocket);
    const user = useSelector(state => state.auth.user);

    const { currentPair, filterByCurrentPair } = props;

    useEffect(() => {
        if (filterByCurrentPair) {
            const filter = orders.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
            setFilteredOrders(filter);
        } else {
            setFilteredOrders(orders);
        }
    }, [orders, currentPair, filterByCurrentPair]);

    const closeOrder = async (displayingId) => {
        const res = await fetchAPI({
            url: '/api/v3/spot/order',
            options: {
                method: 'DELETE',
            },
            params: {
                displayingId,
            },
        });
        const { status, data } = res;
        let message = '';
        if (status === ApiStatus.SUCCESS) {
            message = t('spot:close_order_success', {
                displayingId, side: data?.side, type: data?.type, token: `${data?.baseAsset}/${data?.quoteAsset}`,
            });
            showNotification({ message, title: 'Success', type: 'success' }, 'bottom', 'bottom-right');
        } else {
            showNotification({ message: t('spot:close_order_failed'), title: 'Failure', type: 'failure' }, 'bottom', 'bottom-right');
        }
    };
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
    const customStyles = {
        ...tableStyle,
        table: {
            style: {
                minHeight: loading ? 0 : '200px',
            },
        },
    };
    const columns = useMemo(() => [
        {
            name: t('common:order_id'),
            selector: 'displayingId',
            ignoreRowClick: true,
            omit: false,
            width: '80px',
        },
        {
            name: t('common:time'),
            selector: 'createdAt',
            ignoreRowClick: true,
            omit: false,
            minWidth: '140px',
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: t('common:pair'),
            selector: 'symbol',
            ignoreRowClick: true,
            minWidth: '120px',
        },
        {
            name: t('common:order_type'),
            selector: 'type',
            ignoreRowClick: true,
            minWidth: '100px',
        },
        {
            name: `${t('common:buy')}/${t('common:sell')}`,
            selector: 'side',
            ignoreRowClick: true,
            minWidth: '80px',
            conditionalCellStyles: [
                {
                    when: row => row.side === 'SELL',
                    style: {
                        color: '#E95F67 !important',
                    },
                },
                {
                    when: row => row.side === 'BUY',
                    style: {
                        color: '#09becf !important',
                    },
                }],
        },
        {
            name: t('common:order_price'),
            ignoreRowClick: true,
            right: true,
            cell: (row) => formatBalance(row.price, 6),
            minWidth: '110px',
        },
        {
            name: t('common:open_quantity'),
            ignoreRowClick: true,
            right: true,
            minWidth: '120px',
            cell: (row) => row.quantity,
        },
        {
            name: t('common:filled'),
            minWidth: '100px',
            right: true,
            cell: (row) => {
                return (
                    <span>
                        {formatBalance((row?.executedQty / row?.quantity) * 100, 2)}%
                    </span>
                );
            },
        },
        {
            name: '',
            ignoreRowClick: true,
            right: true,
            minWidth: '100px',
            // omit: !toggle,
            cell: (row) => (
                <button
                    className="flex items-center text-white bg-pink  px-3 py-1 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 whitespace-nowrap font-medium"
                    type="button"
                    onClick={() => closeOrder(row.displayingId)}
                >
                    <span>{t('common:cancel')}</span>
                </button>
            ),
        },

    ], [toggle]);

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_OPEN_ORDER,
            options: {
                method: 'GET',
            },
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
        <DataTable
            data={filteredOrders}
            columns={columns}
            customStyles={customStyles}
            className="h-full bg-bgContainer dark:bg-bgContainer-dark"
            noHeader
            fixedHeader
            fixedHeaderScrollHeight={`${props.orderListWrapperHeight - 184}px`}
            dense
            // pagination
            // paginationPerPage={100}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
            noDataComponent={<TableNoData />}
            progressPending={loading}
            progressComponent={<TableLoader height={props.height} />}
        />
    );
};

export default SpotOrderList;
