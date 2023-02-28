import React, { useEffect, useMemo, useRef, useState } from 'react';
import TabV2 from 'components/common/V2/TabV2/index';
import Link from 'next/link';
import { TransactionTabs, TRANSACTION_TYPES } from './constant';
import { useRouter } from 'next/router';
import TransactionFilter from './TransactionFilter';
import TableV2 from 'components/common/V2/TableV2';
import FetchApi from 'utils/fetch-api';
import { API_GET_WALLET_TRANSACTION_HISTORY } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import AssetLogo from 'components/wallet/AssetLogo';
import { getAssetName } from 'redux/actions/utils';


const LIMIT = 10

const TransactionHistory = ({ id }) => {
    const { t, i18n: { language } } = useTranslation()
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const hasNext = useRef(false)
    const [filter, setFilter] = useState({
        page: 0,
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        },
    });
    const changeFilter = (_filter) => setFilter((prevState) => ({ ...prevState, ..._filter }));
    
    const [categoryConfig, setCategoryConfig] = useState([])
    useEffect(() => {
        FetchApi({
            url: API_GET_WALLET_TRANSACTION_HISTORY,
            params
        }).then(({ data, statusCode }) => {
            if (statusCode === 200) {
                console.log('data', data)
                hasNext.current = data?.hasNext
                setData(data?.result)
                setLoading(false)
            }
        });
    }, [])

    const columns = useMemo(() => {
        return {
            _id: {
                key: '_id',
                dataIndex: '_id',
                title: 'ID',
                align: 'left',
                fixed: 'left',
                width: 160,
                render: (row) => <div title={row}>{row?.slice(0, 4) + '...' + row?.slice(row?.length - 5, row?.length)}</div>
            },
            asset: {
                key: 'asset',
                dataIndex: 'currency',
                title: 'Asset',
                align: 'left',
                fixed: 'left',
                width: 148,
                render: (row) => <div className='flex items-center gap-2'><AssetLogo assetId={row} size={32} />{getAssetName(row)}</div>
            }
        }
    }, [t])

    const columnsConfig = {
        [TRANSACTION_TYPES.DEPOSIT]: ['_id', 'asset']
    }

    const filterdColumns = useMemo(() => {
        return columnsConfig?.[id].map(key => columns[key]);
    }, [columns, id])

    useEffect(() => {
        setLoading(true)
        const type = id?.length ? {
            [id]: id,
            [TRANSACTION_TYPES.DEPOSIT]: TRANSACTION_TYPES.DEPOSITWITHDRAW,
            [TRANSACTION_TYPES.WITHDRAW]: TRANSACTION_TYPES.DEPOSITWITHDRAW,
        }[id] : null
        const from = filter?.range?.startDate
        const to = filter?.range?.endDate

        const isNegative = {
            deposit: false,
            withdraw: true
        }[id]

        const params = {
            type,
            from,
            to,
            isNegative,
            limit: LIMIT,
            skip: filter?.page * LIMIT,
        }

        FetchApi({
            url: API_GET_WALLET_TRANSACTION_HISTORY,
            params
        }).then(({ data, statusCode }) => {
            if (statusCode === 200) {
                console.log('data', data)
                hasNext.current = data?.hasNext
                setData(data?.result)
                setLoading(false)
            }
        });
    }, [filter, id])

    return (
        <div className="min-h-[500px] max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl">
            <div className="mt-20 mb-[120px]">
                <div className="text-[32px] lead-[1.19] font-semibold mb-12">Lịch sử giao dịch</div>
                <div className="flex mb-8">
                    <TabV2
                        // isOverflow
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
                    <TransactionFilter filter={filter} setFilter={setFilter} />
                </div>
                <div>
                    <TableV2
                        sort
                        defaultSort={{ key: 'code', direction: 'desc' }}
                        useRowHover
                        data={data}
                        columns={filterdColumns}
                        rowKey={(item) => item?.key}
                        scroll={{ x: true }}
                        loading={loading}
                        // isSearch={!!state.search}
                        height={404}
                        pagingClassName="border-none"
                        className="border rounded-lg border-divider dark:border-divider-dark pt-4 mt-8"
                        tableStyle={{ fontSize: '16px', padding: '16px' }}
                        pagingPrevNext={{ page: filter?.page, hasNext: hasNext.current, onChangeNextPrev: (e) => changeFilter({ page: filter.page + e }), language }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
