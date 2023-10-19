import { useState, useEffect } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

// ** components
import Chip from 'components/common/V2/Chip';

// * Context
import { useAuth } from 'components/screens/Lending/context';

// ** Redux
import { API_HISTORY_LOAN, API_HISTORY_LOAN_ADJUST } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Constants
import { STATUS_VI, STATUS_EN, MILLISECOND, HISTORY_TAB, LIMIT, ALLOW_ADJUST } from 'components/screens/Lending/constants';

// ** Third party
import pickBy from 'lodash/pickBy';

// ** dynamic
const HistoryTable = dynamic(() => import('./Table'), { ssr: false });
const NotAuth = dynamic(() => import('components/screens/Lending/components/NotAuth'), { ssr: false });

const initState = {
    tab: null,
    page: 1,
    loading: false,
    data: {},
    // filter: { status: 'REPAID', time: { from: null, to: null }, loanCoin: null, collateralCoin: null },
    default_filters: {
        time: {
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            }
        },
        status: 'REPAID',
        loanCoin: null,
        collateralCoin: null
    },
    isEmptyData: true
};

const TAB_LOAN = 'loan';
const NOT_ALLOW = ['time', 'action', 'status'];
const TAB_STATUS = { adjust: 'ADJUST_MARGIN', repay: 'REPAY' };

const History = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useRouter
    const router = useRouter();

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
    const [filter, setFilter] = useState(initState.default_filters);

    // ** useState
    useEffect(() => {
        if (!tab || !isAuth) return;
        getOrderLoan();
    }, [JSON.stringify(filter), tab, page]);

    useEffect(() => {
        if (!tab) return;
        setFilter(initState.default_filters);
        setPage(initState.page);
    }, [tab]);

    useEffect(() => {
        const { action = TAB_LOAN } = router.query;
        if (action !== tab) {
            setTab(action);
        }
    }, [router.query]);

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
                url: ALLOW_ADJUST?.includes(tab) ? API_HISTORY_LOAN_ADJUST : API_HISTORY_LOAN,
                params: {
                    ...pickBy(filter, (value, key) => value !== '' && !NOT_ALLOW.includes(key)),
                    collateralCoin: filter?.collateralCoin?.assetCode,
                    loanCoin: filter?.loanCoin?.assetCode,
                    from: formatDate(filter?.time?.value, 'startDate'),
                    to: formatDate(filter?.time?.value, 'endDate'),
                    limit: LIMIT,
                    skip: (page - 1) * LIMIT,
                    ...(ALLOW_ADJUST?.includes(tab) ? { action: TAB_STATUS?.[tab] } : { status: tab === 'reject' ? 'LIQUIDATED' : filter?.status })
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

    // ** handle change tab
    const handleChangeTab = (tab) => {
        const { action = initState.tab } = router.query;
        if (action) {
            router.push(
                {
                    pathname: router.pathname,
                    query: {
                        tab: 'history',
                        action: tab
                    }
                },
                router.pathname,
                { scroll: false }
            );
        } else {
            setTab(tab || TAB_LOAN);
        }
    };

    //** handle on change filter
    const handleChangeFilter = (value, key) => {
        if (key === 'loanCoin' || key === 'collateralCoin') {
            setFilter((prev) => ({ ...prev, [key]: !value?.assetName ? null : { assetName: value?.assetName, assetCode: value?.assetCode, id: value?.id } }));
        } else {
            setFilter((prev) => ({ ...prev, [key]: value }));
        }
        setPage(initState.page);
    };

    // ** handle reset filter
    const handleResetFilter = () => setFilter(initState.default_filters);

    // ** render
    const renderTabs = () => {
        return HISTORY_TAB.map((item) => {
            const isActive = item.key === tab;
            return (
                <Chip
                    className="dark:!bg-dark-4 bg-dark-12"
                    onClick={() => handleChangeTab(item.key)}
                    selected={isActive}
                    key={`tab_${item.title?.[language]}`}
                >
                    {item.title?.[language]}
                </Chip>
            );
        });
    };

    return (
        <>
            {!isAuth ? (
                <NotAuth tab="history" />
            ) : (
                <section>
                    <section className="flex flex-row gap-3 mt-8">{renderTabs()}</section>
                    <section className="mt-8">
                        <HistoryTable
                            tab={tab}
                            data={data}
                            page={page}
                            filter={filter}
                            onPage={setPage}
                            loading={isLoading}
                            configFilter={filters}
                            onReset={handleResetFilter}
                            onFilter={handleChangeFilter}
                        />
                    </section>
                </section>
            )}
        </>
    );
};
export default History;
