import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { TableFilter } from '.';
import { API_GET_COMMISSON_HISTORY } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import Skeletor from 'components/common/Skeletor';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { WalletCurrency } from 'components/screens/OnusWithdrawGate/helper';
import _ from 'lodash';
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';

// Start: Do api filter date range sai nen moi can cai qq nay :D
const timeZone = parseInt(new Date().getTimezoneOffset() / -60);
const addFromDate = 86400 * 1000 - 1000 * 60 * 60 * (24 - timeZone);
const addEndDate = 86400 * 1000 - 1000 * 60 * 60 * timeZone - 1;
// End: Do api filter date range sai nen moi can cai qq nay :D

const CommissionHistory = ({ t, commisionConfig, id }) => {
    // const assetConfig = useSelector(state => state.utils.assetConfig)
    const levelTabs = [
        { title: t('common:all'), value: null },
        { title: '1', value: 1 },
        { title: '2', value: 2 },
        { title: '3', value: 3 },
        { title: '4', value: 4 },
        { title: '5', value: 5 }
    ];
    const typeTabs = [
        { title: t('common:all'), value: null },
        { title: 'Spot', value: 'SPOT' },
        { title: 'Futures', value: 'FUTURES' },
        { title: 'Stake', value: 'STAKING' }
    ];
    const assetTabs = [
        { title: t('common:all'), value: null },
        { title: 'VNDC', value: WalletCurrency.VNDC },
        { title: 'NAO', value: WalletCurrency.NAO },
        { title: 'NAMI', value: WalletCurrency.NAMI },
        { title: 'ONUS', value: WalletCurrency.ONUS },
        { title: 'USDT', value: WalletCurrency.USDT }
    ];

    const filters = {
        date: {
            type: 'daterange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            title: t('reference:referral.date'),
            position: 'left',
            childClassName: 'min-w-[240px]'
        },
        level: {
            type: 'popover',
            value: null,
            values: levelTabs,
            title: t('reference:referral.level'),
            childClassName: 'flex-1'
        },
        commission_type: {
            type: 'popover',
            value: null,
            values: typeTabs,
            title: t('reference:referral.commission_type'),
            childClassName: 'flex-1'
        },
        asset_type: {
            type: 'popover',
            value: null,
            values: assetTabs,
            title: t('reference:referral.asset_type'),
            childClassName: 'flex-1'
        },
        reset: {
            type: 'reset'
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

    const getCommisionHistory = _.throttle(async () => {
        const params = {
            from: filter?.date?.value?.startDate ? new Date(filter?.date?.value?.startDate).getTime() + addFromDate : null,
            to: filter?.date?.value?.endDate ? new Date(filter?.date?.value?.endDate).getTime() + addEndDate : new Date().getTime(),
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
        getCommisionHistory();
    }, [page]);

    useEffect(() => {
        setPage(1);
        if (page === 1) {
            getCommisionHistory();
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
                <div className="font-semibold text-[22px] leading-7 mx-6 mb-8">{t('reference:tabs.commission_histories')}</div>
                <div className="flex gap-6 flex-wrap mx-6 mb-6">
                    <TableFilter filters={filters} filter={filter} setFilter={setFilter} />
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

export default CommissionHistory;

const ROW_SKELETON = {
    date: <Skeletor width={200} />,
    level: <Skeletor width={110} />,
    kind: <Skeletor width={90} />,
    currency: <Skeletor width={90} />,
    value: <Skeletor width={90} />
};
