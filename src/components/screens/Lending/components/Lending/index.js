import { useState, useEffect } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** Redux
import { API_LOAN_ASSETS } from 'redux/actions/apis';

// ** Utils
import FetchApi from 'utils/fetch-api';

// ** Components
import InputV2 from 'components/common/V2/InputV2';

// ** Third party
import { Search } from 'react-feather';

// ** Dynamic
const LendingTable = dynamic(() => import('./Table'), { ssr: false });

// ** INIT STATE
const initState = {
    filter: {
        search: '',
        limit: 10
    },
    search: '',
    page: 1,
    loading: false,
    data: {
        result: []
    }
};

const Lending = () => {
    const { t } = useTranslation();

    // ** useState
    const [page, setPage] = useState(initState.page);
    const [data, setData] = useState(initState.data);
    const [filter, setFiller] = useState(initState.filter);
    const [isLoading, setIsLoading] = useState(initState.loading);

    // ** handle API
    const getLoanCrypto = async () => {
        try {
            setIsLoading(true);
            const { data } = await FetchApi({
                url: API_LOAN_ASSETS,
                params: {
                    ...filter,
                    search: filter.search
                }
            });
            if (data) {
                setData(data);
            }
        } catch (error) {
            throw new Error('handle api history loan');
        } finally {
            setIsLoading(false);
        }
    };

    // ** ussEffect
    useEffect(() => {
        getLoanCrypto();
    }, [filter.search]);

    // ** handle
    const handleSearch = (search) => {
        setFiller((prev) => ({ ...prev, search }));
    };
    return (
        <>
            <section className="flex flex-row justify-between">
                <h3 className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{t('lending:crypto:lending:title')}</h3>
                <section className="flex flex-row gap-4">
                    <InputV2
                        value={filter.search}
                        onChange={handleSearch}
                        classNameDivInner="bg-dark-12"
                        placeholder={t('lending:crypto:lending:place_search')}
                        prefix={<Search color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" size={16} />}
                    />
                </section>
            </section>
            <section className="mt-8">
                <LendingTable data={data} page={page} loading={isLoading} onPage={setPage} />
            </section>
        </>
    );
};

export default Lending;
