import RefCard from 'components/screens/NewReference/RefCard'
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react';
import { TableFilter } from '.';
import { API_GET_LIST_FRIENDS } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import ReTable from 'components/common/ReTable';
import Skeletor from 'components/common/Skeletor';
import { getS3Url, formatNumber, formatTime } from 'redux/actions/utils';
import { Tooltip } from 'components/screens/NewReference/mobile/sections/FriendList';
import classNames from 'classnames';
import RePagination from 'components/common/ReTable/RePagination';

const FriendList = ({ t, commisionConfig, id }) => {
    const rank = {
        '1': t('reference:referral.normal'),
        '2': t('reference:referral.official'),
        '3': t('reference:referral.gold'),
        '4': t('reference:referral.platinum'),
        '5': t('reference:referral.diamond'),
    }
    const statuses = [
        { title: t('common:all'), value: 0 },
        { title: t('reference:referral.not_kyc'), value: 1 },
        { title: t('reference:referral.pending_kyc'), value: 2 },
        { title: t('reference:referral.kyc'), value: 3 },
    ];
    const kycStatus = {
        0: null,
        1: 0,
        2: 1,
        3: 2,
        4: 3
    }
    const filters = {
        introduced_on: {
            type: 'date',
            value: null,
            values: null,
            title: t('reference:referral.referral_date')
        },
        status: {
            type: 'popover',
            value: 0,
            values: statuses,
            title: t('reference:referral.status')
        },
        total_commissions: {
            type: 'daterange',
            value: {
                startDate: null,
                endDate: new Date(),
                key: 'selection'
            },
            values: null,
            title: t('reference:referral.total_commissions')
        },

    }
    const limit = 10
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState(filters)
    const [dataSource, setdataSource] = useState({
        results: [],
        hasNext: false,
        total: 0
    });
    const getListFriends = _.throttle(async () => {
        const params = {
            invitedAt: filter.introduced_on.value ? new Date(filter.introduced_on.value).getTime() : null,
            from: filter?.total_commissions?.value?.startDate ? new Date(filter?.total_commissions?.value?.startDate).getTime() : null,
            to: new Date(filter?.total_commissions?.value?.endDate).getTime() ?? new Date().getTime(),
            kycStatus: kycStatus[filter.status.value],
        };
        try {
            setLoading(true)
            const { data } = await fetchApi({
                url: API_GET_LIST_FRIENDS,
                params: {
                    ...params,
                    limit: limit,
                    skip: limit * (page - 1)
                }
            });
            if (data) {
                console.log(data)
                setdataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        getListFriends();
    }, [filter, page]);

    const skeletons = useMemo(() => {
        const skeletons = [];
        for (let i = 0; i < limit; i++) {
            skeletons.push({ ...ROW_SKELETON, isSkeleton: true, key: `asset__skeleton__${i}` });
        }
        return skeletons;
    }, []);

    const commissionType = {
        0: t('reference:referral.commission_types.spot'),
        1: t('reference:referral.commission_types.futures'),
        2: t('reference:referral.commission_types.swap'),
        3: t('reference:referral.commission_types.staking')
    }

    const renderRefInfo = (data) => <div className="leading-6 font-semibold text-sm text-darkBlue flex gap-1 items-center">
        {data?.code} <div data-tip="" data-for={'info' + data?.code} data-offset="{'left': 16}">
            <img src={getS3Url('/images/nao/ic_info.png')} height={12} width={12} />
        </div>
        <Tooltip id={'info' + data?.code} place="top" data-offset="{'left': 16}" effect="solid" className={classNames('!left-4 !p-0')}>
            <div className='w-full pt-6 pb-2 px-3 font-semibold text-base'>
                <div className='w-full rounded-md border-[1px] border-teal h-10 flex items-center justify-center'>
                    <div className='absolute top-[10px] p-1 text-xs font-medium text-gray-1 bg-white'>
                        Ref Code
                    </div>
                    <div className='font-semibold text-sm text-darkBlue leading-6'>
                        {data?.byRefCode}
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='text-teal leading-6 font-semibold text-sm'>
                        {t('reference:referral.direct_commissions_rate')}
                    </div>
                    <div className='text-darkBlue font-medium text-sm flex flex-wrap'>
                        {Object.values(commisionConfig[data?.rank ?? 1]?.direct ?? {}).map((config, index) => {
                            return (
                                <span key={index} className='pr-2 mt-[2px] leading-6 text-darkBlue font-medium text-xs'>{commissionType[index]}: {config}%</span>
                            )
                        })}
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='text-teal leading-6 font-semibold text-sm'>
                        {t('reference:referral.indirect_commissions_rate')}
                    </div>
                    <div className='text-darkBlue font-medium text-xs flex flex-wrap'>
                        {Object.values(commisionConfig[data?.rank ?? 1]?.indirect ?? {}).map((config, index) => {
                            return (
                                <span key={index} className='pr-2 mt-[2px] leading-6 text-darkBlue font-medium text-xs'>{commissionType[index]}: {config}%</span>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Tooltip>
    </div>

    const renderCommissionData = (data, type = 'directCommission') => {
        return (
            <div className="flex items-center gap-2 w-full">
                <div className="text-teal">
                    ~ {formatNumber(data?.[type]?.total)} {data?.symbol} VNDC
                </div>
                <div data-tip="" data-for={type + data?.code}>
                    <img src={getS3Url('/images/nao/ic_info.png')} height={12} width={12} />
                </div>
                <Tooltip id={type + data?.code} place="top" effect="solid" arrowColor='#fff'>
                    <div className='text-xs !bg-white min-w-[120px] w-full'>
                        <div className='mb-2 font-semibold text-gray-1'>
                            {t('reference:referral.total_direct_commissions')}
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center w-full h-6'>• {' '}{formatNumber(data?.[type]?.['72'], 2)} VNDC</div>
                            <div className='flex items-center w-full h-6'>• {' '}{formatNumber(data?.[type]?.['22'], 2)} USDT</div>
                            <div className='flex items-center w-full h-6'>• {' '}{formatNumber(data?.[type]?.['1'], 2)} NAMI</div>
                        </div>
                    </div>
                </Tooltip>
            </div>
        )
    }

    const columns = useMemo(() => [{
        key: 'namiId',
        dataIndex: 'code',
        title: 'Nami ID',
        align: 'left',
        width: 200,
        sorter: false,
        render: (data, item) => renderRefInfo(item)
    }, {
        key: 'invitedAt',
        dataIndex: 'invitedAt',
        title: t('reference:referral.referral_date'),
        align: 'left',
        width: 110,
        // preventSort: true,
        render: (data, item) => <div>{formatTime(data, 'dd/MM/yyyy')}</div>
    }, {
        key: 'status',
        dataIndex: 'kycStatus',
        title: t('reference:referral.status'),
        align: 'left',
        width: 90,
        // preventSort: true,
        render: (data, item) => {
            const status = statuses.find((rs) => data === 3 ? rs.value === 3 : rs.value === data + 1)?.title;
            return <div
                className={classNames(
                    'px-2 py-1 rounded-md font-semibold text-sm leading-6',
                    data === 2 ? 'text-teal bg-teal/[.05]' : 'text-gray-1 bg-gray-1/[.05]'
                )}
                style={{ width: 'fit-content' }}
            >
                {status}
            </div>
        }
    }, {
        key: 'referred',
        dataIndex: 'invitedCount',
        title: t('reference:referral.referred'),
        align: 'left',
        width: 90,
        // preventSort: true,
        render: (data, item) => <div>{data} {' '} {t('reference:referral.friends')}</div>
    }, {
        key: 'rank',
        dataIndex: 'rank',
        title: t('reference:referral.ranking'),
        align: 'left',
        width: 90,
        // preventSort: true,
        render: (data, item) => <div>{rank[data?.toString() ?? '0']}</div>
    }, {
        key: 'directCommission',
        dataIndex: 'directCommission',
        title: t('reference:referral.total_direct_commissions'),
        align: 'left',
        width: 250,
        // preventSort: true,
        render: (data, item) => renderCommissionData(item, 'directCommission')
    }, {
        key: 'indirectCommission',
        dataIndex: 'undirectCommission',
        title: t('reference:referral.total_indirect_commissions'),
        align: 'left',
        width: 250,
        // preventSort: true,
        render: (data, item) => renderCommissionData(item, 'indirectCommission')
    }], [dataSource]);

    return (
        <div className='flex w-full' id={id}>
            <RefCard wrapperClassName='!p-6 w-full'>
                <div className='font-semibold text-[20px] leading-6 mb-6'>
                    {t('reference:referral.friend_list')}
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
                            rowStyle: {},
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

export default FriendList

const ROW_SKELETON = {
    code: <Skeletor width={200} />,
    invitedAt: <Skeletor width={110} />,
    kycStatus: <Skeletor width={90} />,
    referred: <Skeletor width={90} />,
    rank: <Skeletor width={90} />,
    directCommission: <Skeletor width={250} />,
    indirectCommission: <Skeletor width={250} />,
};
