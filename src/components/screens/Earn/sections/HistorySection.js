import React, { useEffect, useMemo, useState } from 'react';
import TableV2 from 'components/common/V2/TableV2';
import NoData from 'components/common/V2/TableV2/NoData';
import { useTranslation } from 'next-i18next';
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
import SelectV2 from 'components/common/V2/SelectV2';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import AssetFilter from 'components/screens/TransactionHistory/TransactionFilter/AssetFilter';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import CalendarIcon from 'components/svg/CalendarIcon';
import { X } from 'react-feather';

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const isNil = (x) => typeof x === 'undefined' || x === null;
const PAGE_SIZE = 10;

const TxTypeToEnum = {
    deposit: 0,
    redeem: 1,
    daily_rewards: 2,
    claim_rewards: 3
};
const defaultFilter = {
    type: null,
    time: null,
    asset: null,
    rewardAsset: null,
    period: null
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

    const transactionTabs = [
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
    const [filter, setFilter] = useState(defaultFilter);
    const [page, setPage] = useState(0);
    const auth = useSelector((state) => state.auth.user || null);
    const router = useRouter();
    const isDefaultFilter = Object.keys(defaultFilter).every((key) => isNil(filter[key]));

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
                asset: filter.asset?.assetCode || null,
                rewardAsset: filter.rewardAsset?.assetCode || null,
                duration: filter.period,
                type: filter.type ? TxTypeToEnum[filter.type] : null,
                from: +filter.time?.startDate ? +filter.time.startDate : null,
                to: +filter.time?.endDate ? +addDays(filter.time.endDate, 1) : null
            }
        },
        true,
        [page, filter]
    );

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark rounded-xl mt-8 py-6">
            {auth && (!isDefaultFilter || data?.result?.length || page !== 0) && (
                <>
                    <div className="v3:grid flex flex-wrap v3:grid-cols-[repeat(2,minmax(0,1.5fr)),repeat(3,1fr),110px] w-full gap-y-2 gap-x-3 px-6">
                        <div className="flex flex-col items-start w-[calc(50%-0.375rem)] v3:w-auto">
                            <div className={'text-txtSecondary dark:text-txtSecondary-dark mb-2 text-sm'}>{t('earn:history_table:type')}</div>
                            <SelectV2
                                name="customer"
                                keyExpr="value"
                                popoverPanelClassName="top-auto"
                                className="h-12"
                                value={filter.type}
                                options={transactionTabs}
                                popoverClassName="min-w-[240px] w-full"
                                onChange={(type) => setFilter((old) => ({ ...old, type }))}
                                activeIcon={<CheckCircleIcon color="currentColor" size={16} />}
                                wrapperClassName="flex flex-row gap-3 flex-col py-4"
                                optionClassName="flex flex-row items-center justify-between text-gray-1 dark:text-gray-4 text-base py-3 hover:bg-dark-13 dark:hover:bg-hover-dark"
                            />
                        </div>
                        <div className="flex flex-col items-start w-[calc(50%-0.375rem)] v3:w-auto">
                            <div className={'text-txtSecondary dark:text-txtSecondary-dark mb-2 text-sm'}>{t('earn:history_table:time')}</div>
                            <DatePickerV2
                                month={2}
                                hasShadow
                                initDate={filter.time}
                                wrapperClassname="!w-full !h-11"
                                colorX="#8694b2"
                                wrapperClassNameDate="!text-gray-15 dark:!text-gray-4 !text-base truncate w-full"
                                position={width >= 1216 ? 'center' : 'right'}
                                onChange={(e) => setFilter((old) => ({ ...old, time: e?.selection?.endDate ? e.selection : null }))}
                                text={
                                    <div className="relative py-3 px-3 flex items-center justify-between bg-gray-10 dark:bg-dark-2 rounded-md w-auto cursor-pointer">
                                        {filter.time ? (
                                            <>
                                                <span>
                                                    {filter.time?.startDate ? format(filter.time?.startDate, 'dd/MM/yyyy') : 'DD/MM/YYYY'} -{' '}
                                                    {filter.time?.endDate ? format(filter.time?.endDate, 'dd/MM/yyyy') : 'DD/MM/YYYY'}
                                                </span>
                                                <X
                                                    size={16}
                                                    color="#8694b2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFilter((old) => ({ ...old, time: null }));
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('common:global_btn:select_time')}</span>
                                                <CalendarIcon color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" />
                                            </>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                        <div className="flex flex-col items-start w-[calc(33.33%-3.25rem)] v3:w-auto">
                            <div className={'text-txtSecondary dark:text-txtSecondary-dark mb-2 text-sm'}>{t('earn:history_table:asset')}</div>
                            <AssetFilter
                                showLableIcon={false}
                                hasOptionAll={true}
                                title={t('earn:history_table:select_asset')}
                                asset={filter.asset}
                                labelClassName="hidden"
                                className="!h-12 text-txtPrimary dark:text-txtPrimary-dark"
                                setAsset={(asset) => setFilter((old) => ({ ...old, asset }))}
                            />
                        </div>
                        <div className="flex flex-col items-start w-[calc(33.33%-3.25rem)] v3:w-auto">
                            <div className={'text-txtSecondary dark:text-txtSecondary-dark mb-2 text-sm'}>{t('earn:history_table:reward_asset')}</div>
                            <AssetFilter
                                showLableIcon={false}
                                hasOptionAll={true}
                                title={t('earn:history_table:select_asset')}
                                asset={filter.rewardAsset}
                                labelClassName="hidden"
                                className="!h-12 text-txtPrimary dark:text-txtPrimary-dark"
                                setAsset={(asset) => setFilter((old) => ({ ...old, rewardAsset: asset }))}
                            />
                        </div>
                        <div className="flex flex-col items-start w-[calc(33.33%-3.25rem)] v3:w-auto">
                            <div className={'text-txtSecondary dark:text-txtSecondary-dark mb-2 text-sm'}>{t('earn:history_table:period')}</div>
                            <SelectV2
                                name="customer"
                                keyExpr="value"
                                popoverPanelClassName="top-auto"
                                className="h-12"
                                value={filter.period}
                                options={periodTabs}
                                popoverClassName="min-w-[240px] w-full"
                                onChange={(period) => setFilter((old) => ({ ...old, period }))}
                                activeIcon={<CheckCircleIcon color="currentColor" size={16} />}
                                wrapperClassName="flex flex-row gap-3 flex-col py-4"
                                optionClassName="flex flex-row items-center justify-between text-gray-1 dark:text-gray-4 text-base py-3 hover:bg-dark-13 dark:hover:bg-hover-dark"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-end !w-[7.5rem] v3:!w-auto v3:col-span-1">
                            <Button
                                onClick={() => setFilter(configs)}
                                variants="reset"
                                className="!text-gray-15 dark:!text-gray-7 font-semibold text-base w-full"
                            >
                                {t('common:reset')}
                            </Button>
                        </div>
                    </div>
                    <div className="h-8"></div>
                </>
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
                            <NoData text={t('earn:history_table:not_found')} />
                        ) : (
                            <NoData
                                className="py-3.5"
                                text={
                                    <>
                                        <div className="text-center">{t('earn:history_table:no_data')}</div>
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
                                textLoginToDo={t('earn:history_table:to_view')}
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
