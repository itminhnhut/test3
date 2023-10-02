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

const columns = [
    {
        title: '',
        dataIndex: 'type',
        key: 'type',
        width: 'auto',
        align: 'left'
    },
    {
        title: '',
        dataIndex: 'time',
        key: 'time',
        width: 'auto',
        align: 'left'
    },
    {
        title: '',
        dataIndex: 'asset',
        key: 'asset',
        width: 'auto',
        align: 'left'
    },
    {
        title: '',
        dataIndex: 'pool',
        key: 'pool',
        width: 'auto',
        align: 'left'
    },
    {
        title: '',
        dataIndex: 'period',
        key: 'period',
        width: 'auto',
        align: 'left'
    }
];
const PAGE_SIZE = 10;

const TxTypeToEnum = {
    deposit: 0,
    redeem: 1,
    daily_rewards: 2,
    claim_rewards: 3
};

const Cell = ({ asset = '', title, amount, children }) => {
    const assetInfo = getAssetFromCode(asset);
    return (
        <div className="flex space-x-2 items-center">
            {asset && (
                <div className="">
                    <AssetLogo assetCode={asset} size={30} />
                </div>
            )}
            <div className="">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">{title}</div>
                {amount ? (
                    <div className="font-semibold">
                        {formatNumber(amount, assetInfo?.assetDigit ?? 0)} {asset}
                    </div>
                ) : (
                    <div className="font-semibold">{children}</div>
                )}
            </div>
        </div>
    );
};

const HistorySection = ({ assetList, rewardList }) => {
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
    const configs = {
        type: {
            type: 'select',
            value: null,
            values: transactionTab,
            label: t('earn:history_table:type'),
            position: 'left',
            selectClassName: 'h-12'
        },
        time: {
            type: 'dateRange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            label: t('earn:history_table:time'),
            wrapperDate: '!text-gray-15 dark:!text-gray-4 !text-base'
        },
        asset: {
            type: 'assetFilter',
            value: null,
            values: null,
            label: t('earn:history_table:asset'),
            className: '!h-12 text-txtPrimary dark:text-txtPrimary-dark'
        },
        rewardAsset: {
            type: 'assetFilter',
            value: null,
            values: null,
            label: t('earn:history_table:reward_asset'),
            className: '!h-12 text-txtPrimary dark:text-txtPrimary-dark'
        },
        period: {
            type: 'select',
            value: null,
            values: periodTabs,
            label: t('earn:history_table:period'),
            selectClassName: 'h-12'
        },
        reset: {
            type: 'reset',
            title: t('common:reset'),
            buttonClassName: '!text-gray-15 dark:!text-gray-7 font-semibold text-base w-full',
            childClassName: 'justify-end'
        }
    };
    const [filter, setFilter] = useState(configs);
    const [page, setPage] = useState(0);



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
                from: +filter.time.value?.startDate ? filter.time.value.startDate / 1000 : null,
                to: +filter.time.value?.endDate ? filter.time.value.startDate / 1000 : null
            }
        },
        true,
        [page, filter]
    );

    const dataTable = useMemo(() => {
        const txs = data?.result || [];
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
        return txs.map((tx) => {
            const isRewardTx = [2, 3].includes(+tx.type);

            return {
                type: <Cell title={t('earn:history_table:type')}>{txTypeMap[tx.type]?.type}</Cell>,
                time: <Cell title={t('earn:history_table:time')}>{format(new Date(tx.createdAt), 'hh:mm dd/MM/yyyy')}</Cell>,
                asset: (
                    <Cell
                        title={txTypeMap[tx.type]?.amountTitle}
                        asset={isRewardTx ? tx.rewardAsset : tx.asset}
                        amount={isRewardTx ? tx.amount : tx.amountOrigin}
                    ></Cell>
                ),
                pool: (
                    <Cell title={t('earn:history_table:pool')} asset={tx.rewardAsset}>
                        {t('earn:history_table:pool_desc', { asset: tx.asset, reward: tx.rewardAsset })}
                    </Cell>
                ),
                period: <Cell title={t('earn:history_table:period')}>{`${tx.duration} ${tx.duration > 1 ? t('common:days') : t('common:day')}`}</Cell>
            };
        });
    }, [data?.result, t]);

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark rounded-xl mt-8 p-6">
            <div className="grid grid-cols-[repeat(2,minmax(0,2fr)),repeat(3,1fr),110px] w-full gap-x-3">
                <TableFilter config={configs} filter={filter} setFilter={setFilter} resetPagination={() => setPage(0)} />
                <div className="h-8"></div>
            </div>

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
                data={dataTable}
                emptyText={<NoData text={t('earn:table:no_data')} />}
                rowClassName="border-bottom"
                tableStyle={{
                    rowHeight: '96px',
                    fontSize: '1rem'
                }}
            />
        </div>
    );
};

export default HistorySection;
