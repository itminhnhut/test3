import React, { useEffect, useRef, useState } from 'react';
import FilterButton from '../components/FilterButton';
import { formatBalance, formatNumber, formatTime, getAssetCode } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TableV2 from 'components/common/V2/TableV2';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ApiStatus, PartnerOrderStatus, UserSocketEvent } from 'redux/actions/const';
import { isNull } from 'lodash';
import FetchApi from 'utils/fetch-api';
import { API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import TagV2 from 'components/common/V2/TagV2';
import TextCopyable from 'components/screens/Account/TextCopyable';
import AssetLogo from 'components/wallet/AssetLogo';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import { formatLocalTimezoneToUTC } from 'utils/helpers';
import axios from 'axios';
import { useBoolean } from 'react-use';
import { useSelector } from 'react-redux';

const getColumns = ({ t }) => [
    {
        key: 'side',
        dataIndex: 'side',
        title: 'Loại lệnh',
        align: 'center',
        width: 107,
        render: (row) => (
            <div className="flex justify-center">
                <TagV2 type={row === SIDE.BUY ? 'success' : 'failed'} icon={false}>
                    {t(`common:${row}`)}
                </TagV2>
            </div>
        )
    },
    {
        key: 'displayingId',
        dataIndex: 'displayingId',
        title: t('common:transaction_id'),
        align: 'left',
        width: 124,
        render: (row) => <TextCopyable text={row} />
    },
    {
        key: 'baseAssetId',
        dataIndex: 'baseAssetId',
        title: t('common:asset'),
        align: 'left',
        width: 148,
        render: (row) => {
            const assetCode = getAssetCode(+row);
            return (
                <div className="flex gap-2 items-center">
                    <AssetLogo assetCode={assetCode} size={32} useNextImg /> <div>{assetCode}</div>
                </div>
            );
        }
    },
    {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: t('common:time'),
        align: 'left',
        width: 196,
        render: (row) => {
            return formatTime(row, 'HH:mm:ss dd/MM/yyyy');
        }
    },
    {
        key: 'baseQty',
        dataIndex: 'baseQty',
        title: t('common:amount'),
        align: 'right',
        width: 152,
        render: (row, item) => {
            return (item.side === SIDE.BUY ? '+' : '-') + formatBalance(row);
        }
    },
    {
        key: 'commission',
        dataIndex: 'commission',
        title: 'Hoa hồng',
        align: 'right',
        width: 152,
        render: (row, item) => {
            return <div className="text-teal">{!row ? 0 : formatNumber(row, 4)}</div>;
        }
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: t('common:status'),
        align: 'right',
        width: 165,
        render: (row) => {
            let className = '',
                text = '';
            switch (row) {
                case PartnerOrderStatus.PENDING:
                    text = t('common:processing');
                    className = 'text-yellow-2';
                    break;
                case PartnerOrderStatus.REJECTED:
                    text = t('common:denined');
                    className = 'text-red';

                    break;
                case PartnerOrderStatus.SUCCESS:
                    text = t('common:success');
                    className = 'text-teal';
                    break;
                case PartnerOrderStatus.DISPUTED:
                    text = t('common:disputing');
                    className = 'text-red';

                    break;
                default:
                    break;
            }
            return <div className={className}>{text}</div>;
        }
    }
];

const LIMIT_ROW = 10;
const INITIAL_PARAMS = {
    page: 0,
    mode: 'partner',
    pageSize: LIMIT_ROW,
    displayingId: '',
    status: null,
    assetId: null,
    side: null,
    from: null,
    to: null,
    sortBy: null,
    sortType: null
};

const HistoryOrders = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();

    const userSocket = useSelector((state) => state.socket.userSocket);

    const [state, set] = useState({
        data: [],
        params: INITIAL_PARAMS,
        loading: false,
        hasNext: false
    });
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));
    const resetFilter = () => setState({ params: INITIAL_PARAMS });
    const isResetAble = () => {
        const {
            params: { status, assetId, side, from, to, displayingId }
        } = state;
        if (isNull(status) && isNull(from) && isNull(to) && !assetId && !side && !displayingId) return false;
        return true;
    };
    const [refetch, toggleRefetch] = useBoolean(false);

    const dataRef = useRef([]);
    const currentParamsRef = useRef(null);
    dataRef.current = [...state.data];
    currentParamsRef.current = { ...state.params };

    // useEffect(() => {
    //     if (userSocket) {
    //         userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER, (newOrder) => {
    //             if (dataRef.current.length) {
    //                 const { assetId, side, status } = currentParamsRef.current;
    //                 const existedOrder = dataRef.current.find((order) => order.displayingId === newOrder.displayingId);
    //                 // if newOrder is not in the current data sets with -> refetch table
    //                 if (
    //                     !existedOrder &&
    //                     side &&
    //                     newOrder?.side === side &&
    //                     assetId &&
    //                     newOrder?.baseAssetId === assetId &&
    //                     status &&
    //                     newOrder?.status === status
    //                 ) {
    //                     toggleRefetch();
    //                 }
    //             }
    //             toggleRefetch();
    //         });
    //     }
    //     return () => {
    //         if (userSocket) {
    //             userSocket.removeListener(UserSocketEvent.PARTNER_UPDATE_ORDER, (data) => {
    //                 console.log('socket removeListener PARTNER_UPDATE_ORDER:', data);
    //             });
    //         }
    //     };
    // }, [userSocket]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        let mounted = false;
        const fetchOrders = async () => {
            setState({ loading: true });
            try {
                const { from, to } = state.params;
                const startDate = from && formatLocalTimezoneToUTC(from);
                const endDate = to && formatLocalTimezoneToUTC(to + 86400 * 1000);
                const { data, status } = await FetchApi({
                    url: API_GET_HISTORY_DW_PARTNERS,
                    params: {
                        ...state.params,
                        from: startDate,
                        to: endDate
                    },
                    cancelToken: source.token
                });

                let hasNext = false,
                    orders = [];
                if (status === ApiStatus.SUCCESS) {
                    orders = data.orders;
                    hasNext = data.hasNext;
                }
                setState({
                    data: orders,
                    hasNext
                });
            } catch (error) {
            } finally {
                if (mounted) {
                    setState({ loading: true, hasNext: false });
                } else setState({ loading: false });
            }
        };
        fetchOrders();
        return () => {
            mounted = true;
            source.cancel();
        };
    }, [state.params, refetch]);

    const customSort = (tableSorted) => {
        const output = {};

        for (const key in tableSorted) {
            if (tableSorted.hasOwnProperty(key)) {
                output.sortBy = key;
                output.sortType = tableSorted[key] ? 1 : -1;
            }
        }
        setState({
            params: {
                ...state.params,
                ...output
            }
        });
    };

    const onChangeFilter = (addFilters) =>
        set((prev) => ({
            ...prev,
            params: {
                ...prev.params,
                ...addFilters,
                page: 0
            }
        }));

    return (
        <div className="bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-lg ">
            <div className="mx-6 my-8">
                <div className="text-2xl font-semibold mb-8 ">{t('dw_partner:order_history')}</div>
                <FilterButton t={t} setFilter={onChangeFilter} filter={state.params} resetFilter={resetFilter} isResetAble={isResetAble()} />
            </div>

            <TableV2
                sort={state.data.length > 1 ? ['baseQty', 'createdAt'] : []}
                limit={LIMIT_ROW}
                skip={0}
                useRowHover
                data={state.data}
                columns={getColumns({ t })}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                loading={state.loading}
                onRowClick={(transaction) => router.push(PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS + '/' + transaction.displayingId)}
                height={600}
                className="bg-white dark:bg-transparent rounded-lg"
                tableStyle={{
                    fontSize: '16px',
                    padding: '16px',
                    headerFontStyle: { 'font-size': `14px !important` }
                }}
                pagingPrevNext={{
                    page: state.params.page,
                    hasNext: state.hasNext,
                    onChangeNextPrev: (e) =>
                        setState({
                            params: {
                                ...state.params,
                                page: state.params.page + e
                            }
                        }),
                    language
                }}
                emptyTextContent={t('common:no_data')}
                customSort={customSort}
            />
        </div>
    );
};

export default HistoryOrders;
