import { useState, useMemo } from 'react';
import { useAsync } from 'react-use';
import { API_GET_SWAP_HISTORY, API_INTERNAL_TRANSFER_HISTORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { ApiStatus } from 'redux/actions/const';
import { formatPrice, formatTime, getAssetCode, getLoginUrl, getS3Url, shortHashAddress } from 'redux/actions/utils';
import { RETABLE_SORTBY } from 'src/components/common/ReTable';
import fetchApi from '../../../utils/fetch-api';
import Skeletor from 'src/components/common/Skeletor';
import { useSelector } from 'react-redux';
import TableV2 from 'components/common/V2/TableV2';
import { SwapIcon } from 'components/svg/SvgIcon';
import Link from 'next/link';
import AssetLogo from 'components/wallet/AssetLogo';
import { find } from 'lodash';

const columnsConfig = ['_id', 'asset', 'created_at', 'amount', 'status'];

const TransferInternalHistory = ({ width }) => {
    const [state, set] = useState({
        page: 0,
        pageSize: LIMIT_ROW,
        loading: false,
        histories: null
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const auth = useSelector((state) => state.auth?.user);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const {
        t,
        i18n: { language }
    } = useTranslation(['convert', 'common']);

    useAsync(async () => {
        if (!auth) return;
        setState({ loading: true, histories: null });
        try {
            const {
                status,
                data: { orders: histories }
            } = await fetchApi({
                url: API_INTERNAL_TRANSFER_HISTORY,
                options: { method: 'GET' },
                params: { page: state.page, pageSize: state.pageSize }
            });

            if (status === ApiStatus.SUCCESS && histories) {
                setState({ histories });
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
                render: (row) => <div title={row}>{shortHashAddress(row, 8, 6)}</div>
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
                            {row && <AssetLogo useNextImg={true} assetId={row} size={32} />}
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
                align: 'left',
                width: 150,
                render: () => (
                    <div className="w-full flex">
                        <div className="px-4 py-1 rounded-[80px] bg-teal/10 text-green-2 dark:text-teal w-fit text-sm font-normal">
                            {t('transaction-history:completed')}
                        </div>
                    </div>
                )
            }
        ],
        [t, language, assetConfig]
    );

    return (
        <div className="m-auto mt-20">
            <div className="text-[24px] leading-[30px] font-semibold text-txtPrimary dark:text-txtPrimary-dark text-left">{t('convert:history')}</div>
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
                        pagingPrevNext={{ page: state.page, hasNext: state.histories?.length, onChangeNextPrev: onChangePagination, language }}
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
