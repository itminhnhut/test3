import { useState, useMemo, useEffect } from 'react';
import { useAsync } from 'react-use';
import { API_INTERNAL_TRANSFER_HISTORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { ApiStatus, PartnerOrderStatus } from 'redux/actions/const';
import { formatPrice, formatTime, getAssetCode, getLoginUrl, getS3Url, shortHashAddress } from 'redux/actions/utils';
import fetchApi from '../../../utils/fetch-api';
import { useSelector } from 'react-redux';
import TableV2 from 'components/common/V2/TableV2';
import AssetLogo from 'components/wallet/AssetLogo';
import { find, isArray } from 'lodash';
import Skeletor from 'components/common/Skeletor';
import OrderStatusTag from 'components/common/OrderStatusTag';

const addNewRecord = (arr = [], newItem = {}) => {
    arr.pop();      // Remove last item
    arr.unshift({...newItem, _id: 0});
    return arr
}

const TransferInternalHistory = ({ width, newOrder, setNewOrder }) => {
    const [state, set] = useState({
        page: 0,
        pageSize: LIMIT_ROW,
        loading: false,
        histories: null,
        hasNext: false
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const auth = useSelector((state) => state.auth?.user);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const {
        t,
        i18n: { language }
    } = useTranslation(['convert', 'common']);

    useEffect(() => {
        if (newOrder && state.page === 0) {
            setState({ histories: addNewRecord(state.histories ?? [], newOrder) });
        }
    }, [newOrder]);

    useAsync(async () => {
        if (!auth) return;
        setNewOrder(null);
        setState({ loading: true, histories: null });
        try {
            const {
                status,
                data: { orders: histories, hasNext }
            } = await fetchApi({
                url: API_INTERNAL_TRANSFER_HISTORY,
                options: { method: 'GET' },
                params: { page: state.page, pageSize: state.pageSize }
            });

            if (status === ApiStatus.SUCCESS && histories) {
                setState({ histories, hasNext });
            }
        } catch (e) {
            console.log(`Can't get swap history `, e);
        } finally {
            setState({ loading: false });
        }
    }, [state.page, state.pageSize, auth]);

    const onChangePagination = (delta) => {
        setState({ page: state.page + delta });
    };

    const columns = useMemo(
        () => [
            {
                key: '_id',
                dataIndex: '_id',
                title: 'ID',
                align: 'left',
                width: 203,
                render: (row) => row === 0 ? <Skeletor width={150}/> : <div title={row}>{shortHashAddress(row, 8, 6)}</div>
            },
            {
                key: 'asset',
                dataIndex: 'currency',
                title: t('transaction-history:asset'),
                align: 'left',
                width: 180,
                render: (row) => {
                    const assetCode = find(assetConfig, { id: +row })?.assetCode;
                    return (
                        <div className="flex items-center font-semibold">
                            {row && <AssetLogo assetId={row} size={32} />}
                            <div className="ml-2">{assetCode}</div>
                        </div>
                    );
                }
            },
            {
                key: 'created_at',
                title: t('transaction-history:time'),
                align: 'left',
                width: 230,
                render: (_row, item) => <div>{formatTime(item?.created_at || item?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
            },
            {
                key: 'amount',
                title: t('transaction-history:amount'),
                align: 'right',
                width: 150,
                render: (_row, item) => {
                    const config = assetConfig?.find((e) => e?.id === item?.currency);
                    return (
                        <div>
                            {formatPrice(item?.amount || item?.money_use || item?.value, config?.assetDigit ?? 0)}
                            {/* {config?.assetCode ?? 'VNDC'} */}
                        </div>
                    );
                }
            },
            {
                key: 'status',
                title: t('transaction-history:status'),
                align: 'right',
                width: 150,
                render: (row) =>  <OrderStatusTag status={row?._id ? PartnerOrderStatus.SUCCESS : PartnerOrderStatus.PENDING } />
            }
        ],
        [t, language, assetConfig]
    );

    return (
        <div className="m-auto mt-20">
            <div className="text-[24px] leading-[30px] font-semibold text-txtPrimary dark:text-txtPrimary-dark text-left">Lịch sử giao dịch</div>
            {auth ? (
                <div className="mt-8 pt-4 bg-white dark:bg-dark dark:border dark:border-divider-dark rounded-xl">
                    <TableV2
                        loading={state.loading}
                        useRowHover
                        data={state.histories || []}
                        columns={columns ?? []}
                        rowKey={(item) => `${item?.displayingId}`}
                        scroll={{ x: true }}
                        limit={LIMIT_ROW}
                        skip={0}
                        isSearch={!!state.search}
                        pagingClassName="border-none"
                        height={350}
                        pagingPrevNext={{ page: state.page, hasNext: state.hasNext, onChangeNextPrev: onChangePagination, language }}
                        tableStyle={{ fontSize: '16px', padding: '16px' }}
                    />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-[60px]">
                    <img src={getS3Url('/images/screen/swap/login-success.png')} alt="" className="mx-auto h-[124px] w-[124px]" />
                    <p className="!text-base text-txtSecondary dark:text-txtSecondary-dark mt-3">
                        <a href={getLoginUrl('sso')} className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4">
                            {t('common:sign_in')}{' '}
                        </a>
                        {t('common:or')}{' '}
                        <a
                            href={getLoginUrl('sso', 'register')}
                            className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4"
                        >
                            {t('common:sign_up')}{' '}
                        </a>
                        {t('common:swap_history')}
                    </p>
                </div>
            )}
        </div>
    );
};

const LIMIT_ROW = 5;

export default TransferInternalHistory;
