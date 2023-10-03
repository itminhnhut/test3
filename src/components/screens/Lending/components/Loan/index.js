import { useState, useEffect, useMemo, useContext } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** Redux
import { API_HISTORY_LOAN, API_OVERVIEW_LOAN } from 'redux/actions/apis';

// ** Components
import Tooltip from 'components/common/Tooltip';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Redux
import { formatNumber } from 'src/redux/actions/utils';

// ** Constants
import { STATUS_CODE } from 'components/screens/Lending/constants';

// ** Hooks
import useMemoizeArgs from 'hooks/useMemoizeArgs';

// ** Context
import { getAssetConfig, useAuth, LendingContext } from 'components/screens/Lending/Context';
import { globalActionTypes as actions } from 'components/screens/Lending/Context/actions';

// ** Third party
import classNames from 'classnames';

// ** dynamic
const LoanTable = dynamic(() => import('./Table'), { ssr: false });
const NotAuth = dynamic(() => import('components/screens/Lending/components/NotAuth'), { ssr: false });

const ASSETS = [
    {
        asset: 'USD',
        nameTooltip: 'totalDebt',
        contentTooltip: { vi: 'ss', en: 'ss' },
        title: { vi: 'Thời gian xử lý trung bình', en: 'Thời gian xử lý trung bình' }
    },
    { title: { vi: 'Tổng giá trị tài sản ký quỹ', en: 'Tổng giá trị tài sản ký quỹ' }, asset: 'USD' }
];

// ** INIT STATE
const initState = {
    page: 1,
    loading: false,
    overview: { currency: 'USD' },
    loan: { status: 'ACTIVE', limit: 10 },
    data: {}
};

const Loan = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // ** useContext
    const isAuth = useAuth();
    const { dispatchReducer, state } = useContext(LendingContext);

    const isRefetch = state.isRefetch;

    // ** useState
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [overView, setOverView] = useState(initState.data);
    const [loading, setLoading] = useState(initState.loading);

    const handleAPI = () => {
        setLoading(true);
        const apiOverView = FetchApi({
            url: API_OVERVIEW_LOAN,
            params: {
                ...initState.overview
            },
            options: {
                method: 'GET'
            }
        });
        const apiLoanOrders = FetchApi({
            url: API_HISTORY_LOAN,
            params: {
                ...initState.loan
            },
            options: {
                method: 'GET'
            }
        });
        Promise.all([apiOverView, apiLoanOrders])
            .then((value) => {
                const [rsOverView, rsLoanOrders] = value;

                if (rsOverView.statusCode === STATUS_CODE) {
                    setOverView(rsOverView?.data || {});
                }
                if (rsLoanOrders.statusCode === STATUS_CODE) {
                    setData(rsLoanOrders?.data || {});
                }
            })
            .catch((err) => {
                throw new Error('handle api history order loan & overview', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    // ** useEffect
    useEffect(() => {
        handleAPI();
    }, []);

    useEffect(() => {
        if (isRefetch) {
            handleAPI();
            dispatchReducer({ type: actions.REFETCH });
        }
    }, [isRefetch]);

    // ** get asset by code
    const getAssetBycCode = useMemo(() => {
        return assetConfig?.find((f) => f.assetCode === overView?.currency);
    }, [useMemoizeArgs(overView)]);

    // ** total overview
    const totalOverview = useMemo(() => {
        const { debt = 0, collateral = 0 } = overView;
        return [debt, collateral];
    }, [useMemoizeArgs(overView)]);

    return (
        <>
            {!isAuth ? (
                <NotAuth />
            ) : (
                <section>
                    <h3 className="text-2xl font-semibold dark:text-gray-4 text-gray-15">Tổng quan tài sản</h3>
                    <section className="grid grid-cols-2 mt-8 gap-6 ">
                        {ASSETS?.map((item, key) => {
                            return (
                                <section className="dark:bg-dark-4 bg-white rounded-xl px-8 py-6" key={`loan_${key}_${item.title?.[language]}`}>
                                    <div
                                        data-tip={item?.nameTooltip ? item?.contentTooltip?.[language] : null}
                                        data-for={item?.nameTooltip || null}
                                        className={classNames('dark:text-gay-7 text-gray-1', {
                                            'border-b border-darkBlue-5 border-dashed cursor-pointer w-fit': item?.nameTooltip
                                        })}
                                    >
                                        {item.title?.[language]}
                                    </div>
                                    <section className="flex flex-row gap-1 mt-4 text-gray-15 text-2xl font-semibold dark:text-gray-4">
                                        <div>{formatNumber(totalOverview?.[key], getAssetBycCode?.assetDigit)}</div>
                                        <div>{overView.currency}</div>
                                    </section>
                                </section>
                            );
                        })}
                    </section>
                    <h4 className="mt-12 text-2xl font-semibold dark:text-gray-4 text-gray-15">Khoản vay đang mở</h4>
                    <section className="mt-8">
                        <LoanTable data={data} page={page} loading={loading} onPage={setPage} />
                    </section>
                    <Tooltip id={'totalDebt'} place="top" effect="solid" isV3 className="max-w-[300px]" />
                </section>
            )}
        </>
    );
};
export default Loan;
