import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TableFilter } from '.';
import { API_GET_LIST_FRIENDS } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import ReTable from 'components/common/ReTable';
import TableV2 from 'components/common/V2/TableV2';
import FetchApi from 'utils/fetch-api';


import Skeletor from 'components/common/Skeletor';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { Tooltip } from 'components/screens/NewReference/mobile/sections/FriendList';
import RePagination from 'components/common/ReTable/RePagination';
import ModalV2 from 'components/common/V2/ModalV2';
// import Copy from 'components/svg/Copy';
import { assetCodeFromId } from 'utils/reference-utils';
import { KYC_STATUS } from 'redux/actions/const';
import { map, omit } from 'lodash';
import TagV2 from 'components/common/V2/TagV2';
import { isValid } from 'date-fns';
import NoData from 'components/common/V2/TableV2/NoData';
import { CopyIcon } from 'components/screens/NewReference/PopupModal';

import {
    API_NEW_REFERRAL
} from 'redux/actions/apis';

const NoKYCTag = ({ t }) => <TagV2 className='whitespace-nowrap'>{t('reference:referral.not_kyc')}</TagV2>;
const KYCPendingTag = ({ t }) => <TagV2 className='whitespace-nowrap'
    type='warning'>{t('reference:referral.pending_kyc')}</TagV2>;
const KYCApprovedTag = ({ t }) => <TagV2 className='whitespace-nowrap text-green-3 dark:text-teal'
    type='success'>{t('reference:referral.kyc')}</TagV2>;

const ModalCommissionFriend = ({
    owner,
    refs,
    t,
    commissionConfig,
    friend = {},
    onClose
}) => {
    const commissionType = {
        0: t('reference:referral.commission_types.spot'),
        1: t('reference:referral.commission_types.futures'),
        2: t('reference:referral.commission_types.swap'),
        3: t('reference:referral.commission_types.staking')
    };
    const rewardRatio = refs.find(obj => obj?.code === friend?.byRefCode)?.remunerationRate || 0

    return <ModalV2 isVisible={!!friend} className='w-[50rem]' onBackdropCb={onClose}>
        <div className='flex items-center justify-center border-b border-divider dark:border-divider-dark mb-4 pb-4'>
            <div className='font-medium'>
                <span
                    className='text-sm text-txtSecondary dark:text-txtSecondary-dark'>{t('reference:referral.referral_code')}: </span>
                <span className='text-xl'>{friend?.byRefCode}</span>
            </div>
            <div className='rounded-full bg-gray-10 dark:bg-darkBlue-3 p-3 ml-6 cursor-pointer'>
                {/* <Copy size={14} /> */}
                <CopyIcon data={friend?.byRefCode} size={16} className='cursor-pointer' />
            </div>
        </div>

        <div className='bg-white dark:bg-darkBlue-3 p-4 border border-divider dark:border-transparent rounded-xl'>
            <table className='table-fixed w-full'>
                <thead>
                    <tr className='text-sm'>
                        <th className='py-2 font-normal'>{t('reference:referral.commission_rate')}</th>
                        {map(commissionType, (v, k) => <th key={k} className='py-2 font-normal'>{v}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {map(omit(commissionConfig[owner?.rank] || {}, ['commissionLevel']), (configs = {}, commissionKind) => {
                        return <tr key={commissionKind}>
                            <td className='text-center text-txtSecondary dark:text-txtSecondary-dark text-sm'>{t(`reference:referral.${commissionKind}`)}</td>
                            {map(configs, (c, k) => {
                                return <td key={k}
                                    className='text-center text-sm font-semibold text-green-3 dark:text-teal py-2'>
                                    {commissionKind === 'direct' && owner?.defaultRefCode?.remunerationRate ? c - c * (rewardRatio / 100) : c}%
                                </td>;
                            })}
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>
    </ModalV2>;
};

const FriendList = ({
    language,
    owner,
    t,
    commisionConfig: commissionConfig,
    id
}) => {
    const [refs, setRefs] = useState([]);

    useEffect(() => {
        FetchApi({
            url: API_NEW_REFERRAL,
            options: {
                method: 'GET'
            }
        })
            .then(({
                data,
                status
            }) => {
                if (status === 'ok') {
                    data.sort((e) => e.status);
                    setRefs(data);
                } else {
                    setRefs([]);
                }
            });
    }, []);

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
            title: t('reference:referral.referral_date'),
            position: 'center'
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
        },
        reset: {
            type: 'reset'
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
    const [commissionByFriendDetail, setCommissionByFriendDetail] = useState(null);

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
        setPage(1)
        getListFriends();
    }, [filter]);

    useEffect(() => {
        getListFriends();
    }, [page]);

    const renderRefInfo = (data) => <div className='text-sm nami-underline-dotted'
        onClick={() => setCommissionByFriendDetail(data)}>
        {data?.code}
    </div>;

    const renderCommissionData = (data, type = 'directCommission') => {
        return (
            <div>
                <p
                    className='text-green-3 dark:text-teal inline-block font-semibold nami-underline-dotted'
                    data-tip=''
                    data-for={type + data?.code}
                >
                    ~ {formatNumber(data?.[type]?.total)} {data?.symbol} VNDC
                </p>
                <Tooltip id={type + data?.code} place='top' effect='solid' arrowColor='#fff' className='!px-6 !py-3'>
                    <div className='min-w-[120px] w-full'>
                        <div className='mb-4 text-white dark:text-txtSecondary-dark text-center text-xs'>
                            {t('reference:referral.total_direct_commissions')}
                        </div>
                        <div className='space-y-1 text-sm'>
                            {[72, 22, 1, 447, 86].map(assetId => {
                                return <div key={assetId} className='flex items-center justify-between'>
                                    <span className='text-white'>{formatNumber(data?.[type]?.[assetId], 2)}</span>
                                    <span
                                        className='text-white dark:text-txtSecondary-dark ml-2'>{assetCodeFromId(assetId)}</span>
                                </div>;
                            })}
                        </div>
                    </div>
                </Tooltip>
            </div>
        );
    };

    const renderTable = useCallback(() => {
        const columns = [{
            key: 'code',
            dataIndex: 'code',
            title: 'Nami ID',
            align: 'left',
            fixed: 'left',
            width: 180,
            render: (data, item) => renderRefInfo(item)
        }, {
            key: 'invitedAt',
            dataIndex: 'invitedAt',
            title: t('reference:referral.referral_date'),
            align: 'left',
            width: 130,
            render: (data, item) => <div
                className='font-normal'>{(data && isValid(new Date(data))) ? formatTime(new Date(data), 'dd-MM-yyyy') : null}</div>
        }, {
            key: 'kycStatus',
            dataIndex: 'kycStatus',
            title: t('reference:referral.status'),
            align: 'left',
            width: 150,
            render: (data) => {
                return {
                    [KYC_STATUS.NO_KYC]: <NoKYCTag t={t} />,
                    [KYC_STATUS.PENDING_APPROVAL]: <KYCPendingTag t={t} />,
                    [KYC_STATUS.APPROVED]: <KYCApprovedTag t={t} />
                }[data];
            }
        }, {
            key: 'invitedCount',
            dataIndex: 'invitedCount',
            title: t('reference:referral.referred'),
            align: 'left',
            width: 140,
            render: (data, item) => <div className='font-normal'>{data} {' '} {t('reference:referral.friends')}</div>
        }, {
            key: 'rank',
            dataIndex: 'rank',
            title: t('reference:referral.ranking'),
            align: 'left',
            width: 120,
            render: (data, item) => <div className='font-normal'>{rank[data?.toString() ?? '0']}</div>
        }, {
            key: 'directCommission.total',
            dataIndex: ['directCommission', 'total'],
            title: t('reference:referral.total_direct_commissions'),
            align: 'right',
            width: 230,
            render: (data, item) => renderCommissionData(item, 'directCommission')
        }, {
            key: 'undirectCommission.total',
            dataIndex: ['undirectCommission', 'total'],
            title: t('reference:referral.total_indirect_commissions'),
            align: 'right',
            width: 230,
            render: (data, item) => {
                return renderCommissionData(item, 'undirectCommission')
            }
        }]
        return <TableV2
            // sort
            // defaultSort={{ key: 'code', direction: 'desc' }}
            loading={loading}
            useRowHover
            data={dataSource.results || []}
            columns={columns}
            rowKey={(item) => `${item?.key}`}
            scroll={{ x: true }}
            limit={limit}
            skip={0}
            // isSearch={!!state.search}
            pagingClassName="border-none"
            height={350}
            pagingPrevNext={{
                page: page - 1,
                hasNext: dataSource?.results?.length ? dataSource?.results?.length === limit : false,
                onChangeNextPrev: (delta) => {
                    setPage(page + delta);
                },
                language: language
            }}
            tableStyle={{ fontSize: '16px', padding: '16px' }}
        />
        // Case paginatioin 1 2 3 4 ... 

        // return <TableV2
        //     sort
        //     defaultSort={{ key: 'code', direction: 'desc' }}
        //     useRowHover
        //     data={dataSource?.results || []}
        //     page={page}
        //     onChangePage={page => setPage(page)}
        //     total={dataSource?.total ?? 0}
        //     columns={columns}
        //     rowKey={(item) => item?.key}
        //     scroll={{ x: true }}
        //     limit={limit}
        //     skip={0}
        //     noBorder={true}
        //     // isSearch={!!state.search}
        //     height={404}
        //     pagingClassName="border-none"
        //     className="border-t border-divider dark:border-divider-dark pt-4 mt-8"
        //     tableStyle={{ fontSize: '16px', padding: '16px' }}
        //     paginationProps={{
        //         hide: true,
        //         current: 0,
        //         pageSize: limit,
        //         onChange: null
        //     }}
        // />
    }, [dataSource, loading])

    return (
        <div className='flex w-full' id={id}>
            <ModalCommissionFriend
                owner={owner}
                refs={refs}
                t={t} commissionConfig={commissionConfig}
                friend={commissionByFriendDetail}
                onClose={() => setCommissionByFriendDetail(null)}
            />
            <div
                className='w-full bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-xl py-8'>
                <div className='font-semibold text-[22px] leading-7 mx-6 mb-8'>
                    {t('reference:referral.friend_list')}
                </div>
                <div className='flex gap-6 flex-wrap mx-6 mb-6  items-end'>
                    <TableFilter filters={filters} filter={filter} setFilter={setFilter} />
                </div>

                {renderTable()}
            </div>
        </div>
    );
};

export default FriendList;
