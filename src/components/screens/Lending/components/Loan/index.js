import { useState } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** Redux
import { formatNumber } from 'src/redux/actions/utils';

// ** dynamic
const LoanTable = dynamic(() => import('./Table'), { ssr: false });
const NotAuth = dynamic(() => import('components/screens/Lending/components/NotAuth'), { ssr: false });

const ASSETS = [
    { title: { vi: 'Thời gian xử lý trung bình', en: 'Thời gian xử lý trung bình' }, asset: 'VNDC' },
    { title: { vi: 'Tổng giá trị tài sản ký quỹ', en: 'Tổng giá trị tài sản ký quỹ' }, asset: 'VNDC' }
];

// ** INIT STATE
const initState = {
    search: '',
    page: 1,
    loading: false,
    data: {
        result: [
            {
                _id: '64f8b0567e77990b41bb867b',
                note: 'BALANCE: Stake reward for 583056',
                user_id: 583056,
                category: 570,
                currency: 72,
                money_use: 175000,
                money_before: 5127323815102.4,
                money_after: 5127323990102.4,
                main_balance: 1,
                metadata: {
                    value: 500000000,
                    assetId: 72,
                    time: '2023-09-06T17:00:00.000Z',
                    _id: '64f8b04c364201500235aec5',
                    source: {
                        collection: 'stakedailyhistories',
                        filter: {
                            _id: '64f8b04c364201500235aec5'
                        }
                    }
                },
                wallet_type: 0,
                created_at: '2023-09-06T17:01:03.100Z'
            },
            {
                _id: '64f75ed67e77990b41bb8316',
                note: 'BALANCE: Stake reward for 583056',
                user_id: 583056,
                category: 570,
                currency: 72,
                money_use: 175001,
                money_before: 5127323340102.4,
                money_after: 5127323515102.4,
                main_balance: 1,
                metadata: {
                    value: 500000000,
                    assetId: 72,
                    time: '2023-09-05T17:00:00.000Z',
                    _id: '64f75ecc364201500235ad78',
                    source: {
                        collection: 'stakedailyhistories',
                        filter: {
                            _id: '64f75ecc364201500235ad78'
                        }
                    }
                },
                wallet_type: 0,
                created_at: '2023-09-05T17:01:02.237Z'
            },
            {
                _id: '64f75ed67e77990b41bb8316',
                note: 'BALANCE: Stake reward for 583056',
                user_id: 583056,
                category: 570,
                currency: 72,
                money_use: 175001,
                money_before: 5127323340102.4,
                money_after: 5127323515102.4,
                main_balance: 1,
                metadata: {
                    value: 500000000,
                    assetId: 72,
                    time: '2023-09-05T17:00:00.000Z',
                    _id: '64f75ecc364201500235ad78',
                    source: {
                        collection: 'stakedailyhistories',
                        filter: {
                            _id: '64f75ecc364201500235ad78'
                        }
                    }
                },
                wallet_type: 0,
                created_at: '2023-09-05T17:01:02.237Z'
            }
        ],
        hasNext: false,
        go_next: true
    }
};

const Loan = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [search, setSearch] = useState(initState.search);
    const [loading, setLoading] = useState(initState.loading);

    // ** total
    const total = [6000000, 98000000];

    return (
        <>
            {/* <NotAuth /> */}
            <section>
                <h3 className="text-2xl font-semibold dark:text-gray-4 text-gray-15">Tổng quan tài sản</h3>
                <section className="grid grid-cols-2 mt-8 gap-6 ">
                    {ASSETS?.map((item, key) => {
                        return (
                            <section className="dark:bg-dark-4 bg-white rounded-xl px-8 py-6" key={`loan_${key}_${item.title?.[language]}`}>
                                <div className="dark:text-gay-7 text-gray-1">{item.title?.[language]}</div>
                                <section className="flex flex-row gap-1 mt-4 text-gray-15 text-2xl font-semibold dark:text-gray-4">
                                    <div>{formatNumber(total?.[key])}</div>
                                    <div>{item.asset}</div>
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
        </>
    );
};
export default Loan;
