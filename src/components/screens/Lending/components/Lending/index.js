import { useState } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import InputV2 from 'components/common/V2/InputV2';

// ** third party
import { Search } from 'react-feather';

// ** dynamic
const LendingTable = dynamic(() => import('./Table'), { ssr: false });

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
            }
        ],
        hasNext: false,
        go_next: true
    }
};

const Lending = () => {
    const { t } = useTranslation();

    // ** useState
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [search, setSearch] = useState(initState.search);
    const [loading, setLoading] = useState(initState.loading);

    return (
        <>
            <section className="flex flex-row justify-between">
                <h3 className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{t('lending:crypto:lending:title')}</h3>
                <section className="flex flex-row gap-4">
                    <InputV2
                        value={search}
                        onChange={setSearch}
                        classNameDivInner="bg-dark-12"
                        placeholder={t('lending:crypto:lending:place_search')}
                        prefix={<Search color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" size={16} />}
                    />
                </section>
            </section>
            <section className="mt-8">
                <LendingTable data={data} page={page} loading={loading} onPage={setPage} />
            </section>
        </>
    );
};

export default Lending;
