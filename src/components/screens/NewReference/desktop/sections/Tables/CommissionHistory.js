import RefCard from 'components/screens/NewReference/RefCard'
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react';
import { TableFilter } from '.';
import { API_GET_COMMISSON_HISTORY } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import ReTable from 'components/common/ReTable';
import Skeletor from 'components/common/Skeletor';
import { getS3Url, formatNumber, formatTime } from 'redux/actions/utils';
import RePagination from 'components/common/ReTable/RePagination';
import { WalletCurrency } from 'components/screens/OnusWithdrawGate/helper';
import _ from 'lodash';
import AssetLogo from 'components/wallet/AssetLogo';
import { useSelector } from 'react-redux';

const CommissionHistory = ({ t, commisionConfig, id }) => {
    const assetConfig = useSelector(state => state.utils.assetConfig)
    const levelTabs = [
        { title: t('common:all'), value: null },
        { title: '01', value: 1 },
        { title: '02', value: 2 },
        { title: '03', value: 3 },
        { title: '04', value: 4 },
        { title: '05', value: 5 }
    ];
    const typeTabs = [
        { title: t('common:all'), value: null },
        { title: 'Spot', value: 'SPOT' },
        { title: 'Futures', value: 'FUTURES' }
    ];
    const assetTabs = [
        { title: t('common:all'), value: null },
        { title: 'VNDC', value: WalletCurrency.VNDC },
        { title: 'NAO', value: WalletCurrency.NAO },
        { title: 'NAMI', value: WalletCurrency.NAMI },
        { title: 'ONUS', value: WalletCurrency.ONUS }
    ];

    const filters = {
        date: {
            type: 'daterange',
            value: {
                startDate: null,
                endDate: new Date(),
                key: 'selection'
            },
            values: null,
            title: t('reference:referral.date')
        },
        level: {
            type: 'popover',
            value: null,
            values: levelTabs,
            title: t('reference:referral.level')
        },
        commission_type: {
            type: 'popover',
            value: null,
            values: typeTabs,
            title: t('reference:referral.commission_type')
        },
        asset_type: {
            type: 'popover',
            value: null,
            values: assetTabs,
            title: t('reference:referral.asset_type')
        },
    }
    const limit = 10
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState(filters)
    const [dataSource, setDataSource] = useState({
        results: [],
        hasNext: false,
        total: 0
    });
    const getCommisionHistory = _.throttle(async () => {
        const params = {
            from: filter?.date?.value?.startDate ? new Date(filter?.date?.value?.startDate).getTime() : null,
            to: new Date(filter?.date?.value?.endDate).getTime() ?? new Date().getTime(),
            kind: filter?.commission_type?.value,
            level: filter?.level?.value,
            currency: filter?.asset_type?.value,
        };
        try {
            setLoading(true);
            const { data } = await fetchApi({
                url: API_GET_COMMISSON_HISTORY,
                params: {
                    ...params,
                    limit: limit,
                    skip: limit * (page - 1)
                }
            });
            if (data) {
                setDataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        getCommisionHistory();
    }, [filter, page]);

    const skeletons = useMemo(() => {
        const skeletons = [];
        for (let i = 0; i < limit; i++) {
            skeletons.push({ ...ROW_SKELETON, isSkeleton: true, key: `asset__skeleton__${i}` });
        }
        return skeletons;
    }, []);

    const columns = useMemo(() => [{
        key: 'date',
        dataIndex: 'createdAt',
        title: t('reference:referral.date'),
        align: 'left',
        width: 200,
        sorter: false,
        render: (data, item) => <div>{formatTime(data, 'dd/MM/yyyy hh:mm:ss')}</div>
    }, {
        key: 'level',
        dataIndex: 'level',
        title: t('reference:referral.level'),
        align: 'left',
        width: 100,
        sorter: false,
        render: (data, item) => <div>{data}</div>
    }, {
        key: 'kind',
        dataIndex: 'kind',
        title: t('reference:referral.commission_type'),
        align: 'left',
        width: 150,
        sorter: false,
        render: (data, item) => {
            const type = typeTabs.find((rs) => rs.value === data)?.title;
            return <div>{type}</div>
        }
    }, {
        key: 'currency',
        dataIndex: 'currency',
        title: t('reference:referral.asset_type'),
        align: 'left',
        width: 150,
        sorter: false,
        render: (data, item) => <div className='flex items-center gap-2'>
            <AssetLogo size={36} assetId={data} />
            <div>{assetTabs.find(e => e.value === data)?.title}</div>
        </div>
    }, {
        key: 'value',
        dataIndex: 'value',
        title: t('reference:referral.total_commissions'),
        align: 'left',
        width: 200,
        sorter: false,
        render: (data, item) => <span className='text-teal'>+ {formatNumber(data, 2)} {assetTabs.find(e => e.value === item.currency)?.title}</span>
    }], [dataSource]);

    return (
        <div className='flex w-full' id={id}>
            <RefCard wrapperClassName='!p-6 w-full'>
                <div className='font-semibold text-[20px] leading-6 mb-6'>
                    {t('reference:referral.commission_histories')}
                </div>
                <div className='flex gap-4 flex-wrap'>
                    <TableFilter filters={filters} filter={filter} setFilter={setFilter} />
                </div>
                <div className='mt-6'>
                    <ReTable
                        // defaultSort={{ key: 'namiId', direction: 'desc' }}
                        className="friendlist-table"
                        data={loading ? skeletons : dataSource?.results || []}
                        columns={columns}
                        rowKey={(item) => item?.key}
                        loading={!dataSource?.results?.length}
                        scroll={{ x: true }}
                        // tableStatus={}
                        tableStyle={{
                            // paddingHorizontal: '1.75rem',
                            // tableStyle: { minWidth: '1300px !important' },
                            headerStyle: { paddingTop: '8px' },
                            shadowWithFixedCol: false,
                            noDataStyle: {
                                minHeight: '480px'
                            },
                            rowStyle: {
                                minWidth: '100px',
                            },
                        }}
                    // paginationProps={{
                    //     hide: true,
                    //     current: page,
                    //     pageSize: limit,
                    //     onChange: (currentPage) => setPage(currentPage)
                    // }}
                    />
                </div>
                <div className='w-full mt-6 flex justify-center'>
                    <RePagination
                        total={dataSource?.total ?? 0}
                        current={page}
                        pageSize={limit}
                        onChange={page => setPage(page)}
                    />
                </div>
            </RefCard>
        </div>
    )
}

export default CommissionHistory

const ROW_SKELETON = {
    date: <Skeletor width={200} />,
    level: <Skeletor width={110} />,
    kind: <Skeletor width={90} />,
    currency: <Skeletor width={90} />,
    value: <Skeletor width={90} />,
};
