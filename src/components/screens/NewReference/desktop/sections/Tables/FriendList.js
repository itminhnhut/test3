import React, { useEffect, useMemo } from 'react';
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
import ModalV2 from 'components/common/V2/ModalV2';
import Copy from 'components/svg/Copy';
import { assetCodeFromId } from 'utils/reference-utils';
import WarningTriangle from 'components/svg/WarningTriangle';
import CheckCircle from 'components/svg/CheckCircle';
import { KYC_STATUS } from 'redux/actions/const';
import { map, omit } from 'lodash';
import TagV2 from 'components/common/V2/TagV2';

const NoKYCTag = ({ t }) => <TagV2 className='whitespace-nowrap'>{t('reference:referral.not_kyc')}</TagV2>;
const KYCPendingTag = ({ t }) => <TagV2 className='whitespace-nowrap' type='warning'>{t('reference:referral.pending_kyc')}</TagV2>;
const KYCApprovedTag = ({ t }) => <TagV2 className='whitespace-nowrap' type='success'>{t('reference:referral.kyc')}</TagV2>;

const ModalCommissionFriend = ({t, commissionConfig, friend = {}, onClose}) => {
    const commissionType = {
        0: t('reference:referral.commission_types.spot'),
        1: t('reference:referral.commission_types.futures'),
        2: t('reference:referral.commission_types.swap'),
        3: t('reference:referral.commission_types.staking')
    };

    return <ModalV2 isVisible={!!friend} className='w-[50rem]' onBackdropCb={onClose}>
        <div className='flex items-center justify-center border-b border-divider-dark mb-4 pb-4'>
            <div className='font-medium'>
                <span className='text-sm text-txtSecondary'>{t('reference:referral.referral_code')}: </span>
                <span className='text-xl'>{friend?.byRefCode}</span>
            </div>
            <div className='rounded-full bg-darkBlue-3 p-3 ml-6 cursor-pointer'>
                <Copy size={14} />
            </div>
        </div>

        <div className='bg-darkBlue-3 p-4 rounded-xl'>
            <table className='table-fixed w-full'>
                <thead>
                <tr className='text-sm'>
                    <th className='py-2'>{t('reference:referral.commission_rate')}</th>
                    {map(commissionType, (v, k) => <th key={k} className='py-2'>{v}</th>)}
                </tr>
                </thead>
                <tbody>
                {map(omit(commissionConfig[friend?.rank] || {}, ['commissionLevel']), (configs = {}, commissionKind) => {
                    return <tr key={commissionKind}>
                        <td className='text-center text-txtSecondary text-sm'>{t(`reference:referral.${commissionKind}`)}</td>
                        {map(configs, (c, k) => {
                            return <td key={k} className='text-center font-semibold text-teal py-2'>{c}%</td>
                        })}
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </ModalV2>
}

const FriendList = ({
    t,
    commisionConfig: commissionConfig,
    id
}) => {
    const rank = {
        '1': t('reference:referral.normal'),
        '2': t('reference:referral.official'),
        '3': t('reference:referral.gold'),
        '4': t('reference:referral.platinum'),
        '5': t('reference:referral.diamond')
    };
    const statuses = [
        {
            title: t('common:all'),
            value: null
        },
        {
            title: t('reference:referral.not_kyc'),
            value: KYC_STATUS.NO_KYC
        },
        {
            title: t('reference:referral.pending_kyc'),
            value: KYC_STATUS.PENDING_APPROVAL
        },
        {
            title: t('reference:referral.kyc'),
            value: KYC_STATUS.APPROVED
        }
    ];

    const filters = {
        introduced_on: {
            type: 'date',
            value: null,
            values: null,
            title: t('reference:referral.referral_date')
        },
        status: {
            type: 'popover',
            value: null,
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
        }

    };
    const limit = 10;
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState(filters);
    const [dataSource, setdataSource] = useState({
        results: [],
        hasNext: false,
        total: 0
    });
    const [commissionByFriendDetail, setCommissionByFriendDetail] = useState(null)


    const getListFriends = _.throttle(async () => {
        const params = {
            invitedAt: filter.introduced_on.value ? new Date(filter.introduced_on.value).getTime() : null,
            from: filter?.total_commissions?.value?.startDate ? new Date(filter?.total_commissions?.value?.startDate).getTime() : null,
            to: new Date(filter?.total_commissions?.value?.endDate).getTime() ?? new Date().getTime(),
            kycStatus: filter.status.value
        };
        try {
            setLoading(true);
            const { data } = await fetchApi({
                url: API_GET_LIST_FRIENDS,
                params: {
                    ...params,
                    limit: limit,
                    skip: limit * (page - 1)
                }
            });
            if (data) {
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
            skeletons.push({
                ...ROW_SKELETON,
                isSkeleton: true,
                key: `asset__skeleton__${i}`
            });
        }
        return skeletons;
    }, []);


    const renderRefInfo = (data) => <div className='text-sm nami-underline-dotted' onClick={() => setCommissionByFriendDetail(data)}>
        {data?.code}
    </div>;

    const renderCommissionData = (data, type = 'directCommission') => {
        return (
            <div>
                <p
                    className='text-teal inline-block font-semibold nami-underline-dotted'
                    data-tip=''
                    data-for={type + data?.code}
                >
                    ~ {formatNumber(data?.[type]?.total)} {data?.symbol} VNDC
                </p>
                <Tooltip id={type + data?.code} place='top' effect='solid' arrowColor='#fff' className='!px-6 !py-3'>
                    <div className='min-w-[120px] w-full'>
                        <div className='mb-4 text-txtSecondary text-center text-xs'>
                            {t('reference:referral.total_direct_commissions')}
                        </div>
                        <div className='space-y-1 text-sm'>
                            {[72, 22, 1, 447, 86].map(assetId => {
                                return <div className='flex items-center justify-between'>
                                    <span>{formatNumber(data?.[type]?.[assetId], 2)}</span>
                                    <span className='text-txtSecondary ml-2'>{assetCodeFromId(assetId)}</span>
                                </div>;
                            })}
                        </div>
                    </div>
                </Tooltip>
            </div>
        );
    };

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
        render: (data, item) => <div className='font-normal'>{data ? formatTime(data, 'dd-MM-yyyy') : null}</div>
    }, {
        key: 'status',
        dataIndex: 'kycStatus',
        title: t('reference:referral.status'),
        align: 'left',
        width: 90,
        // preventSort: true,
        render: (data) => {
            return {
                [KYC_STATUS.NO_KYC]: <NoKYCTag t={t} />,
                [KYC_STATUS.PENDING_APPROVAL]: <KYCPendingTag t={t} />,
                [KYC_STATUS.APPROVED]: <KYCApprovedTag t={t} />
            }[data];
        }
    }, {
        key: 'referred',
        dataIndex: 'invitedCount',
        title: t('reference:referral.referred'),
        align: 'left',
        width: 90,
        // preventSort: true,
        render: (data, item) => <div className='font-normal'>{data} {' '} {t('reference:referral.friends')}</div>
    }, {
        key: 'rank',
        dataIndex: 'rank',
        title: t('reference:referral.ranking'),
        align: 'left',
        width: 90,
        // preventSort: true,
        render: (data, item) => <div className='font-normal'>{rank[data?.toString() ?? '0']}</div>
    }, {
        key: 'directCommission',
        dataIndex: 'directCommission',
        title: t('reference:referral.total_direct_commissions'),
        align: 'right',
        width: 250,
        // preventSort: true,
        render: (data, item) => renderCommissionData(item, 'directCommission')
    }, {
        key: 'undirectCommission',
        dataIndex: 'undirectCommission',
        title: t('reference:referral.total_indirect_commissions'),
        align: 'right',
        width: 250,
        // preventSort: true,
        render: (data, item) => renderCommissionData(item, 'undirectCommission')
    }], [dataSource]);

    return (
        <div className='flex w-full' id={id}>
            <ModalCommissionFriend t={t} commissionConfig={commissionConfig} friend={commissionByFriendDetail} onClose={() => setCommissionByFriendDetail(null)}/>

            <div className='w-full border border-divider-dark rounded-xl py-8'>
                <div className='font-semibold text-[22px] leading-7 mx-6 mb-8'>
                    {t('reference:referral.friend_list')}
                </div>
                <div className='flex gap-6 flex-wrap mx-6 mb-6'>
                    <TableFilter filters={filters} filter={filter} setFilter={setFilter} />
                </div>
                <div className='border-t border-divider-dark'>
                    <ReTable
                        // defaultSort={{ key: 'namiId', direction: 'desc' }}
                        className='friendlist-table'
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
                                minWidth: '100px'
                            }
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
            </div>
        </div>
    );
};

export default FriendList;

const ROW_SKELETON = {
    code: <Skeletor width={200} />,
    invitedAt: <Skeletor width={110} />,
    kycStatus: <Skeletor width={90} />,
    referred: <Skeletor width={90} />,
    rank: <Skeletor width={90} />,
    directCommission: <Skeletor width={250} />,
    undirectCommission: <Skeletor width={250} />
};
