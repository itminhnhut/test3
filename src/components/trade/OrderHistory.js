import { useCallback, useEffect, useMemo, useState } from 'react'

import DataTable from 'react-data-table-component';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { API_GET_HISTORY_TRADE } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum } from 'src/redux/actions/const';
import { formatSpotPrice, formatTime, formatWallet } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import { tableStyle } from 'config/tables';
import AuthSelector from 'redux/selectors/authSelectors';
import { useRouter } from 'next/router';
import TableNoData from '../common/table/TableNoData';
import TableLoader from '../loader/TableLoader';

const OrderHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const [histories, setHistories] = useState([]);
    const [filteredHistories, setFilteredHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector(state => state.socket.userSocket);
    const isAuth = useSelector(AuthSelector.isAuthSelector);

    const { currentPair, filterByCurrentPair } = props;

    const customStyles = {
        ...tableStyle,
        table: {
            style: {
                height: '100%',
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
            name: t('common:avg_price'),
            ignoreRowClick: true,
            right: true,

            cell: (row) => {
                if (row?.executedQuoteQty && row?.executedQty) {
                    return formatSpotPrice(row?.executedQuoteQty / row?.executedQty, row?.symbol);
                }
                return 0;
            },
            minWidth: '120px',
        },
        {
            name: t('common:quantity'),
            ignoreRowClick: true,
            right: true,
            minWidth: '120px',
            cell: (row) => formatWallet(row.quantity, 4),
        },
        {
            name: t('common:filled'),
            ignoreRowClick: true,
            minWidth: '100px',
            right: true,
            cell: (row) => <div>{formatWallet((row?.executedQty / row?.quantity) * 100, 0)}%</div>,
        },
        {
            name: t('common:total'),
            selector: 'total',
            minWidth: '120px',
            right: true,
            cell: (row) => formatWallet(row.executedQuoteQty, 2),
        },
        {
            name: t('common:status'),
            selector: 'status',
            minWidth: '120px',
            right: true,
            cell: (row) => {
                switch (row.status) {
                    case ExchangeOrderEnum.Status.CANCELED:
                        return (
                            <span
                                className="text-xs font-semibold inline-block py-1 px-2 rounded text-black last:mr-0 mr-1"
                            >
                                {t('common:canceled')}
                            </span>
                        );
                    case ExchangeOrderEnum.Status.FILLED:
                        return (
                            <span
                                className="text-xs font-semibold inline-block py-1 px-2 rounded text-mint last:mr-0 mr-1"
                            >
                                {t('common:filled')}
                            </span>
                        );
                    default:
                        return null;
                }
            },
        },

    ], [exchangeConfig]);

    const getOrderList = async () => {
        setLoading(true);
        const { status, data } = await fetchAPI({
            url: API_GET_HISTORY_TRADE,
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setHistories(data);
            setLoading(false);
        }
    };

    const renderTable = useCallback(() => {
        if (!isAuth || !histories.length) return <TableNoData />
        let data = histories
        if (filterByCurrentPair) {
            data = histories.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair)
        }

        return (
            <DataTable
                data={data}
                columns={columns}
                customStyles={customStyles}
                className="h-full"
                noHeader
                fixedHeader
                fixedHeaderScrollHeight={`${props.orderListWrapperHeight - 184}px`}
                overflowYOffset={100}
                pagination
                paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
                dense
                noDataComponent={<TableNoData />}
                progressPending={loading}
                progressComponent={<TableLoader height={props.height} />}
                paginationPerPage={50}
                paginationComponentOptions={{ rowsPerPageText: 'Rows:', rangeSeparatorText: '/', noRowsPerPage: false }}
                paginationIconFirstPage={null}
                paginationIconLastPage={null}
            />
        )
    }, [filteredHistories, isAuth, columns, customStyles, loading, filterByCurrentPair, currentPair, props.orderListWrapperHeight])

    useEffect(() => {
        getOrderList();
    }, []);

    // useEffect(() => {
    //     if (filterByCurrentPair) {
    //         const filter = histories.filter(hist => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
    //         setFilteredHistories(filter);
    //     } else {
    //         setFilteredHistories(histories);
    //     }
    // }, [histories, currentPair, filterByCurrentPair]);

    useEffect(() => {
        if (userSocket) {
            const event = 'exchange:update_history_order';
            userSocket.removeListener(event, setHistories);
            userSocket.on(event, setHistories);
        }

        return function cleanup() {
            if (userSocket) {
                const event = 'exchange:update_history_order';
                userSocket.removeListener(event, setHistories);
            }
        };
    }, [userSocket]);

    useEffect(() => {
        console.log('namidev-DEBUG: ____ ', filteredHistories)
    }, [filteredHistories])


    return renderTable()
};

export default OrderHistory;
