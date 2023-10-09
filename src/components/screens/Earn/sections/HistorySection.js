import React, { useEffect, useMemo, useState } from 'react';
import TableV2 from 'components/common/V2/TableV2';
import NoData from 'components/common/V2/TableV2/NoData';
import { useTranslation } from 'next-i18next';
import { TableFilter } from 'components/screens/NewReference/desktop/sections/Tables';
import useFetchApi from 'hooks/useFetchApi';
import { API_HISTORY_EARN } from 'redux/actions/apis';
import { formatNumber } from 'utils/reference-utils';
import { getAssetFromCode } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import format from 'date-fns/format';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Button from 'components/common/V2/ButtonV2/Button';
import { useRouter } from 'next/router';
import { addDays } from 'date-fns';
import isValid from 'date-fns/isValid';
import { useWindowSize } from 'utils/customHooks';

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isNil = (x) => typeof x === 'undefined' || x === null;
const PAGE_SIZE = 10;

const TxTypeToEnum = {
    deposit: 0,
    redeem: 1,
    daily_rewards: 2,
    claim_rewards: 3
};

const Cell = ({ asset = '', title, amount, children }) => {
    const assetInfo = getAssetFromCode(asset);
    const hasAmount = !isNil(amount);

    return (
        <div className="flex space-x-2 items-center whitespace-nowrap">
            {asset && (
                <div className="">
                    <AssetLogo assetCode={asset} size={30} />
                </div>
            )}
            <div className="">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">{title}</div>
                {hasAmount ? (
                    <div className="font-semibold">
                        {formatNumber(amount ?? 0, assetInfo?.assetDigit ?? 0)} {asset}
                    </div>
                ) : (
                    <div className="font-semibold">{children}</div>
                )}
            </div>
        </div>
    );
};

const HistorySection = () => {
    const { t } = useTranslation();

    const transactionTab = [
        { title: t('common:all'), value: null },
        { title: t('earn:history_table:deposit'), value: 'deposit' },
        { title: t('earn:history_table:redeem'), value: 'redeem' },
        { title: t('earn:history_table:daily_rewards'), value: 'daily_rewards' },
        { title: t('earn:history_table:claim_rewards'), value: 'claim_rewards' }
    ];
    const periodTabs = [
        { title: t('common:all'), value: null },
        { title: `30 ${t('common:days')}`, value: 30 },
        { title: `60 ${t('common:days')}`, value: 60 },
        { title: `90 ${t('common:days')}`, value: 90 },
        { title: `120 ${t('common:days')}`, value: 120 }
    ];
    const { width } = useWindowSize();
    const configs = {
        type: {
            type: 'select',
            value: null,
            values: transactionTab,
            label: t('earn:history_table:type'),
            position: 'left',
            selectClassName: 'h-12',
            childClassName: '!w-[calc(50%-0.375rem)] v3:!w-auto v3:col-span-1'
        },
        time: {
            type: 'dateRange',
            value: undefined,
            values: null,
            label: t('earn:history_table:time'),
            wrapperDate: '!text-gray-15 dark:!text-gray-4 !text-base truncate w-full',
            position: width >= 1216 ? 'center' : 'right',
            childClassName: '!w-[calc(50%-0.375rem)] v3:!w-auto v3:col-span-1'
        },
        asset: {
            type: 'assetFilter',
            value: null,
            values: null,
            showLableIcon: false,
            hasOptionAll: true,
            title: t('earn:history_table:select_asset'),
            label: t('earn:history_table:asset'),
            className: '!h-12 text-txtPrimary dark:text-txtPrimary-dark',
            childClassName: '!w-[calc(33.33%-3.25rem)] v3:!w-auto v3:col-span-1'
        },
        rewardAsset: {
            type: 'assetFilter',
            value: null,
            values: null,
            showLableIcon: false,
            hasOptionAll: true,
            title: t('earn:history_table:select_reward'),
            label: t('earn:history_table:reward_asset'),
            className: '!h-12 text-txtPrimary dark:text-txtPrimary-dark',
            childClassName: '!w-[calc(33.33%-3.25rem)] v3:!w-auto v3:col-span-1'
        },
        period: {
            type: 'select',
            value: null,
            values: periodTabs,
            label: t('earn:history_table:period'),
            selectClassName: 'h-12',
            childClassName: '!w-[calc(33.33%-3.25rem)] v3:!w-auto v3:col-span-1'
        },
        reset: {
            type: 'reset',
            title: t('common:reset'),
            buttonClassName: '!text-gray-15 dark:!text-gray-7 font-semibold text-base w-full',
            childClassName: 'justify-end !w-[7.5rem] v3:!w-auto v3:col-span-1'
        }
    };
    const [filter, setFilter] = useState(configs);
    const [page, setPage] = useState(0);
    const auth = useSelector((state) => state.auth.user || null);
    const router = useRouter();
    const isDefaultFilter = Object.keys(configs).every((key) => isEqual(configs[key].value, filter[key].value));

    const columns = useMemo(() => {
        const txTypeMap = {
            0: {
                type: t('earn:history_table:deposit'),
                amountTitle: t('earn:history_table:deposit_amount')
            },
            1: {
                type: t('earn:history_table:redeem'),
                amountTitle: t('earn:history_table:redeem')
            },
            2: {
                type: t('earn:history_table:daily_rewards'),
                amountTitle: t('earn:history_table:daily_reward_amount')
            },
            3: {
                type: t('earn:history_table:claim_rewards'),
                amountTitle: t('earn:history_table:reward_amount')
            }
        };
        return [
            {
                title: '',
                dataIndex: 'type',
                key: 'type',
                width: 'auto',
                className: '',
                align: 'left',
                render: (data) => {
                    return <Cell title={t('earn:history_table:type')}>{txTypeMap[data]?.type}</Cell>;
                }
            },
            {
                title: '',
                dataIndex: 'createdAt',
                key: 'createdAt',
                width: 'auto',
                className: 'min-w-[180px]',
                align: 'left',
                render: (data) => {
                    const date = new Date(data);
                    return <Cell title={t('earn:history_table:time')}>{isValid(date) ? format(date, 'hh:mm:ss dd/MM/yyyy') : '--'}</Cell>;
                }
            },
            {
                title: '',
                dataIndex: 'asset',
                key: 'asset',
                width: 'auto',
                className: 'min-w-[11.25rem]',
                align: 'left',
                render: (data, tx) => {
                    const isRewardTx = [2, 3].includes(+tx.type);
                    return (
                        <Cell
                            title={txTypeMap[tx.type]?.amountTitle}
                            asset={isRewardTx ? tx.rewardAsset : tx.asset}
                            amount={isRewardTx ? tx.amount : tx.amountOrigin}
                        ></Cell>
                    );
                }
            },
            {
                title: '',
                dataIndex: 'pool',
                key: 'pool',
                width: 'auto',
                align: 'left',
                render: (data, tx) => {
                    return (
                        <Cell title={t('earn:history_table:pool')} asset={tx.rewardAsset}>
                            {t('earn:history_table:pool_desc', { asset: tx.asset, reward: tx.rewardAsset })}
                        </Cell>
                    );
                }
            },
            {
                title: '',
                dataIndex: 'duration',
                key: 'duration',
                width: 'auto',
                align: 'left',
                render: (data) => {
                    return <Cell title={t('earn:history_table:period')}>{`${data} ${data > 1 ? t('common:days') : t('common:day')}`}</Cell>;
                }
            }
        ];
    }, [t]);

    const { data, loading } = useFetchApi(
        {
            url: API_HISTORY_EARN,
            params: {
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                asset: filter.asset.value?.assetCode || null,
                rewardAsset: filter.rewardAsset.value?.assetCode || null,
                duration: filter.period.value,
                type: filter.type.value ? TxTypeToEnum[filter.type.value] : null,
                from: +filter.time.value?.startDate ? +filter.time.value.startDate : null,
                to: +filter.time.value?.endDate ? +addDays(filter.time.value.endDate, 1) : null
            }
        },
        true,
        [page, filter]
    );

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark rounded-xl mt-8 py-6">
            {auth && (!isDefaultFilter || data?.result?.length || page !== 0) && (
                <div className="v3:grid flex flex-wrap v3:grid-cols-[repeat(2,minmax(0,1.5fr)),repeat(3,1fr),110px] w-full gap-y-2 gap-x-3 px-6">
                    <TableFilter config={configs} filter={filter} setFilter={setFilter} resetPagination={() => setPage(0)} />
                    <div className="h-8"></div>
                </div>
            )}
            <TableWrapper>
                <TableV2
                    showHeader={false}
                    pagingPrevNext={{
                        page,
                        hasNext: data?.hasNext,
                        onChangeNextPrev: (offset) => setPage((old) => old + offset)
                    }}
                    showPaging={data?.hasNext || page !== 0}
                    loading={loading}
                    columns={columns}
                    data={data?.result || []}
                    emptyText={
                        !isDefaultFilter || data?.result?.length || page !== 0 ? (
                            <NoData text={t('earn:table:no_data')} />
                        ) : (
                            <NoData
                                className="py-3.5"
                                text={
                                    <>
                                        <div className="text-center">{t('earn:table:no_data')}</div>
                                        <Button
                                            className="mt-4 w-[11.75rem]"
                                            onClick={() =>
                                                router.replace(
                                                    {
                                                        query: {
                                                            ...router.query,
                                                            tab: 'pool'
                                                        }
                                                    },
                                                    null,
                                                    { shallow: true }
                                                )
                                            }
                                        >
                                            {t('earn:history_table:earn_now')}
                                        </Button>
                                    </>
                                }
                            />
                        )
                    }
                    rowClassName="border-bottom"
                    tableStyle={{
                        rowHeight: '96px',
                        fontSize: '1rem'
                    }}
                    height={96}
                />
            </TableWrapper>
        </div>
    );
};

const TableWrapper = styled('div')`
    .rc-table-expanded-row-fixed {
        min-height: 268px;
    }
`;

export default HistorySection;
