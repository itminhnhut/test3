import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import TabV2 from 'components/common/V2/TabV2';
import TableV2 from 'components/common/V2/TableV2';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import AssetLogo from 'components/wallet/AssetLogo';
import { shortHashAddress, getAssetCode, formatTime, formatNumber } from 'redux/actions/utils';
import Axios from 'axios';
import { TABS, data } from './constants';
import { API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import TextCopyable from 'components/screens/Account/TextCopyable';

const LIMIT_ROW = 10;

const getColumns = (t, user) => [
    {
        key: '_id',
        dataIndex: '_id',
        title: t('common:transaction_id'),
        align: 'center',
        width: 150,
        fixed: 'left',
        render: (v) => (
            // <div className="flex items-center gap-x-2">
            //     <span>{shortHashAddress(v, 8, 6)}</span>
            //     <CopyIcon data={v} size={16} className="cursor-pointer" />
            // </div>
            <TextCopyable className="gap-x-1" showingText={v ? `${shortHashAddress(v, 3, 4)}` : undefined} text={v} />
        )
    },
    {
        key: 'baseAssetId',
        dataIndex: 'baseAssetId',
        title: t('common:asset'),
        align: 'left',
        width: 148,
        render: (v) => (
            <div className="flex items-center font-semibold">
                {v && <AssetLogo assetId={v} size={32} />}
                <div className="ml-2"> {getAssetCode(v)}</div>
            </div>
        )
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
        key: 'quoteQty',
        dataIndex: 'quoteQty',
        title: t('common:amount'),
        align: 'right',
        width: 189,
        render: (v) => formatNumber(v)
    },
    {
        key: 'partnerMetadata',
        dataIndex: 'partnerMetadata',
        title: t('common:from'),
        align: 'left',
        width: 189,
        render: (v) => (
            <div className="">
                <div className="txtPri-2 mb-1">{v?.name}</div>
                <div className="txtSecond-3">{v?.userId}</div>
            </div>
        )
    },
    {
        key: '_',
        dataIndex: '_',
        title: t('common:to'),
        align: 'left',
        width: 189,
        render: (row) => {
            // const config = assetConfig?.find((e) => e?.id === item?.currency);
            return (
                <div className="">
                    <div className="txtPri-2 mb-1">{user?.username ?? user?.name ?? user?.email}</div>
                    <div className="txtSecond-3">{user?.code}</div>
                </div>
            );
        }
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: <span className="mr-[10px]">{t('common:status')}</span>,
        align: 'right',
        width: 182,
        render: (v) => {
            const statusContent = TABS.find((tab) => tab?.status === v);
            return (
                <div className="flex justify-end items-center">
                    <TagV2 icon={false} type={statusContent?.type}>
                        {statusContent?.localized}
                    </TagV2>
                </div>
            );
        }
    }
];

const HistoryTable = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    const [dataTable, setDataTable] = useState([]);
    const [hasNext, setHasNext] = useState(false);
    const user = useSelector((state) => state.auth.user) || null;

    const [loadingDataTable, setLoadingDataTable] = useState(false);

    const fetchData = () => {
        setLoadingDataTable(true);

        Axios.get(API_GET_HISTORY_DW_PARTNERS, {
            params: {
                page: currentPage,
                pageSize: LIMIT_ROW,
                lastId: dataTable[dataTable.length - 1]?._id ?? null,
                mode: 'partner',
                side: 'BUY',
                status: activeTab === 0 ? null : TABS[activeTab]?.status
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

    useEffect(() => {
        setCurrentPage(0);
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    return (
        <div className="space-y-6">
            <div className="txtPri-3 ">Lịch sử lệnh</div>
            <TabV2
                activeTabKey={activeTab}
                onChangeTab={(key) => setActiveTab(key)}
                tabs={TABS.map((tab) => ({
                    key: tab.key,
                    children: <div className="">{tab.localized}</div>
                }))}
            />
            <TableV2
                // sort={['created_at']}
                limit={LIMIT_ROW}
                skip={0}
                useRowHover
                data={dataTable}
                columns={getColumns(t, user)}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                loading={loadingDataTable}
                onRowClick={(transaction) => {
                    console.log('transaction:', transaction);
                }}
                height={404}
                className="border border-divider dark:border-divider-dark rounded-lg pt-4"
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
                emptyTextContent={'Không có giao dịch nào'}
            />
        </div>
    );
};

export default HistoryTable;
