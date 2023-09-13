import { useState } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import Chip from 'components/common/V2/Chip';

// ** constants
import { HISTORY_TAB } from 'components/screens/Lending/constants';

// ** dynamic
const HistoryTable = dynamic(() => import('./Table'), { ssr: false });

const initState = {
    tab: 'loan',
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
const History = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useState
    const [tab, setTab] = useState(initState.tab);
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [loading, setLoading] = useState(initState.loading);

    // ** handle
    const handleChangeTab = (tab) => {
        setTab(tab);
    };

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
            <section className="flex flex-row gap-3 mt-8">{renderTabs()}</section>
            <section className="mt-8">
                <HistoryTable data={data} page={page} loading={loading} onPage={setPage} keyTab={tab} />
            </section>
        </>
    );
};
export default History;
