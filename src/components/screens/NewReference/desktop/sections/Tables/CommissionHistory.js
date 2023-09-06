import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { TableFilter } from '.';
import { API_GET_COMMISSON_HISTORY } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { WalletCurrency } from 'components/screens/OnusWithdrawGate/helper';
import _ from 'lodash';
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';
import styled from 'styled-components';

const MILLISECOND = 1;

const CommissionHistory = ({ t, commisionConfig, id }) => {
    const levelTabs = [
        { title: t('common:all'), value: null },
        { title: '1', value: 1 },
        { title: '2', value: 2 },
        { title: '3', value: 3 },
        { title: '4', value: 4 }
    ];
    const typeTabs = [
        { title: t('common:all'), value: null },
        { title: 'Spot', value: 'SPOT' },
        { title: 'Futures', value: 'FUTURES' },
        { title: 'Stake', value: 'STAKING' },
        { title: 'Insurance', value: 'INSURANCE' }
    ];
    const assetTabs = [
        { title: t('common:all'), value: null },
        { title: 'VNST', value: WalletCurrency.VNST },
        { title: 'VNDC', value: WalletCurrency.VNDC },
        { title: 'NAO', value: WalletCurrency.NAO },
        { title: 'NAMI', value: WalletCurrency.NAMI },
        { title: 'ONUS', value: WalletCurrency.ONUS },
        { title: 'USDT', value: WalletCurrency.USDT }
    ];

    const filters = {
        date: {
            type: 'dateRange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            label: t('reference:friend_list.filter.referral_date'),
            position: 'left',
            wrapperDate: '!text-gray-15 dark:!text-gray-4'
        },
        level: {
            type: 'select',
            value: null,
            values: levelTabs,
            label: t('reference:referral.level'),
            title: t('reference:referral.level'),
            childClassName: 'text-sm !text-gray-15 dark:!text-gray-7'
        },
        commission_type: {
            type: 'select',
            value: null,
            values: typeTabs,
            label: t('reference:referral.commission_type'),
            childClassName: 'text-sm !text-gray-15 dark:!text-gray-7'
        },
        asset_type: {
            type: 'select',
            value: null,
            values: assetTabs,
            label: t('reference:referral.asset_type'),
            childClassName: 'text-sm !text-gray-15 dark:!text-gray-7'
        },
        reset: {
            type: 'reset',
            title: t('reference:friend_list.filter.reset'),
            buttonClassName: '!h-11 !text-gray-15 dark:!text-gray-7 font-semibold text-base',
            childClassName: 'justify-end'
        }
    };
    const limit = 10;
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState(filters);
    const [dataSource, setDataSource] = useState({
        results: [],
        hasNext: false,
        total: 0
    });

    const formatDate = (value, type) => {
        if (type === 'startDate') return value?.startDate ? new Date(value?.startDate).getTime() : null;
        if (type === 'endDate') return value?.endDate ? new Date(value?.endDate).getTime() + 86400000 - MILLISECOND : null;
    };

    const getCommissionHistory = _.throttle(async () => {
        const { date } = filter || {};

        const params = {
            invitedAtFROM: formatDate(date?.value, 'startDate'),
            invitedAtTO: formatDate(date?.value, 'endDate'),
            kind: filter?.commission_type?.value,
            level: filter?.level?.value,
            currency: filter?.asset_type?.value
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
        getCommissionHistory();
    }, [page]);

    useEffect(() => {
        setPage(1);
        if (page === 1) {
            getCommissionHistory();
        }
    }, [filter]);

    const columns = useMemo(
        () => [
            {
                key: 'createdAt',
                dataIndex: 'createdAt',
                title: t('reference:referral.date'),
                align: 'left',
                width: 200,
                fixed: 'left',
                render: (data) => formatTime(data, 'dd/MM/yyyy HH:mm:ss')
            },
            {
                key: 'level',
                dataIndex: 'level',
                title: t('reference:referral.level'),
                align: 'left',
                width: 100,
                render: (data) => <div>{`F${data}`}</div>
            },
            {
                key: 'kind',
                dataIndex: 'kind',
                title: t('reference:referral.commission_type'),
                align: 'left',
                width: 160,
                sorter: false,
                render: (data) => typeTabs.find((rs) => rs.value === data)?.title
            },
            {
                key: 'currency',
                dataIndex: 'currency',
                title: t('reference:referral.asset_type'),
                align: 'left',
                width: 150,
                sorter: false,
                render: (data) => (
                    <div className="flex items-center gap-2">
                        <AssetLogo size={36} assetId={data} />
                        <div>{assetTabs.find((e) => e.value === data)?.title}</div>
                    </div>
                )
            },
            {
                key: 'value',
                dataIndex: 'value',
                title: t('reference:referral.total_commissions'),
                align: 'right',
                width: 183,
                sorter: false,
                render: (data, item) => {
                    const value = data < 0 ? 0 : `+ ${formatNumber(data, 4)}`;
                    return (
                        <span className="text-teal">
                            {value} {assetTabs.find((e) => e.value === item.currency)?.title}
                        </span>
                    );
                }
            }
        ],
        [dataSource]
    );

    return (
        <div className="flex w-full" id={id}>
            <div className="w-full bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-xl py-8">
                <div className="mb-8 mx-6 text-gray-15 dark:text-gray-4 font-semibold text-2xl">{t('reference:tabs.commission_histories')}</div>
                <div className="flex gap-6 flex-wrap mx-6 mb-8 items-end justify-between">
                    <WrapperFilter className="grid w-full gap-x-6">
                        <TableFilter filter={filter} config={filters} type="history" setFilter={setFilter} />
                    </WrapperFilter>
                </div>

                <TableV2
                    loading={loading}
                    useRowHover
                    data={dataSource?.results || []}
                    page={page}
                    onChangePage={(page) => setPage(page)}
                    total={dataSource?.total ?? 0}
                    columns={columns}
                    rowKey={(item) => item?.key}
                    scroll={{ x: true }}
                    limit={limit}
                    skip={0}
                    noBorder={true}
                    height={404}
                    pagingClassName="border-none"
                    className="border-t border-divider dark:border-divider-dark pt-4 mt-8"
                    tableStyle={{ fontSize: '16px', padding: '16px' }}
                    paginationProps={{
                        hide: true,
                        current: 0,
                        pageSize: limit,
                        onChange: null
                    }}
                />
            </div>
        </div>
    );
};

const WrapperFilter = styled.div.attrs(({ className }) => ({
    className: className
}))`
    grid-template-columns: 250px repeat(auto-fit, minmax(calc((100% - 100px) / 5), 1fr)) 83px;
`;

export default CommissionHistory;
