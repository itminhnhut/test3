import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useTranslation } from 'next-i18next';

import FetchApi from 'utils/fetch-api';

import { API_GET_COLLECTION, API_GET_LIST_NFT, API_GET_DETAIL_COLLECTION } from 'redux/actions/apis';

import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

import { TABS, LIST_CATEGORY } from 'components/screens/NFT/Constants';

import classNames from 'classnames';
import styled from 'styled-components';

// ** Dynamic
const NotAuth = dynamic(() => import('./Components/Page/NoAuth'), { ssr: false });
const NoResult = dynamic(() => import('./Components/Page/NoResult'), { ssr: false });
const NoData = dynamic(() => import('./Components/Page/NoData'), { ssr: false });

const CardItems = dynamic(() => import('./Components/Lists/CardItems'), { ssr: false });

const AllFilters = dynamic(() => import('./Components/Lists/AllFilters'), { ssr: false });
const CategoryFilter = dynamic(() => import('./Components/Lists/CategoryFilter'), { ssr: false });
const CollectionFilter = dynamic(() => import('./Components/Lists/CollectionFilter'), { ssr: false });
const TierFilter = dynamic(() => import('./Components/Lists/TierFilter'), { ssr: false });

const iniData = {
    tab: 2,
    grid: 4,
    tier: [],
    search: '',
    isOpen: true,
    collection: [],
    category: 'all',
    isShowCollection: true // hien thi collection name
};

const Filter = ({ isDark }) => {
    const router = useRouter();

    const { user: isAuth } = useSelector((state) => state.auth);

    const [filter, setFilter] = useState(iniData);
    const [dataCollection, setDataCollection] = useState();
    const [detailCollection, setDetailCollection] = useState();

    const [data, setData] = useState([]);

    const {
        i18n: { language }
    } = useTranslation();

    // ** call api detail collection
    const handleGetDetailCollection = async () => {
        try {
            const res = await FetchApi({ url: API_GET_DETAIL_COLLECTION, params: { id: filter.collection?.[0] } });
            setDetailCollection(res?.data || []);
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
            const { data } = await FetchApi({
                url: API_GET_LIST_NFT,
                params: {
                    category: filter.tab,
                    ...(filter?.tier.length > 0 && { tier: filter?.tier.join(', ') }),
                    ...(filter?.collection.length > 0 && { nft_collection: filter?.collection.join(', ') }),
                    is_all: filter.category === 'all',
                    search: filter.search
                }
            });
            console.log(data);
            if (data) {
                setData(data);
            }
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
        if (!isAuth && filter.category === 'me') return;
        const id = setTimeout(() => handleGetListNFT(), 400);
        return () => clearTimeout(id);
    }, [filter.tab, filter.category, filter.collection, filter.tier, filter.search]);

    // ** handle collection by page url
    useEffect(() => {
        // ** check data collection by call api
        if (Array.isArray(dataCollection)) {
            const { collection: nft_collection, category } = router?.query;
            if (nft_collection && category) {
                //** check nft_collection && category
                const isCheckCollection = dataCollection?.find((f) => f._id === nft_collection);
                const isCheckCategory = LIST_CATEGORY?.find((f) => f.active === category);

                if (!isCheckCollection || !isCheckCategory) return router.push('/nft');

                setFilter((prev) => ({ ...prev, category, collection: [nft_collection], isShowCollection: false }));
            } else {
                setFilter(iniData);
            }
        }
    }, [router.query, dataCollection]);

    // ** handle call api call details collection
    useEffect(() => {
        if (!filter.isShowCollection) {
            handleGetDetailCollection();
        }
    }, [filter.isShowCollection]);

    const handleTab = (tab) => {
        setFilter((prev) => ({ ...prev, tab }));
    };

    const handleSelectGrid = (grid) => {
        setFilter((prev) => ({ ...prev, grid }));
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

    const handleChangeCategory = (category) => {
        setFilter((prev) => ({ ...prev, category }));
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

    const handleToggle = () => {
        setFilter((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    };

    const handleChangInput = (search) => {
        setFilter((prev) => ({ ...prev, search }));
    };

    const renderData = () => {
        if (!isAuth && filter.category === 'me') return <NotAuth />;

        if (data?.length > 0)
            return <CardItems isDark={isDark} listNFT={data} isOpen={filter.isOpen} grid={filter.grid} showCollection={filter.isShowCollection} />;
        // ** page no search
        if (data?.length === 0 && filter.search.length > 0) return <NoResult />;
        return <NoData />;
    };

    const renderHeader = useCallback(() => {
        if (filter.isShowCollection) {
            return (
                <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
                    <header className="mt-10">
                        <h1 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">Nami NFT Infinity</h1>
                    </header>
                </section>
            );
        }

        if (detailCollection?._id) {
            const { name, thumbnail, banner, total_nft } = detailCollection;
            return (
                <section className="m-auto px-4 mb-[60px]">
                    <section>
                        <div className="relative h-[180px] w-full bg-white">
                            <Image src={banner} layout="fill" objectFit="cover" />
                            <section className="absolute bottom-[-92px] left-[112px]">
                                <section className="flex flex-row">
                                    <section className="rounded-full">
                                        <WrapperThumbnail src={thumbnail} width="140" height="140" objectFit="cover" />
                                    </section>
                                    <div className="ml-4 gap-2 flex flex-col justify-end">
                                        <p className="text-gray-15 dark:text-gray-4 text-4xl font-semibold">{name}</p>
                                        <p className="dark:text-gray-7 text-gray-1">Số lượng: {total_nft} vật phẩm</p>
                                    </div>
                                </section>
                            </section>
                        </div>
                    </section>
                    <section className="ml-[112px] mt-[124px] text-gray-15 dark:text-gray-4">{detailCollection?.[`description_${language}`]}</section>
                </section>
            );
        }
    }, [filter.isShowCollection, detailCollection?._id]);

    return (
        <>
            {renderHeader()}
            <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px]">
                <Tabs isDark tab={filter.tab} className="mt-8 gap-6 border-b border-divider dark:border-divider-dark">
                    {TABS?.map((item, idx) => (
                        <TabItem
                            key={item.label}
                            className="!text-left !px-0 !text-base"
                            value={item.value}
                            onClick={(isClick) => isClick && handleTab(item.value)}
                        >
                            {item.label}
                        </TabItem>
                    ))}
                </Tabs>
                <section className="mt-8 flex flex-row gap-3">
                    <AllFilters filter={filter} onChangeToggle={handleToggle} onChangeGird={handleSelectGrid} onChangeSearch={handleChangInput} />
                </section>
                <section className="mt-8 flex flex-row gap-6">
                    <section className={classNames('w-[388px]', { hidden: !filter.isOpen })}>
                        <CategoryFilter onChangeCategory={handleChangeCategory} isDark={isDark} category={filter.category} />
                        <CollectionFilter isDark={isDark} collections={dataCollection} filter={filter} onChangeCollection={handleChangeCollection} />
                        <TierFilter isDark={isDark} filterTier={filter.tier} onChangeTier={handleChangeCheckBox} />
                    </section>
                    {renderData()}
                </section>
            </section>
        </>
    );
};

const WrapperGird = styled.div.attrs(({ active }) => ({
    className: `${classNames({ 'bg-gray-12 dark:bg-dark-2': active })}`
}))``;

const WrapperThumbnail = styled(Image)`
    border-radius: 100%;
`;

const WrapperBtnFilter = styled.button.attrs({
    className: 'flex flex-row items-center gap-2 mx-4'
})``;

export default Filter;
