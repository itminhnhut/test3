import React, { useEffect, useMemo, useRef, useState } from 'react';
import TabV2 from 'components/common/V2/TabV2/index';
import { TransactionTabs, TRANSACTION_TYPES, INITAL_FILTER } from './constant';
import { useRouter } from 'next/router';
import TransactionFilter from './TransactionFilter';
import TableV2 from 'components/common/V2/TableV2';
import FetchApi from 'utils/fetch-api';
import { API_GET_WALLET_TRANSACTION_HISTORY, API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import AssetLogo from 'components/wallet/AssetLogo';
import { formatPrice, formatTime, getAssetCode, shortHashAddress } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { WALLET_SCREENS } from 'pages/wallet';
import { ApiStatus } from 'redux/actions/const';
import ModalHistory from './ModalHistory';
import axios from 'axios';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
import { isNull } from 'lodash';
import usePrevious from 'hooks/usePrevious';
import { formatLocalTimezoneToUTC } from 'utils/helpers';

const LIMIT = 10;

const namiSystem = {
    en: 'Nami system',
    vi: 'Hệ thống Nami'
};

export const isFilterEmpty = (filter) => !filter.category && !filter.asset && isNull(filter.range.endDate);

const columnsConfig = ['_id', 'asset', 'created_at', 'amount', 'category', 'status'];

const TransactionHistory = ({ id }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const hasNext = useRef(false);
    const [detailId, setDetailId] = useState(null);
    const [filter, setFilter] = useState(INITAL_FILTER);
    const [currentPage, setCurrentPage] = useState(0);
    const [categoryConfig, setCategoryConfig] = useState([]);

    const previousId = usePrevious(id);

    const changeFilter = (_filter) => {
        setFilter((prevState) => ({ ...prevState, ..._filter }));
        setCurrentPage(0);
    };
    const resetFilter = () => {
        setFilter(INITAL_FILTER);
        setCurrentPage(0);
    };

    const onChangeTab = (key) => {
        const clickedTab = TransactionTabs.find((tab) => tab.key === key);
        if (clickedTab.key !== 'all' && !isFilterEmpty(filter)) resetFilter();
        if (clickedTab) {
            router.push(clickedTab.href);
        }
    };

    useEffect(() => {
        FetchApi({
            url: API_GET_WALLET_TRANSACTION_HISTORY_CATEGORY
        }).then(({ data, statusCode }) => {
            if (statusCode === 200) {
                setCategoryConfig(data);
            }
        });
    }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();
        let mounted = false;
        const fetchTransactionHistory = async () => {
            const { range, asset, category } = filter;
            const { startDate, endDate } = range;

            const from = startDate && formatLocalTimezoneToUTC(startDate.getTime());

            // Plus 1 more day on endDate if endDate !== null
            const to = formatLocalTimezoneToUTC(!endDate ? new Date().getTime() : endDate.getTime());

            // custom type phai dat ben duoi [id] de overwrite lai
            // cac type deposit withdraw phai transform thanh depositwithdraw va phan biet bang isNegative
            const type = {
                [id]: id,
                all: null,
                [TRANSACTION_TYPES.DEPOSIT]: TRANSACTION_TYPES.DEPOSITWITHDRAW,
                [TRANSACTION_TYPES.WITHDRAW]: TRANSACTION_TYPES.DEPOSITWITHDRAW
            }[id];

            // neu la withdraw hoac deposit thi se co gia tri isNegative, cac truong hop khac se undefined
            const isNegative = {
                deposit: false,
                withdraw: true
            }[id];

            // only 'all' tab is able to filter
            if (!isFilterEmpty(filter) && id !== 'all') {
                router.push('all');
                return;
            }
            // set currentPage to 0 when change tab
            if (previousId !== id) {
                setCurrentPage(0);
                return;
            }

            const params = {
                type,
                from,
                to,
                isNegative,
                limit: LIMIT,
                skip: currentPage * LIMIT,
                category: category?.category_id || undefined,
                currency: asset?.id || undefined
            };
            try {
                setLoading(true);
                hasNext.current = false;
                const { data, statusCode, status } = await FetchApi({
                    url: API_GET_WALLET_TRANSACTION_HISTORY,
                    params,
                    cancelToken: source.token
                });
                let result = data?.result || data?.results;
                if (statusCode === 200 || status === ApiStatus.SUCCESS) {
                    if (id === TRANSACTION_TYPES.TRANSFER) {
                        result = data?.result.map((e) => {
                            return {
                                ...e,
                                category: 48
                            };
                        });
                    }
                }
                hasNext.current = data?.hasNext;
                setData(result);
                setLoading(false);
            } catch (error) {
                console.log('fetching API_GET_WALLET_TRANSACTION_HISTORY error:', error);
            } finally {
                if (mounted) {
                    setLoading(true);
                    hasNext.current = false;
                } else setLoading(false);
            }
        };

        fetchTransactionHistory();

        return () => {
            mounted = true;
            source.cancel();
        };
    }, [filter, id, currentPage, previousId]);

    const columns = useMemo(() => {
        return {
            _id: {
                key: '_id',
                dataIndex: '_id',
                title: 'ID',
                align: 'left',
                width: 203,
                render: (row) => <div title={row}>{shortHashAddress(row, 8, 6)}</div>
            },
            asset: {
                key: 'asset',
                dataIndex: 'currency',
                title: t('transaction-history:asset'),
                align: 'left',
                width: 180,
                render: (row) => (
                    <div className="flex items-center font-semibold">
                        {row && <AssetLogo useNextImg={true} assetId={row} size={32} />}
                        <div className="ml-2"> {getAssetCode(row)}</div>
                    </div>
                )
            },
            created_at: {
                key: 'created_at',
                title: t('transaction-history:time'),
                align: 'left',
                width: 230,
                render: (_row, item) => <div>{formatTime(item?.created_at || item?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
            },

            amount: {
                key: 'amount',
                title: t('transaction-history:amount') + (id === TRANSACTION_TYPES.COMMISSION ? ' (VNDC)' : ''),
                align: 'right',
                width: 241,
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
            category: {
                key: 'category',
                dataIndex: 'category',
                title: t('transaction-history:category'),
                align: 'left',
                width: 208,
                render: (row) => <div>{categoryConfig?.find((e) => e.category_id === row)?.content?.[language] ?? 'Unknown category'}</div>
            },

            status: {
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
        };
    }, [t, language, categoryConfig, assetConfig, id]);

    return (
        <>
            <div className="min-h-[500px] max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl">
                <div className="mt-20 mb-[120px]">
                    <div className="text-[32px] lead-[1.19] font-semibold mb-12">{t('transaction-history:title')}</div>
                    <div className="mb-8">
                        <TransactionFilter
                            language={language}
                            categoryConfig={categoryConfig}
                            filter={filter}
                            resetFilter={resetFilter}
                            setFilter={changeFilter}
                            t={t}
                        />
                    </div>
                    <div className="flex mb-12 ">
                        <TabV2
                            activeTabKey={id}
                            onChangeTab={onChangeTab}
                            tabs={TransactionTabs.map((tab) => ({
                                key: tab.key,
                                children: <div className="capitalize">{t('transaction-history:tab.' + tab.localized)}</div>
                            }))}
                        />
                    </div>

                    <div className="mb-4 inline-flex items-center bg-hover-1 dark:bg-darkBlue-3 rounded-xl p-4">
                        <BxsInfoCircle size={16} />
                        <div className="ml-2 text-txtSecondary dark:text-txtSecondary-dark">{t('transaction-history:click_on_transaction')}</div>
                    </div>
                    <TableV2
                        sort={['created_at']}
                        useRowHover
                        data={data}
                        columns={columnsConfig.map((key) => columns?.[key]) ?? []}
                        rowKey={(item) => item?.key}
                        scroll={{ x: true }}
                        loading={loading}
                        onRowClick={(transaction) => {
                            setDetailId(transaction._id);
                        }}
                        height={404}
                        className="border rounded-lg border-divider dark:border-divider-dark pt-4 mt-8"
                        tableStyle={{ fontSize: '16px', padding: '16px' }}
                        pagingPrevNext={{
                            page: currentPage,
                            hasNext: hasNext.current,
                            onChangeNextPrev: (e) => setCurrentPage((prevPage) => prevPage + e),
                            language
                        }}
                        emptyTextContent={t('transaction-history:no_transaction_history')}
                    />
                </div>
            </div>

            <ModalHistory
                onClose={() => setDetailId(null)}
                isVisible={!!detailId}
                id={detailId}
                t={t}
                assetConfig={assetConfig}
                language={language}
                categoryConfig={categoryConfig}
            />
        </>
    );
};

export default TransactionHistory;

const WalletTypes = [
    {
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
    }
];
