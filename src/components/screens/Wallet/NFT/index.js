import { useState, useEffect, useMemo, useCallback } from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';

import { API_GET_COLLECTION, API_GET_LIST_NFT, API_GET_SUMMARY_NFT } from 'redux/actions/apis';

import Chip from 'components/common/V2/Chip';

import classNames from 'classnames';
import styled from 'styled-components';

const AllFilters = dynamic(() => import('components/screens/NFT/Components/Lists/AllFilters'), { ssr: false });

const SkeletonCard = dynamic(() => import('components/screens/NFT/Components/Page/SkeletonCard'), { ssr: false });

const CardItems = dynamic(() => import('components/screens/NFT/Components/Lists/CardItems'), { ssr: false });

const CollectionFilter = dynamic(() => import('components/screens/NFT/Components/Lists/CollectionFilter'), { ssr: false });
const TierFilter = dynamic(() => import('components/screens/NFT/Components/Lists/TierFilter'), { ssr: false });

const DEFAULT_PATH_NAME = '/wallet/NFT';

const DEFAULT_FILTER = {
    wallet: 'WNFT',
    grid: 4
};

const iniData = {
    // wallet: 'WNFT',
    // tab: 2,
    grid: 4,
    tier: [],
    search: '',
    isOpen: false,
    collection: [],
    isShowCollection: true
};

const TAB_STATUS = { WNFT: 2, SB: 1 };

const NFTWallet = () => {
    const router = useRouter();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [filter, setFilter] = useState(iniData);
    const [isLoading, setIsLoading] = useState(false);

    const [dataCollection, setDataCollection] = useState();
    const [summary, setSummary] = useState([]);

    const [data, setData] = useState();

    // ** call api get summary
    const handleGetSummary = async () => {
        try {
            const resCollection = await FetchApi({ url: API_GET_SUMMARY_NFT });
            setSummary(resCollection?.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // ** call api get collection
    const handleGetCollection = async () => {
        try {
            const resCollection = await FetchApi({ url: API_GET_COLLECTION });
            setDataCollection(resCollection?.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // ** call api get list NFT
    const handleGetListNFT = async () => {
        try {
            setIsLoading(true);
            const { data } = await FetchApi({
                url: API_GET_LIST_NFT,
                params: {
                    category: TAB_STATUS?.[filter.wallet],
                    ...(filter?.tier.length > 0 && { tier: filter?.tier.join(',') }),
                    ...(filter?.collection.length > 0 && { nft_collection: filter?.collection.join(',') }),
                    is_all: false,
                    search: filter.search
                }
            });
            if (data) {
                setData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // ** handle get data Collection
    useEffect(() => {
        handleGetCollection();
        handleGetSummary();
    }, []);

    // ** handle get data list NFT
    useEffect(() => {
        const id = setTimeout(() => handleGetListNFT(), 400);
        return () => clearTimeout(id);
    }, [filter.wallet, filter.collection, filter.tier, filter.search]);

    useEffect(() => {
        const { wallet = DEFAULT_FILTER.wallet, grid = DEFAULT_FILTER.grid } = router.query;

        setFilter((prev) => ({ ...prev, wallet, grid: +grid }));
    }, [router.query]);

    const totalSummary = useMemo(() => {
        const totalVoucher = summary?.find((f) => f?._id === TAB_STATUS.SB)?.total || 0;
        const totalNft = summary?.find((f) => f?._id === TAB_STATUS.WNFT)?.total || 0;
        return { voucher: totalVoucher, nft: totalNft };
    }, [summary]);

    const handleChangeWallet = (wallet) => {
        const grid = wallet !== filter?.wallet ? DEFAULT_FILTER.grid : filter.grid;
        if (wallet === filter?.wallet) return;
        router.push(
            {
                pathname: DEFAULT_PATH_NAME,
                query: { ...router.query, wallet, grid }
            },
            DEFAULT_PATH_NAME
        );
    };

    const handleChangInput = (search) => {
        setFilter((prev) => ({ ...prev, search }));
    };

    const handleToggle = () => {
        setFilter((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    };

    const handleSelectGrid = (grid) => {
        if (grid === filter?.grid) return;
        router.push(
            {
                pathname: DEFAULT_PATH_NAME,
                query: { ...router.query, grid }
            },
            DEFAULT_PATH_NAME
        );
        // setFilter((prev) => ({ ...prev, grid }));
    };

    const handleChangeCollection = (collection) => {
        const isActive = filter.collection.includes(collection);
        if (!isActive) {
            setFilter((prev) => ({ ...prev, collection: [...prev.collection, collection] }));
        } else {
            const newArray = filter.collection.filter((f) => f !== collection);
            setFilter((prev) => ({ ...prev, collection: [...newArray] }));
        }
    };

    const handleChangeCheckBox = (tier) => {
        const isActive = filter.tier.includes(tier);
        if (!isActive) {
            setFilter((prev) => ({ ...prev, tier: [...prev.tier, tier] }));
        } else {
            const newArray = filter.tier.filter((f) => f !== tier);
            setFilter((prev) => ({ ...prev, tier: [...newArray] }));
        }
    };

    const renderData = useCallback(() => {
        if (isLoading || !Array.isArray(data)) {
            return <SkeletonCard grid={filter.grid} isOpen={filter.isOpen} isDark={isDark} />;
        }
        if (Array.isArray(data)) {
            return (
                <CardItems
                    wallet={true}
                    listNFT={data}
                    isDark={isDark}
                    grid={filter.grid}
                    isOpen={filter.isOpen}
                    noResult={filter.search.length > 0}
                    showCollection={filter.isShowCollection}
                />
            );
        }
    }, [data, isLoading, filter.isShowCollection, filter.grid, filter.isOpen, filter.category, isDark]);

    return (
        <>
            <section className="flex flex-row justify-between">
                <section className="flex flex-row gap-3 text-gray-1 dark:text-gray-7 text-sm">
                    <WrapperChip onClick={() => handleChangeWallet('WNFT')} active={filter.wallet === 'WNFT'}>
                        WNFT ({totalSummary.nft})
                    </WrapperChip>
                    <WrapperChip onClick={() => handleChangeWallet('SB')} active={filter.wallet === 'SB'}>
                        Skynamia Badges ({totalSummary.voucher})
                    </WrapperChip>
                </section>
            </section>
            <section className="mt-5 flex flex-row gap-x-3">
                <AllFilters filter={filter} onChangeToggle={handleToggle} onChangeGird={handleSelectGrid} onChangeSearch={handleChangInput} />
            </section>
            <section className="mt-8 flex flex-row gap-6">
                <section className={classNames('w-[388px]', { hidden: !filter.isOpen })}>
                    <CollectionFilter isDark={isDark} collections={dataCollection} filter={filter} onChangeCollection={handleChangeCollection} />
                    <TierFilter isDark={isDark} filter={filter} onChangeTier={handleChangeCheckBox} />
                </section>
                {renderData()}
            </section>
        </>
    );
};

const WrapperChip = styled(Chip).attrs(({ active }) => ({
    className: `${classNames('bg-dark-13 dark:bg-dark-4', { 'h-9 dark:!text-green-2 !text-green-3 font-semibold active': active })}`
}))`
    &.active {
        background-color: rgba(71, 204, 133, 0.1) !important;
    }
`;

export default NFTWallet;
