import findIndex from 'lodash/findIndex';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Emitter from 'redux/actions/emitter';
import AuthSelector from 'redux/selectors/authSelectors';
import { API_GET_HISTORY_ORDER } from 'src/redux/actions/apis';
import { ApiStatus, ExchangeOrderEnum, UserSocketEvent } from 'src/redux/actions/const';
import { formatSpotPrice, formatTime, formatWallet, TypeTable, formatNumber } from 'src/redux/actions/utils';
import fetchAPI, { useCancelToken } from 'utils/fetch-api';
import Link from 'next/link';
import TableV2 from '../common/V2/TableV2';
import PopoverV2 from '../common/V2/PopoverV2';
import ChevronDown from 'src/components/svg/ChevronDown';

const OrderHistory = (props) => {
    const { t } = useTranslation(['common', 'spot']);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const [histories, setHistories] = useState([]);
    const [filteredHistories, setFilteredHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const userSocket = useSelector((state) => state.socket.userSocket);
    const isAuth = useSelector(AuthSelector.isAuthSelector);
    const [status, setStatus] = useState('all');
    const popover = useRef(null);
    const { currentPair, filterByCurrentPair } = props;
    const [isOpen, setIsOpen] = useState(false);
    const cancelToken = useCancelToken();

    // Handle update order
    useEffect(() => {
        const event = UserSocketEvent.EXCHANGE_UPDATE_ORDER;
        Emitter.on(event, async (data) => {
            if (!data?.displayingId) return;
            if ([ExchangeOrderEnum.Status.CANCELED, ExchangeOrderEnum.Status.FILLED].includes(data?.status)) {
                const _orders = histories || [];
                const index = findIndex(_orders, { displayingId: data?.displayingId });
                if (index < 0) {
                    setHistories([data, ..._orders]);
                } else {
                    _orders[index] = data;
                    setHistories(_orders);
                }
            }
        });

        return function cleanup() {
            Emitter.off(event);
        };
    }, [isAuth, userSocket, histories]);

    useEffect(() => {
        if (filterByCurrentPair) {
            const filter = histories.filter((hist) => `${hist?.baseAsset}-${hist?.quoteAsset}` === currentPair);
            setFilteredHistories(filter);
        } else {
            setFilteredHistories(histories);
        }
    }, [histories, currentPair, filterByCurrentPair]);

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

    const renderStatus = () => {
        const arr = [
            { label: t('common:all'), value: 'all' },
            { label: t('common:filled'), value: ExchangeOrderEnum.Status.FILLED },
            { label: t('common:canceled'), value: ExchangeOrderEnum.Status.CANCELED }
        ];

        const label = arr.find((rs) => rs.value === status)?.label;
        console.log(isOpen);
        return (
            <PopoverV2
                ref={popover}
                label={
                    <div onClick={() => setIsOpen(!isOpen)} className="w-full space-x-2 flex items-center justify-center">
                        <span>{status === 'all' ? t('common:status') : label}</span>
                        <ChevronDown className={isOpen ? '!rotate-0' : ''} />
                    </div>
                }
                className="w-max py-4 text-xs !mt-6 z-20"
            >
                <div className="flex flex-col">
                    {arr.map((rs) => (
                        <div
                            key={rs.value}
                            onClick={() => {
                                setStatus(rs.value);
                                popover.current?.close();
                            }}
                            className={`px-4 py-2 dark:hover:bg-hover-dark ${status === rs.value ? 'text-white font-semibold' : ''}`}
                        >
                            {rs.label}
                        </div>
                    ))}
                </div>
            </PopoverV2>
        );
    };

    const columns = useMemo(
        () => [
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
                cell: (row) =>
                    currentPair !== `${row?.baseAsset}-${row?.quoteAsset}` ? (
                        <Link href={`/trade/${row?.baseAsset}-${row?.quoteAsset}`}>
                            <a className="dark:text-white text-darkBlue">{row?.symbol}</a>
                        </Link>
                    ) : (
                        row?.symbol
                    )
            },
            {
                key: 'type',
                title: t('common:order_type'),
                dataIndex: 'type',
                width: 120,
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
                key: 'avg_price',
                title: t('common:avg_price'),
                dataIndex: 'avg_price',
                align: 'right',
                width: 150,
                render: (v, row) => {
                    if (row?.executedQuoteQty && row?.executedQty) {
                        return formatSpotPrice(row?.executedQuoteQty / row?.executedQty, row?.symbol);
                    }
                    return 0;
                }
            },
            {
                key: 'quantity',
                title: t('common:quantity'),
                dataIndex: 'quantity',
                align: 'right',
                width: 150,
                render: (v) => formatNumber(v, 4)
            },
            {
                key: 'executedQty',
                title: t('common:filled'),
                dataIndex: 'executedQty',
                align: 'right',
                width: 150,
                render: (v, row) => <div>{formatWallet((row?.executedQty / row?.quantity) * 100, 0)}%</div>
            },
            {
                key: 'total',
                title: t('common:total'),
                dataIndex: 'executedQuoteQty',
                align: 'right',
                width: 150,
                render: (v) => formatNumber(v, 2)
            },
            {
                title: renderStatus(),
                key: 'status',
                dataIndex: 'status',
                align: 'center',
                width: 150,
                visible: histories.length > 0,
                fixed: 'right',
                render: (v) => {
                    switch (v) {
                        case ExchangeOrderEnum.Status.CANCELED:
                            return (
                                <span className="text-sm font-medium text-txtSecondary bg-divider-dark/[0.5] dark:text-txtSecondary-dark inline-block py-1 px-4 rounded-full">
                                    {t('common:canceled')}
                                </span>
                            );
                        case ExchangeOrderEnum.Status.FILLED:
                            return (
                                <span className="text-sm font-medium text-teal bg-teal/[0.1] rounded-full inline-block py-1 px-4">{t('common:filled')}</span>
                            );
                        default:
                            return null;
                    }
                }
            }
        ],
        [exchangeConfig, currentPair, status, isOpen, histories]
    );

    useEffect(
        () => () => {
            cancelToken.cancel();
        },
        []
    );

    const getOrderList = async () => {
        setLoading(true);
        try {
            const { status, data } = await fetchAPI({
                url: API_GET_HISTORY_ORDER,
                options: {
                    method: 'GET'
                },
                cancelToken: cancelToken.token
            });
            if (status === ApiStatus.SUCCESS) {
                setHistories(data);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrderList();
    }, []);

    const renderTable = useCallback(() => {
        let data = histories;
        if (filterByCurrentPair) {
            data = histories.filter((hist) => `${hist?.baseAsset}_${hist?.quoteAsset}` === currentPair);
        }
        if (status !== 'all') {
            data = data.filter((rs) => rs.status === status);
        }
        return (
            <TableV2
                useRowHover
                data={data}
                columns={columns}
                rowKey={(item) => `${item?.displayingId}`}
                loading={loading}
                scroll={{ x: true }}
                limit={10}
                skip={0}
                noBorder={!props.isPro || !data.length}
            />
        );
    }, [filteredHistories, isAuth, columns, loading, filterByCurrentPair, currentPair, props.orderListWrapperHeight, status]);

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

    // useEffect(() => {
    //     console.log('namidev-DEBUG: ____ ', filteredHistories)
    // }, [filteredHistories])

    return renderTable();
};

export default OrderHistory;
