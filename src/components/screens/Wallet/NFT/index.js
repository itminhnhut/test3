import { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';

import { useTranslation } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import FetchApi from 'utils/fetch-api';

import { API_GET_COLLECTION, API_GET_LIST_NFT } from 'redux/actions/apis';

import Chip from 'components/common/V2/Chip';

import classNames from 'classnames';
import styled from 'styled-components';

const AllFilters = dynamic(() => import('components/screens/NFT/Components/Lists/AllFilters'), { ssr: false });

const NoResult = dynamic(() => import('components/screens/NFT/Components/Page/NoResult'), { ssr: false });
const NoData = dynamic(() => import('components/screens/NFT/Components/Page/NoData'), { ssr: false });

const CardItems = dynamic(() => import('components/screens/NFT/Components/Lists/CardItems'), { ssr: false });

const CollectionFilter = dynamic(() => import('components/screens/NFT/Components/Lists/CollectionFilter'), { ssr: false });
const TierFilter = dynamic(() => import('components/screens/NFT/Components/Lists/TierFilter'), { ssr: false });

const iniData = {
    wallet: 'WNFT',
    tab: 2,
    grid: 4,
    tier: [],
    search: '',
    isOpen: false,
    collection: [],
    isShowCollection: true
};

const NFTWallet = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [filter, setFilter] = useState(iniData);

    const [dataCollection, setDataCollection] = useState();
    const [data, setData] = useState([]);

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
            const resData = await FetchApi({
                url: API_GET_LIST_NFT,
                params: {
                    category: filter.tab,
                    ...(filter?.tier.length > 0 && { tier: filter?.tier.join(', ') }),
                    ...(filter?.collection.length > 0 && { nft_collection: filter?.collection.join(', ') }),
                    is_all: false,
                    search: filter.search
                }
            });
            setData(resData?.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // ** handle get data Collection
    useEffect(() => {
        handleGetCollection();
    }, []);

    // ** handle get data list NFT
    useEffect(() => {
        const id = setTimeout(() => handleGetListNFT(), 400);
        return () => clearTimeout(id);
    }, [filter.tab, filter.collection, filter.tier, filter.search]);

    const handleChangeWallet = (wallet) => {
        setFilter((prev) => ({ ...prev, wallet }));
    };

    const handleChangInput = (search) => {
        setFilter((prev) => ({ ...prev, search }));
    };

    const handleToggle = () => {
        setFilter((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    };

    const handleSelectGrid = (grid) => {
        setFilter((prev) => ({ ...prev, grid }));
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

    const renderData = () => {
        if (data?.length > 0)
            return <CardItems wallet={true} listNFT={data} isOpen={filter.isOpen} grid={filter.grid} showCollection={filter.isShowCollection} />;
        // ** page no search
        if (data?.length === 0 && filter.search.length > 0) return <NoResult />;
        return <NoData />;
    };

    return (
        <>
            <section className="flex flex-row justify-between">
                <section className="flex flex-row gap-3  text-gray-1 dark:text-gray-7 text-sm">
                    <WrapperChip className="h-9" onClick={() => handleChangeWallet('WNFT')} active={filter.wallet === 'WNFT'}>
                        WNFT (3)
                    </WrapperChip>
                    <WrapperChip className="h-9" onClick={() => handleChangeWallet('Voucher')} active={filter.wallet === 'Voucher'}>
                        Voucher (3)
                    </WrapperChip>
                </section>
            </section>
            <section className="mt-5 flex flex-row gap-3">
                <AllFilters filter={filter} onChangeToggle={handleToggle} onChangeGird={handleSelectGrid} onChangeSearch={handleChangInput} />
            </section>
            <section className="mt-8 flex flex-row gap-6">
                <section className={classNames('w-[388px]', { hidden: !filter.isOpen })}>
                    <CollectionFilter isDark={isDark} collections={dataCollection} filter={filter} onChangeCollection={handleChangeCollection} />
                    <TierFilter isDark={isDark} filterTier={filter.tier} onChangeTier={handleChangeCheckBox} />
                </section>
                {renderData()}
            </section>
        </>
    );
};

const WrapperChip = styled(Chip).attrs(({ active }) => ({
    className: `${classNames({ 'dark:!text-green-2 !text-green-3 font-semibold active': active })}`
}))`
    &.active {
        background-color: rgba(71, 204, 133, 0.1) !important;
    }
`;

export default NFTWallet;
