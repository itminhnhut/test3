import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { TableFilter } from '.';

import dynamic from 'next/dynamic';

import TagV2 from 'components/common/V2/TagV2';
import Tooltip from 'components/common/Tooltip';
import TableV2 from 'components/common/V2/TableV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TextCopyable from 'components/screens/Account/TextCopyable';

import FetchApi from 'utils/fetch-api';
import { assetCodeFromId } from 'utils/reference-utils';

import { KYC_STATUS } from 'redux/actions/const';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { API_GET_LIST_FRIENDS, API_GET_REFERRAL_FRIENDS_BY_CODE } from 'redux/actions/apis';

import { ExportIcon } from 'components/common/Icons';
import { isValid } from 'date-fns';
import classNames from 'classnames';

const ModalFriendDetail = dynamic(() => import('./Components/ModalFriendDetail'), { ssr: false });
const BreadCrumbs = dynamic(() => import('./Components/BreadCrumbs'), { ssr: false });

const NoKYCTag = ({ t }) => <TagV2 className="whitespace-nowrap">{t('reference:referral.not_kyc')}</TagV2>;

// const KYCPendingTag = ({ t }) => <TagV2 className="whitespace-nowrap type="warning">{t('reference:referral.pending_kyc')}</TagV2>;
const KYCApprovedTag = ({ t }) => (
    <TagV2 className="whitespace-nowrap text-green-3 dark:text-teal" type="success">
        {t('reference:referral.kyc')}
    </TagV2>
);

const DEFAULT_TOKENS = [
    {
        value: 1,
        title: 'NAMI'
    },
    {
        value: 22,
        title: 'USDT'
    },
    {
        value: 72,
        title: 'VNDC'
    }
];

const BREADCRUMB = [
    {
        name: { en: 'Friends list F1', vi: 'Danh sách bạn bè F1' }
    },
    {
        name: { en: 'Nhóm F2', vi: 'Group F2' }
    },
    {
        name: { en: 'Nhóm F3', vi: 'Group F3' }
    },
    {
        name: { en: 'Nhóm F4', vi: 'Group F4' }
    }
];
const MAX_BREAD_CRUMB = 3;
const LIMIT = 10;

const FriendList = ({ language, t, id }) => {
    const rank = {
        1: t('reference:referral.normal'),
        2: t('reference:referral.official'),
        3: t('reference:referral.gold'),
        4: t('reference:referral.platinum'),
        5: t('reference:referral.diamond')
    };
    const tooltipCommission = {
        commission: t('reference:table.tooltip.commission'),
        commission_indirect: t('reference:table.tooltip.commission_indirect')
    };
    const filters = {
        introduced_on: {
            type: 'dateRange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            label: t('reference:friend_list.filter.referral_date'),
            title: t('reference:friend_list.filter.referral_date'),
            position: 'left',
            childClassName: 'min-w-[240px]'
        },
        total_commissions: {
            type: 'dateRange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            label: t('reference:friend_list.filter.total_commissions'),
            title: t('reference:friend_list.filter.total_commissions'),
            childClassName: 'min-w-[240px]'
        },
        search: {
            type: 'input',
            value: null,
            title: t('reference:friend_list.filter.search_id'),
            label: t('reference:friend_list.filter.search_id'),
            placeholder: t('reference:friend_list.filter.placeholder_search'),
            childClassName: 'max-w-[240px]'
        },
        reset: {
            type: 'reset',
            label: '',
            title: t('reference:friend_list.filter.reset')
        }
    };
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState(filters);
    const [dataSource, setDataSource] = useState({
        results: [],
        hasNext: false,
        total: 0,
        go_next: true
    });

    const [isModalDetail, setIsModalDetail] = useState(false);
    const [options, setOptions] = useState({
        commission: 0,
        orderVol: 0
    });

    const [levelFriend, setLevelFriend] = useState(0);
    const [parentCode, setParentCode] = useState(null);
    const [detailFriend, setDetailFriend] = useState({});

    const formatDate = (value, type) => {
        if (type === 'startDate') return value?.startDate ? new Date(value?.startDate).getTime() : null;
        if (type === 'endDate') return value?.endDate ? new Date(value?.endDate).getTime() + 86400000 : null;
    };

    const getListFriends = _.throttle(async () => {
        const { introduced_on, total_commissions, status, search } = filter || {};
        const params = {
            invitedAtFROM: formatDate(introduced_on?.value, 'startDate'),
            invitedAtTO: formatDate(introduced_on?.value, 'endDate'),
            from: formatDate(total_commissions?.value, 'startDate'),
            to: formatDate(total_commissions?.value, 'endDate'),
            kycStatus: status?.value,
            code: search?.value, //Tìm theo Nami ID,
            ...(parentCode && { parentCode })
        };
        try {
            setLoading(true);
            const { data } = await FetchApi({
                url: API_GET_LIST_FRIENDS,
                params: {
                    ...params,
                    limit: LIMIT,
                    skip: LIMIT * (page - 1)
                }
            });
            if (data) {
                setDataSource(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, 300);

    const breadcrumbs = useMemo(() => {
        const path = dataSource?.path || [];
        if (path?.length > 0 && path?.length - 1 !== levelFriend) {
            setLevelFriend(path?.length - 1);
        }
        return levelFriend > 0
            ? BREADCRUMB?.map((value, key) => {
                  if (path?.[key] && key > 0) {
                      value['parentCode'] = path[key];
                  }
                  return value;
              })
            : [];
    }, [dataSource, levelFriend]);

    useEffect(() => {
        setPage(1);
        if (page === 1) {
            getListFriends();
        }
    }, [filter]);

    useEffect(() => {
        getListFriends();
    }, [page, parentCode]);

    const toggleDetail = () => setIsModalDetail(!isModalDetail);

    const handleDetailFriend = async (row) => {
        try {
            const { data, status } = await FetchApi({
                url: API_GET_REFERRAL_FRIENDS_BY_CODE.replace(':code', row?.code)
            });
            if (status === 'ok') {
                const { name = '', code = '' } = row;
                setDetailFriend({ ...data, name, code });
            }
        } catch (err) {
            console.error(err);
        }
        const defaultOption = DEFAULT_TOKENS?.[DEFAULT_TOKENS.length - 1]?.value;
        toggleDetail();
        setOptions({ commission: defaultOption, orderVol: defaultOption });
    };

    const handleFriendLevel = (row, active) => {
        if (active) return;
        setLevelFriend((prev) => prev + 1);
        setParentCode(row?.code);
        handleResetSearchByCode();
    };

    const handleResetSearchByCode = () => {
        if (filter?.search?.value?.length > 0) {
            setFilter((prev) => ({ ...prev, search: { ...filter?.search, value: null } }));
        }
    };

    const handleResetParentCode = () => {
        setParentCode(null);
    };

    const handleChangeOption = (e, type) => {
        setOptions((prev) => ({ ...prev, [type]: e }));
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'name',
                dataIndex: 'name',
                title: t('reference:table.name'),
                align: 'left',
                width: 220,
                render: (value) => value || '_'
            },
            {
                key: 'code',
                dataIndex: 'code',
                title: t('reference:table.id'),
                align: 'left',
                width: 220,
                render: (value) => (
                    <div className="flex flex-row whitespace-normal">
                        <TextCopyable text={value} />
                    </div>
                )
            },
            {
                key: 'invitedAt',
                dataIndex: 'invitedAt',
                title: t('reference:table.referral_date'),
                align: 'left',
                width: 180,
                render: (value) => <div className="font-normal">{value && isValid(new Date(value)) ? formatTime(new Date(value), 'dd/MM/yyyy') : null}</div>
            },
            {
                key: 'rank',
                dataIndex: 'rank',
                title: t('reference:table.ranking'),
                align: 'left',
                width: 120,
                render: (value) => <div className="font-normal">{rank[value?.toString() ?? '0']}</div>
            },
            {
                key: 'kyc_status',
                dataIndex: 'kyc_status',
                title: t('reference:table.status'),
                align: 'left',
                width: 150,
                render: (value) => (value === 2 ? <KYCApprovedTag t={t} /> : <NoKYCTag t={t} />)
                // return {
                //     [KYC_STATUS.NO_KYC]: <NoKYCTag t={t} />,
                //     [KYC_STATUS.PENDING_APPROVAL]: <KYCPendingTag t={t} />,
                //     [KYC_STATUS.APPROVED]: <KYCApprovedTag t={t} />
                // }[value];
            },
            {
                key: 'user_count',
                dataIndex: 'user_count',
                title: t('reference:table.referred'),
                align: 'left',
                width: 120,
                render: (value) => `${formatNumber(value || 0, 2)} ${t('reference:table.friends')}`
            },
            {
                key: 'commission.total',
                dataIndex: ['commission', 'total'],
                title: t('reference:table.direct_commission'),
                align: 'right',
                width: 230,
                render: (value, row) => renderCommissionData(row, 'commission')
            },
            {
                key: 'commission_indirect.total',
                dataIndex: ['commission_indirect', 'total'],
                title: t('reference:table.network_commission'),
                align: 'right',
                width: 230,
                render: (value, row) => renderCommissionData(row, 'commission_indirect')
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                title: '',
                width: 180,
                fixed: 'right',
                render: (value, row) => {
                    const isNotActive = levelFriend >= MAX_BREAD_CRUMB || row?.user_count === 0 || !dataSource?.go_next;
                    return (
                        <div
                            className={classNames('dark:text-green-2 text-green-3 font-semibold flex flex-row px-[18px] whitespace-nowrap items-center', {
                                'justify-between': levelFriend < MAX_BREAD_CRUMB
                            })}
                        >
                            <div onClick={() => handleDetailFriend(row)}>{t('reference:table.detail')}</div>
                            <hr className="h-7 w-[1px] border-[1px] border-solid dark:border-[#222940] border-[#dcdfe6] mx-3" />
                            <div
                                className={classNames({
                                    'dark:text-green-7 text-gray-1': isNotActive
                                })}
                                onClick={() => handleFriendLevel(row, isNotActive)}
                            >
                                {t('reference:table.friends')}
                            </div>
                        </div>
                    );
                }
            }
        ];

        return (
            <TableV2
                skip={0}
                useRowHover
                height={350}
                limit={LIMIT}
                className="z-10 rc-table-friendList"
                loading={loading}
                columns={columns}
                scroll={{ x: true }}
                pagingClassName="border-none"
                data={dataSource.results || []}
                rowKey={(item) => `${item?.key}`}
                pagingPrevNext={{
                    page: page - 1,
                    hasNext: dataSource?.hasNext,
                    onChangeNextPrev: (delta) => {
                        setPage(page + delta);
                    },
                    language: language
                }}
            />
        );
    }, [dataSource, loading, breadcrumbs]);

    const handleBreadCrumb = (value, key) => {
        setLevelFriend(key);
        setParentCode(value?.parentCode || null);
        handleResetSearchByCode();
    };

    const handleTotal = (data, assetId, type) => {
        return assetId === 22 ? formatNumber(data?.[type]?.[assetId], 4) : formatNumber(data?.[type]?.[assetId], 0);
    };

    const renderCommissionData = (data, type = 'commission') => {
        return (
            <div>
                <p className="text-green-3 relative dark:text-teal inline-block font-semibold nami-underline-dotted" data-tip="" data-for={type + data?.code}>
                    ~ {formatNumber(data?.[type]?.total)} {data?.symbol} VNDC
                </p>
                <Tooltip offset={{ top: 18 }} id={type + data?.code} place="top" effect="solid" className={`max-w-[220px]`} isV3>
                    <div className="w-full">
                        <div className="mb-4 text-white dark:text-txtSecondary-dark text-center text-xs">
                            {/* {t('reference:referral.total_direct_commissions')} */}
                            {tooltipCommission[type]}
                        </div>
                        <div className="space-y-1 text-sm">
                            {[72, 22, 1].map((assetId) => {
                                return (
                                    <div key={assetId} className="flex items-center justify-between">
                                        <span className="text-white">{handleTotal(data, assetId, type)}</span>
                                        <span className="text-white dark:text-txtSecondary-dark ml-2">{assetCodeFromId(assetId)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Tooltip>
            </div>
        );
    };

    return (
        <div className="flex w-full" id={id}>
            <ModalFriendDetail
                t={t}
                language={language}
                options={options}
                level={levelFriend}
                toggle={toggleDetail}
                isModal={isModalDetail}
                detailFriend={detailFriend}
                defaultOption={DEFAULT_TOKENS}
                onChangeOption={handleChangeOption}
            />
            <div className="w-full bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-xl py-8">
                {/* <div className="font-semibold text-[22px] leading-7 mx-6 mb-8">{t('reference:referral.friend_list')}</div> */}
                <BreadCrumbs
                    t={t}
                    level={levelFriend}
                    parentName={dataSource?.parent_name || ''}
                    breadcrumbs={breadcrumbs}
                    onChangeBreadCrumb={handleBreadCrumb}
                    language={language}
                />
                <div className="flex gap-6 flex-wrap mx-6 mb-6 items-end justify-between">
                    <div className="flex justify-between gap-4">
                        <TableFilter config={filters} filter={filter} setFilter={setFilter} resetParentCode={handleResetParentCode} />
                    </div>
                    <ButtonV2
                        className="hidden w-[122px] whitespace-nowrap hover:bg-gray-12 bg-dark-12 dark:bg-dark-2 dark:hover:bg-dark-5 dark:text-gray-7
                        px-4 rounded-md px-auto py-auto font-semibold h-12"
                    >
                        <ExportIcon />
                        <span className="ml-2">{t('reference:friend_list.filter.export')}</span>
                    </ButtonV2>
                </div>
                {renderTable()}
            </div>
        </div>
    );
};

export default FriendList;
