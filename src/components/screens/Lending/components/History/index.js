import { useState, useEffect } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import Chip from 'components/common/V2/Chip';

// * Context
import { useAuth } from 'components/screens/Lending/Context';

// ** Redux
import { API_HISTORY_LOAN } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Hooks
import useMemoizeArgs from 'hooks/useMemoizeArgs';

// ** Constants
import { HISTORY_TAB } from 'components/screens/Lending/constants';

// ** Third party
import pickBy from 'lodash/pickBy';

import { STATUS_VI, STATUS_EN, MILLISECOND } from 'components/screens/Lending/constants';

// ** dynamic
const HistoryTable = dynamic(() => import('./Table'), { ssr: false });
const NotAuth = dynamic(() => import('components/screens/Lending/components/NotAuth'), { ssr: false });

const initState = {
    tab: 'loan',
    page: 1,
    loading: false,
    data: {},
    filter: { status: 'CLOSED', limit: 10, from: null, to: null, loanCoin: null, collateralCoin: null },
    filters: {
        time: {
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null
        },
        status: {
            key: 'status',
            value: 'CLOSED'
        },
        loanCoin: {
            key: 'loanCoin',
            value: null
        },
        collateralCoin: {
            key: 'collateralCoin',
            value: null
        }
    }
};

const TAB_STATUS = { info: 'CLOSED', reject: 'LIQUIDATED' };

const History = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const filters = {
        time: {
            key: 'time',
            type: 'dateRange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            title: t('lending:history:table:time'),
            position: 'left'
        },
        status: {
            key: 'status',
            type: 'select',
            value: null,
            values: language === 'en' ? STATUS_EN : STATUS_VI,
            title: t('lending:history:table:status'),
            childClassName: 'text-sm !text-gray-15 dark:!text-gray-7'
        },
        loanCoin: {
            key: 'loanCoin',
            type: 'select_assets',
            value: null,
            assetCode: 'collateralCoin',
            title: t('lending:history:table:loan_asset')
        },
        collateralCoin: {
            assetCode: 'loanCoin',
            key: 'collateralCoin',
            type: 'select_assets',
            value: null,
            title: t('lending:history:table:margin_asset')
        },
        reset: {
            type: 'reset',
            label: '',
            title: t('lending:history:table:reset'),
            buttonClassName: '!h-12 !text-gray-1 dark:!text-gray-7 font-semibold text-base !w-[250px]'
        }
    };

    const isAuth = useAuth();

    // ** useState
    const [tab, setTab] = useState(initState.tab);
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [isLoading, setIsLoading] = useState(initState.loading);
    const [filter, setFilter] = useState(initState.filter);

    // ** useState
    useEffect(() => {
        const id = setTimeout(() => getOrderLoan(), 500);
        return () => clearTimeout(id);
    }, [useMemoizeArgs(filter), tab]);

    useEffect(() => {
        const isEqual = JSON.stringify(initState.filters) === JSON.stringify(filter);
        if (!isEqual) {
            setFilter(initState.filter);
        }
    }, [tab]);

    // ** handle format date
    const formatDate = (value, type) => {
        if (type === 'startDate') return value?.startDate ? new Date(value?.startDate).getTime() : null;
        if (type === 'endDate') return value?.endDate ? new Date(value?.endDate).getTime() + 86400000 - MILLISECOND : null;
    };
    // ** handle API
    const getOrderLoan = async () => {
        try {
            setIsLoading(true);
            const { data } = await FetchApi({
                url: API_HISTORY_LOAN,
                params: {
                    ...pickBy(filter, (value, key) => value !== '' && key !== 'time'),
                    collateralCoin: filter?.collateralCoin?.assetCode,
                    loanCoin: filter?.loanCoin?.assetCode,
                    from: formatDate(filter?.time, 'startDate'),
                    to: formatDate(filter?.time, 'endDate'),
                    status: TAB_STATUS?.[filter.status] || 'CLOSED'
                }
            });

            if (data) {
                setData(data);
            }
        } catch (error) {
            throw new Error('handle api history order loan');
        } finally {
            setIsLoading(false);
        }
    };

    // ** handle
    const handleChangeTab = (tab) => {
        setTab(tab);
    };

    const handleChangeFilter = (value, key) => {
        if (key === 'loanCoin' || key === 'collateralCoin') {
            setFilter((prev) => ({ ...prev, [key]: !value?.assetName ? null : { assetName: value?.assetName, assetCode: value?.assetCode } }));
        } else {
            setFilter((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleResetFilter = () => setFilter(initState.filter);

    // ** render
    const renderTabs = () => {
        return HISTORY_TAB.map((item) => {
            const isActive = item.key === tab;
            return (
                <Chip onClick={() => handleChangeTab(item.key)} selected={isActive} key={`tab_${item.title?.[language]}`}>
                    {item.title?.[language]}
                </Chip>
            );
        });
    };

    return (
        <>
            {!isAuth ? (
                <NotAuth />
            ) : (
                <section>
                    <section className="flex flex-row gap-3 mt-8">{renderTabs()}</section>
                    <section className="mt-8">
                        <HistoryTable
                            data={data}
                            page={page}
                            tab={tab}
                            filter={filter}
                            onPage={setPage}
                            configFilter={filters}
                            loading={isLoading}
                            onFilter={handleChangeFilter}
                            onReset={handleResetFilter}
                        />
                    </section>
                </section>
            )}
        </>
    );
};
export default History;
