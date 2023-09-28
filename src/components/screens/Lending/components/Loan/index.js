import { useState, useEffect, useMemo } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** Redux
import { API_HISTORY_LOAN, API_OVERVIEW_LOAN } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Redux
import { formatNumber } from 'src/redux/actions/utils';

// ** Constants
import { STATUS_CODE } from 'components/screens/Lending/constants';

// ** Hooks
import useMemoizeArgs from 'hooks/useMemoizeArgs';

// ** Context
import { getAssetConfig, useAuh } from 'components/screens/Lending/Context';

// ** dynamic
const LoanTable = dynamic(() => import('./Table'), { ssr: false });
const NotAuth = dynamic(() => import('components/screens/Lending/components/NotAuth'), { ssr: false });

const ASSETS = [
    { title: { vi: 'Thời gian xử lý trung bình', en: 'Thời gian xử lý trung bình' }, asset: 'USD' },
    { title: { vi: 'Tổng giá trị tài sản ký quỹ', en: 'Tổng giá trị tài sản ký quỹ' }, asset: 'USD' }
];

// ** INIT STATE
const initState = {
    page: 1,
    loading: false,
    overview: { currency: 'USD' },
    loan: { status: 'ACTIVE' },
    data: {}
};

const Loan = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useContext
    const isAuth = useAuh();
    const { assetConfig } = getAssetConfig();

    // ** useState
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [overView, setOverView] = useState(initState.data);
    const [loading, setLoading] = useState(initState.loading);

    // ** useEffect
    useEffect(() => {
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
    }, []);

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
                                    <div className="dark:text-gay-7 text-gray-1">{item.title?.[language]}</div>
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
                </section>
            )}
        </>
    );
};
export default Loan;
