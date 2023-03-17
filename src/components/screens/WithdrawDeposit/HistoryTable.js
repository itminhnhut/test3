import React, { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import TabV2 from 'components/common/V2/TabV2';
import TableV2 from 'components/common/V2/TableV2';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import AssetLogo from 'components/wallet/AssetLogo';
import { shortHashAddress, getAssetCode, formatTime, formatPrice } from 'redux/actions/utils';
import { TABS, data } from './constants';

const columns = [
    { key: '_id', dataIndex: '_id', title: 'Mã giao dịch', align: 'center', width: 124, render: (row) => <div>{shortHashAddress(row, 0, 4)}</div> },
    {
        key: 'asset',
        dataIndex: 'currency',
        title: 'Tài sản',
        align: 'left',
        width: 148,
        render: (row) => (
            <div className="flex items-center font-semibold">
                {row && <AssetLogo useNextImg={true} assetId={row} size={32} />}
                <div className="ml-2"> {getAssetCode(row)}</div>
            </div>
        )
    },
    {
        key: 'created_at',
        dataIndex: 'created_at',
        title: 'Thời gian',
        align: 'left',
        width: 196,
        render: (row) => <div>{formatTime(row, 'HH:mm:ss dd/MM/yyyy')}</div>
    },
    {
        key: 'amount',
        dataIndex: 'amount',
        title: 'Số lượng',
        align: 'right',
        width: 189,
        render: (row) => {
            // const config = assetConfig?.find((e) => e?.id === item?.currency);
            return <div>{formatPrice(row, 5)}</div>;
        }
    },
    {
        key: 'from',
        dataIndex: 'from',
        title: 'Từ',
        align: 'left',
        width: 189,
        render: (row) => {
            // const config = assetConfig?.find((e) => e?.id === item?.currency);
            return (
                <div className="">
                    <div className="txtPri-2 mb-1">{row.name}</div>
                    <div className="txtSecond-3">{row.code}</div>
                </div>
            );
        }
    },
    {
        key: 'to',
        dataIndex: 'to',
        title: 'Đến',
        align: 'left',
        width: 189,
        render: (row) => {
            // const config = assetConfig?.find((e) => e?.id === item?.currency);
            return (
                <div className="">
                    <div className="txtPri-2 mb-1">{row.name}</div>
                    <div className="txtSecond-3">{row.code}</div>
                </div>
            );
        }
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: 'Trạng thái',
        align: 'right',
        width: 182,
        render: (row) => {
            const statusContent = TABS.find((tab) => tab?.status && tab.status === row);
            return (
                <div className="flex justify-end items-center">
                    <TagV2 icon={false} type={statusContent.type}>
                        {statusContent.localized}
                    </TagV2>{' '}
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

    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS[0].key);

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
                limit={10}
                skip={0}
                useRowHover
                data={data}
                columns={columns}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                loading={false}
                onRowClick={(transaction) => {
                    console.log('transaction:', transaction);
                }}
                height={404}
                className="border rounded-lg border-divider dark:border-divider-dark pt-4"
                tableStyle={{ fontSize: '16px', padding: '16px' }}
                pagingPrevNext={{
                    page: currentPage,
                    hasNext: false,
                    onChangeNextPrev: (e) => setCurrentPage((prevPage) => prevPage + e),
                    language
                }}
                emptyTextContent={'Không có giao dịch nào'}
            />
        </div>
    );
};

export default HistoryTable;
