import Axios from 'axios';
import OrderStatusTag from 'components/common/OrderStatusTag';
import Skeletor from 'components/common/Skeletor';
import TabV2 from 'components/common/V2/TabV2';
import TableV2 from 'components/common/V2/TableV2';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import TextCopyable from 'components/screens/Account/TextCopyable';
import AssetLogo from 'components/wallet/AssetLogo';
import { PATHS } from 'constants/paths';
import useFetchApi from 'hooks/useFetchApi';
import { find } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_GET_DEPWDL_HISTORY, API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import { ApiStatus, DepWdlStatus, PartnerAcceptStatus, PartnerOrderStatus } from 'redux/actions/const';
import { formatNanNumber, formatTime } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const LIMIT_ROW = 10;

const getColumns = (t, configs) => [
    {
        key: 'type',
        dataIndex: 'type',
        title: 'Loại Lệnh',
        align: 'left',
        width: 148,
        fixed: 'left',
        render: (v) => (v === 1 ? 'Nhận Tiền' : v === 2 ? 'Gửi Tiền' : '')
    },
    {
        key: 'id',
        dataIndex: 'id',
        title: 'ID',
        align: 'left',
        width: 158,
        render: (v, item) => {
            return <TextCopyable text={item?._id} showingText={`${item?._id?.slice(0, 4)}...${item?._id?.slice(-4)}`} />;
        }
    },
    {
        key: 'assetId',
        dataIndex: 'assetId',
        title: 'Loại tài sản',
        align: 'left',
        width: 148,
        render: (id) => {
            const assetConfig = find(configs, { id: +id });

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
        width: 126,
        render: (v) => formatTime(v, 'dd/MM/yyyy')
    },
    {
        key: 'amount',
        dataIndex: 'amount',
        title: t('common:amount'),
        align: 'left',
        width: 169,
        render: (v, item) => {
            const assetConfig = find(configs, { id: item?.assetId });
            return `${formatNanNumber(v, assetConfig?.assetDigit)}`;
        }
    },
    {
        key: 'from',
        dataIndex: 'from',
        title: 'Từ',
        align: 'left',
        width: 194,
        render: (v, item) => {
            const fromUserInformation = item?.metadata?.fromUser || item?.from;
            return <TextCopyable text={fromUserInformation?.code || fromUserInformation?.email || fromUserInformation?.name} />;
        }
    },
    {
        key: 'to',
        dataIndex: 'to',
        title: 'Đến',
        align: 'right',
        width: 194,
        render: (v, item) => {
            const toUserInformation = item?.metadata?.toUser || item?.to;
            return <TextCopyable className="justify-end" text={toUserInformation?.code || toUserInformation?.email || toUserInformation?.name} />;
        }
    },
    {
        key: 'note',
        dataIndex: 'note',
        title: 'Ghi chú',
        align: 'right',
        width: 296,
        render: (v, item) => {
            return item?.metadata?.note;
        }
    },
    {
        key: 'status',
        dataIndex: 'status',
        title: 'Trạng thái',
        align: 'right',
        width: 168,
        render: (status) =>
            ({
                [DepWdlStatus.Success]: (
                    <TagV2 icon={false} className="ml-auto" type="success">
                        {t('common:success')}
                    </TagV2>
                ),
                [DepWdlStatus.Pending]: (
                    <TagV2 icon={false} className="ml-auto" type="warning">
                        {t('common:processing')}
                    </TagV2>
                ),
                [DepWdlStatus.Declined]: (
                    <TagV2 icon={false} className="ml-auto" type="failed">
                        {t('common:declined')}
                    </TagV2>
                )
            }[status])
    }
];

export const TABS = [
    {
        key: 0,
        localized: 'common:all'
    },
    {
        key: 1,
        localized: 'transaction-history:completed',
        status: DepWdlStatus.Success
    },
    {
        key: 2,
        localized: 'common:processing',
        status: DepWdlStatus.Pending
    },

    {
        key: 3,
        localized: 'common:denined',
        status: DepWdlStatus.Declined
    }
];

const DepositHistory = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const configs = useSelector((state) => state.utils?.assetConfig) || [];

    const [currentPage, setCurrentPage] = useState(0);
    const [activeTab, setActiveTab] = useState(TABS[0].key);
    const [curSort, setCurSort] = useState({});

    const { data, loading, error } = useFetchApi(
        {
            url: API_GET_DEPWDL_HISTORY,
            params: {
                page: currentPage,
                pageSize: LIMIT_ROW,
                status: TABS[activeTab]?.status,
                // status: activeTab === 0 ? null : TABS[activeTab]?.status,
                ...curSort
            }
        },
        true,
        [currentPage, curSort, activeTab]
    );

    const customSort = (tableSorted) => {
        const output = {};

        for (const key in tableSorted) {
            if (tableSorted.hasOwnProperty(key)) {
                output.sortBy = key;
                output.sortType = tableSorted[key] ? 1 : -1;
            }

            setCurSort(output);
        }
        setCurrentPage(0);
    };

    return (
        <div className="space-y-6">
            <div className="txtPri-3 ">{t('common:global_label.history')}</div>
            <TabV2
                variants="filter2"
                isDeepBackground={true}
                isOverflow={true}
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
                limit={LIMIT_ROW}
                skip={0}
                useRowHover
                data={data || []}
                columns={getColumns(t, configs)}
                rowKey={(item) => item?._id}
                scroll={{ x: true }}
                loading={loading}
                height={404}
                className="bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-lg pt-4"
                tableStyle={{
                    fontSize: '16px',
                    padding: '16px',
                    headerFontStyle: { 'font-size': `14px !important` }
                }}
                pagingPrevNext={{
                    page: currentPage,
                    hasNext: data?.hasNext || false,
                    onChangeNextPrev: (e) => setCurrentPage((prevPage) => prevPage + e),
                    language
                }}
                emptyTextContent={t('common:no_data')}
                customSort={customSort}
            />
        </div>
    );
};

export default DepositHistory;
