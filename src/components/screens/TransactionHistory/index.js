import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TabV2 from 'components/common/V2/TabV2/index';
import Link from 'next/link';
import { TransactionTabs, TRANSACTION_TYPES } from './constant';
import { useRouter } from 'next/router';
import TransactionFilter from './TransactionFilter';
import TableV2 from 'components/common/V2/TableV2';
import FetchApi from 'utils/fetch-api';
import { API_GET_COMMISSON_HISTORY, API_GET_WALLET_TRANSACTION_HISTORY, API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY, API_GET_WALLET_TRANSFER_HISTORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, formatPrice, formatTime, getAssetName } from 'redux/actions/utils';
import { SwapIcon } from 'components/svg/SvgIcon';
import { useSelector } from 'react-redux';
import { WALLET_SCREENS } from 'pages/wallet';
import { ApiStatus } from 'redux/actions/const';

const LIMIT = 10

const INITAL_FILTER = {
    page: 0,
    range: {
        startDate: null,
        endDate: Date.now(),
        key: 'selection'
    },
}

const namiSystem = {
    en: 'Nami system',
    vi: 'Hệ thống Nami'
}

const TransactionHistory = ({ id }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const hasNext = useRef(false)
    const [filter, setFilter] = useState(INITAL_FILTER);
    const changeFilter = (_filter) => setFilter((prevState) => ({ ...prevState, ..._filter }));

    const [categoryConfig, setCategoryConfig] = useState([]);
    useEffect(() => {
        FetchApi({
            url: API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY
        }).then(({ data, statusCode }) => {
            if (statusCode === 200) {
                console.log('data1', data);
                setCategoryConfig(data);
            }
        });
    }, []);

    const columns = useMemo(() => {
        return {
            _id: {
                key: '_id',
                dataIndex: '_id',
                title: 'ID',
                align: 'left',
                width: 160,
                render: (row) => <div title={row}>{row?.slice(0, 4) + '...' + row?.slice(row?.length - 5, row?.length)}</div>
            },
            asset: {
                key: 'asset',
                dataIndex: 'currency',
                title: 'Asset',
                align: 'left',
                width: 148,
                render: (row) => (
                    <div className="flex items-center gap-2">
                        <AssetLogo assetId={row} size={32} />
                        {getAssetName(row)}
                    </div>
                )
            },
            category: {
                key: 'category',
                dataIndex: 'category',
                title: 'Category',
                align: 'left',
                width: 168,
                render: (row) => <div>{categoryConfig?.find(e => e.category_id === row)?.content?.[language] ?? 'Unknown category'}</div>
            },
            convert_pair: {
                key: 'convert_pair',
                title: 'Convert pair',
                align: 'left',
                width: 180,
                render: (_row, item) => {
                    const fromAsset = item?.metadata?.fromAsset
                    const toAsset = item?.metadata?.toAsset

                    if (fromAsset && toAsset) {
                        return <div className='flex gap-2 items-center'>{fromAsset}<SwapIcon />{toAsset}</div>
                    } else {
                        return "_"
                    }
                }
            },
            created_at: {
                key: 'created_at',
                title: 'Time',
                align: 'left',
                width: 204,
                render: (_row, item) => <div>{formatTime(item?.created_at || item?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
            },
            fromAsset: {
                key: 'fromAsset',
                title: 'From',
                align: 'right',
                width: 188,
                render: (_row, item) => {
                    const isConvertToNami = item?.category === 129
                    if (isConvertToNami) {
                        return <div className='w-full flex justify-end'>
                            <div className='w-max border-b border-divider dark:border-divider-dark border-dashed cursor-pointer'>{t('wallet:crypto_list')}</div>
                        </div>
                    }

                    const fromAsset = item?.metadata?.fromAsset
                    const fromAssetId = item?.metadata?.fromAssetId
                    const value = item?.metadata?.fromQty
                    const decimal = assetConfig.find(e => e.id === fromAssetId)?.assetDigit ?? 0
                    if (value && fromAsset) {
                        return <div>{formatNumber(value, decimal)} {fromAsset}</div>
                    } else {
                        return "_"
                    }
                }
            },
            toAsset: {
                key: 'toAsset',
                title: 'To',
                align: 'right',
                width: 188,
                render: (_row, item) => {
                    const toAsset = item?.metadata?.toAsset
                    const toAssetId = item?.metadata?.toAssetId
                    const value = item?.metadata?.toQty
                    const decimal = assetConfig.find(e => e.id === toAssetId)?.assetDigit ?? 0
                    if (value && toAsset) {
                        return <div>{formatNumber(value, decimal)} {toAsset}</div>
                    } else {
                        return "_"
                    }
                }
            },
            convert_rate: {
                key: 'convert_rate',
                title: 'Convert Rate',
                align: 'right',
                width: 248,
                render: (_row, item) => {
                    const isConvertToNami = item?.category === 129
                    if (isConvertToNami) {
                        const value = item?.money_use
                        const decimal = assetConfig?.find(e => e.id === item?.currency)?.assetDigit ?? 0
                        return <div>{formatNumber(value, decimal)} NAMI</div>
                    }
                    const displayingPriceAsset = item?.metadata?.displayingPriceAsset

                    const fromAsset = item?.metadata?.fromAsset
                    const fromValue = item?.metadata?.fromQty

                    const toAsset = item?.metadata?.toAsset
                    const toValue = item?.metadata?.toQty

                    const baseAsset = fromAsset === displayingPriceAsset ? toAsset : fromAsset

                    const rate = fromAsset === displayingPriceAsset ? fromValue / toValue : toValue / fromValue
                    const decimal = assetConfig?.find(e => e.id === displayingPriceAsset)?.assetDigit ?? 0

                    if (fromAsset && toAsset) {
                        return <div>1 {baseAsset} = {formatNumber(rate, decimal)} {displayingPriceAsset}</div>
                    } else {
                        return "_"
                    }
                }
            },
            status: {
                key: 'status',
                title: 'Status',
                align: 'right',
                width: 148,
                render: () => <div className='w-full flex justify-end'>
                    <div className='px-4 py-1 rounded-[80px] bg-teal/10 text-green-2 dark:text-teal w-fit text-sm font-normal'>{t('common:success')}</div>
                </div>
            },
            fromWallet: {
                key: 'fromWallet',
                title: id === TRANSACTION_TYPES.COMMISSION ? 'From' : 'From wallet',
                align: id === TRANSACTION_TYPES.COMMISSION ? 'left' : 'right',
                width: 148,
                render: (_row, item) => item?.kind?.toLowerCase() === 'staking' ? namiSystem[language] : item?.fromUserId ?? renderWalletType(item?.from_wallet)
            },
            toWallet: {
                key: 'toWallet',
                dataIndex: 'to_wallet',
                title: 'To wallet',
                align: 'right',
                width: 148,
                render: (row) => renderWalletType(row)
            },
            wallet_type: {
                key: 'walletType',
                dataIndex: 'wallet_type',
                title: 'Wallet',
                align: 'left',
                width: 148,
                render: (row) => renderWalletType(row)
            },
            amount: {
                key: 'amount',
                title: 'Amount' + (id === TRANSACTION_TYPES.COMMISSION ? ' (VNDC)' : ''),
                align: 'right',
                width: 148,
                render: (_row, item) => {
                    const decimal = assetConfig?.find(e => e?.id === item?.currency)?.assetDigit ?? 0
                    return <div>{formatPrice(item?.amount || item?.money_use || item?.value, decimal)}</div>
                }
            },
            original_amount: {
                key: 'money_before',
                title: 'Original amount',
                align: 'right',
                width: 168,
                render: (_row, item) => {
                    const decimal = assetConfig?.find(e => e?.id === item?.currency)?.assetDigit ?? 0
                    return <div>{formatPrice(item?.money_before, decimal)}</div>
                }
            },
            commission_kind: {
                title: 'Commission',
                align: 'left',
                width: 148,
                render: (_row, item) => {
                    return <div className='capitalize'>{String(item?.kind).toLowerCase()}</div>
                }
            },
            commission_type: {
                title: 'Type',
                align: 'left',
                width: 128,
                render: (_row, item) => {
                    return <div className=''>{t('reference:referral.direct')}</div>
                }
            }
        };
    }, [t, categoryConfig]);

    const columnsConfig = {
        all: ['_id', 'category'],
        [TRANSACTION_TYPES.DEPOSIT]: ['_id', 'asset', 'category'],
        [TRANSACTION_TYPES.CONVERT]: ['category', '_id', 'convert_pair', 'created_at', 'fromAsset', 'toAsset', 'convert_rate', 'status'],
        [TRANSACTION_TYPES.TRANSFER]: ['category', 'asset', 'created_at', 'amount', 'fromWallet', 'toWallet', 'status'],
        [TRANSACTION_TYPES.STAKING]: ['_id', 'asset', 'created_at', 'amount', 'wallet_type', 'original_amount', 'status'],
        [TRANSACTION_TYPES.COMMISSION]: ['_id', 'created_at', 'amount', 'fromWallet', 'commission_kind', 'commission_type', 'status'],
    }

    const filterdColumns = useMemo(() => {
        return columnsConfig?.[id || 'all']?.map((key) => columns?.[key]) ?? [];
    }, [columns, id, columnsConfig]);

    useEffect(() => {
        setLoading(true)
        // custom type phai dat ben duoi [id] de overwrite lai
        // cac type deposit withdraw phai transform thanh depositwithdraw va phan biet bang isNegative
        const type = id?.length
            ? {
                  [id]: id,
                  all: null,
                  [TRANSACTION_TYPES.DEPOSIT]: TRANSACTION_TYPES.DEPOSITWITHDRAW,
                  [TRANSACTION_TYPES.WITHDRAW]: TRANSACTION_TYPES.DEPOSITWITHDRAW
              }[id]
            : null;
        const from = filter?.range?.startDate;
        const to = filter?.range?.endDate;

        // neu la withdraw hoac deposit thi se co gia tri isNegative, cac truong hop khac se undefined
        const isNegative = {
            deposit: false,
            withdraw: true
        }[id];

        const url = {
            [id]: API_GET_WALLET_TRANSACTION_HISTORY,
            [TRANSACTION_TYPES.TRANSFER]: API_GET_WALLET_TRANSFER_HISTORY,
            [TRANSACTION_TYPES.COMMISSION]: API_GET_COMMISSON_HISTORY,
        }[id]

        const params = {
            type,
            from,
            to,
            isNegative,
            limit: LIMIT,
            skip: filter?.page * LIMIT
        };

        FetchApi({
            url,
            params
        }).then(({ data, statusCode, status }) => {
            if (statusCode === 200 || status === ApiStatus.SUCCESS) {
                console.log('data', data)
                if (id === TRANSACTION_TYPES.TRANSFER) {
                    data?.result = data?.result.map(e => {
                        return {
                            ...e,
                            category: 48
                        }
                    })
                }
                hasNext.current = data?.hasNext
                setData(data?.result || data?.results)
            }
        }).finally(() => setLoading(false));

    }, [filter, id])

    const renderWalletType = useCallback((wallet_id) => {
        const wallet = WalletTypes?.find(e => e?.id === wallet_id)
        const content = wallet?.localized ? t('wallet:' + wallet?.localized) : wallet?.title
        return <div>{content}</div>
    }, [])

    return (
        <div className="min-h-[500px] max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl">
            <div className="mt-20 mb-[120px]">
                <div className="text-[32px] lead-[1.19] font-semibold mb-12">Lịch sử giao dịch</div>
                <div className="flex mb-8">
                    <TabV2
                        activeTabKey={id}
                        onChangeTab={(key) => {
                            const clickedTab = TransactionTabs.find((tab) => tab.key === key);
                            if (clickedTab) {
                                router.push(clickedTab.href);
                            }
                        }}
                        tabs={TransactionTabs.map((tab) => ({
                            key: tab.key,
                            children: <div className="capitalize">{tab.localized}</div>
                        }))}
                    />
                </div>
                <div className="mb-12">
                    <TransactionFilter language={language} categoryConfig={categoryConfig} filter={filter} setFilter={changeFilter} />
                </div>
                <div>
                    <TableV2
                        sort={['created_at']}
                        useRowHover
                        data={data}
                        columns={filterdColumns}
                        rowKey={(item) => item?.key}
                        scroll={{ x: true }}
                        loading={loading}
                        height={404}
                        className="border rounded-lg border-divider dark:border-divider-dark pt-4 mt-8"
                        tableStyle={{ fontSize: '16px', padding: '16px' }}
                        pagingPrevNext={{
                            page: filter?.page,
                            hasNext: hasNext.current,
                            onChangeNextPrev: (e) => changeFilter({ page: filter.page + e }),
                            language
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;

const WalletTypes = [{
    id: 0,
    code: WALLET_SCREENS.EXCHANGE,
    title: 'Exchange',
    localized: null
},
{
    id: 2,
    code: WALLET_SCREENS.FUTURES,
    title: 'Futures',
    localized: null
},
{
    key: 3,
    code: WALLET_SCREENS.PARTNERS,
    title: 'Partners',
    localized: 'common:partners'
}]
