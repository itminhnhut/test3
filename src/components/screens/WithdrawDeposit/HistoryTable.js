import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import TabV2 from 'components/common/V2/TabV2';
import TableV2 from 'components/common/V2/TableV2';
import AssetLogo from 'components/wallet/AssetLogo';
import { getAssetCode, formatTime, formatNumber, formatNanNumber } from 'redux/actions/utils';
import Axios from 'axios';
import { TABS, data } from './constants';
import { API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import TextCopyable from 'components/screens/Account/TextCopyable';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import Skeletor from 'components/common/Skeletor';
import { find } from 'lodash';

const LIMIT_ROW = 10;

const getColumns = (t, user, side, configs) => [
    {
        key: 'displayingId',
        dataIndex: 'displayingId',
        title: t('common:transaction_id'),
        align: 'left',
        width: 150,
        fixed: 'left',
        render: (v) => <TextCopyable className="gap-x-1" showingText={v} text={v} />
    },
    {
        key: 'baseAssetId',
        dataIndex: 'baseAssetId',
        title: t('common:asset'),
        align: 'left',
        width: 148,
        render: (v) => {
            const assetConfig = find(configs, { id: v });

            return assetConfig ? (
                <div className="flex gap-2 items-center">
                    <AssetLogo assetCode={assetConfig?.assetCode} size={32} useNextImg />
                    <div>{assetConfig?.assetName || 'Unknown'}</div>
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    <Skeletor width={32} />
                    <Skeletor width={50} />
                </div>
            );
        }
    },
    {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: t('common:time'),
        align: 'left',
        width: 200,
        render: (v) => formatTime(v, 'HH:mm:ss dd/MM/yyyy')
    },
    {
        key: 'baseQty',
        dataIndex: 'baseQty',
        title: t('common:amount'),
        align: 'right',
        width: 140,
        render: (v, item) => `${side === SIDE.BUY ? '+' : '-'}${formatNanNumber(v, item?.baseAssetId === 72 ? 0 : 4)}`
    },
    {
        key: 'partnerMetadata',
        dataIndex: 'partnerMetadata',
        title: t('dw_partner:partner'),
        align: 'right',
        width: 189,
        render: (v) => (
            <>
                <div className="txtPri-2 mb-1">{v?.name}</div>
                <div className="txtSecond-3">{v?.code}</div>
            </>
        )
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: <span className="mr-[10px]">{t('common:status')}</span>,
        align: 'right',
        width: 185,
        render: (v) => <OrderStatusTag status={v} icon={false} />
    }
];

const HistoryTable = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();

    const configs = useSelector((state) => state.utils?.assetConfig);

    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    const [dataTable, setDataTable] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const [curSort, setCurSort] = useState({});
    const user = useSelector((state) => state.auth.user) || null;
    const { side } = router.query;

    const [loadingDataTable, setLoadingDataTable] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            setLoadingDataTable(true);

            Axios.get(API_GET_HISTORY_DW_PARTNERS, {
                params: {
                    page: currentPage,
                    pageSize: LIMIT_ROW,
                    lastId: dataTable[dataTable.length - 1]?._id ?? null,
                    mode: 'user',
                    side,
                    status: activeTab === 0 ? null : TABS[activeTab]?.status,
                    ...curSort
                }
            })
                .then(({ data: res }) => {
                    setHasNext(res.data?.hasNext);

                    if (res.status === ApiStatus.SUCCESS && res.data?.orders) {
                        setDataTable(res.data.orders);
                    } else {
                        setDataTable([]);
                    }
                })
                .catch((err) => {
                    setDataTable([]);
                })
                .finally(() => {
                    setLoadingDataTable(false);
                });
        };

        fetchData();
    }, [activeTab, currentPage, curSort]);

    useEffect(() => {
        setCurrentPage(0);
    }, [curSort]);

    const customSort = (tableSorted) => {
        const output = {};

        for (const key in tableSorted) {
            if (tableSorted.hasOwnProperty(key)) {
                output.sortBy = key;
                output.sortType = tableSorted[key] ? 1 : -1;
            }

            setCurSort(output);
        }
    };

    return (
        <div className="space-y-6">
            <div className="txtPri-3 ">{t('common:global_label.history')}</div>
            <TabV2
                activeTabKey={activeTab}
                onChangeTab={(key) => {
                    setActiveTab(key);
                    setCurrentPage(0);
                }}
                tabs={TABS.map((tab) => ({
                    key: tab.key,
                    children: <div>{t(tab.localized)}</div>
                }))}
            />
            <TableV2
                sort={['baseQty']}
                limit={LIMIT_ROW}
                skip={0}
                useRowHover
                data={dataTable}
                columns={getColumns(t, user, side, configs)}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                loading={loadingDataTable}
                onRowClick={(transaction) => router.push(PATHS.WITHDRAW_DEPOSIT.DETAIL + '/' + transaction.displayingId)}
                height={404}
                className="bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-lg pt-4"
                tableStyle={{
                    fontSize: '16px',
                    padding: '16px',
                    headerFontStyle: { 'font-size': `14px !important` }
                }}
                pagingPrevNext={{
                    page: currentPage,
                    hasNext: hasNext,
                    onChangeNextPrev: (e) => setCurrentPage((prevPage) => prevPage + e),
                    language
                }}
                emptyTextContent={t('common:no_data')}
                customSort={customSort}
            />
        </div>
    );
};

export default HistoryTable;
