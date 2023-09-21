import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useTranslation } from 'next-i18next';

import FetchApi from 'utils/fetch-api';

import { API_GET_COLLECTION, API_GET_NFT_LIST, API_GET_DETAIL_COLLECTION } from 'redux/actions/apis';

import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

import { TABS } from 'components/screens/NFT/Constants';

import { HelpIcon } from 'components/svg/SvgIcon';

import classNames from 'classnames';
import styled from 'styled-components';

// ** Dynamic
const NotAuth = dynamic(() => import('./Components/Page/NoAuth'), { ssr: false });
const SkeletonCard = dynamic(() => import('./Components/Page/SkeletonCard'), { ssr: false });

const CardItems = dynamic(() => import('./Components/Lists/CardItems'), { ssr: false });

const AllFilters = dynamic(() => import('./Components/Lists/AllFilters'), { ssr: false });
const CategoryFilter = dynamic(() => import('./Components/Lists/CategoryFilter'), { ssr: false });
const CollectionFilter = dynamic(() => import('./Components/Lists/CollectionFilter'), { ssr: false });
const TierFilter = dynamic(() => import('./Components/Lists/TierFilter'), { ssr: false });

const ModalInfoInfinity = dynamic(() => import('components/screens/Wallet/NFT/Components/Modal/InfoInfinity'), { ssr: false });

const DEFAULT_PATH_NAME = '/nft';

const DEFAULT_FILTER = {
    tab: 2,
    grid: 4
};

const iniData = {
    tier: [],
    search: '',
    isOpen: false,
    collection: [],
    category: 'all',
    isShowCollection: true // hien thi collection name
};

const Filter = ({ isDark }) => {
    const router = useRouter();
    const { user: isAuth } = useSelector((state) => state.auth);

    const [data, setData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState(iniData);
    const [isLoading, setIsLoading] = useState(false);
    const [dataCollection, setDataCollection] = useState();
    const [detailCollection, setDetailCollection] = useState();

    const handleToggleModal = () => setIsOpen((prev) => !prev);

    const {
        t,
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
            setIsLoading(true);
            const { data } = await FetchApi({
                url: API_GET_NFT_LIST,
                params: {
                    category: filter.tab,
                    ...(filter?.tier.length > 0 && { tier: filter?.tier.join(',') }),
                    ...(filter?.collection.length > 0 && { nft_collection: filter?.collection.join(',') }),
                    is_all: filter.category === 'all',
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
            const { collection: nft_collection } = router?.query;
            if (nft_collection) {
                //** check nft_collection && category
                const isCheckCollection = dataCollection?.find((f) => f._id === nft_collection);

                if (!isCheckCollection) return router.push('/nft');

                setFilter((prev) => ({ ...prev, collection: [nft_collection], isShowCollection: false }));
            } else {
                setFilter((prev) => ({ ...prev, ...iniData }));
            }
        }
    }, [router.query, dataCollection]);

    // ** handle call api call details collection
    useEffect(() => {
        if (!filter.isShowCollection) {
            handleGetDetailCollection();
        }
    }, [filter.isShowCollection]);

    useEffect(() => {
        const { tab = DEFAULT_FILTER.tab, grid = DEFAULT_FILTER.grid } = router.query;

        setFilter((prev) => ({ ...prev, tab: +tab, grid: +grid }));
    }, [router.query]);

    const handleTab = (tab) => {
        const grid = tab !== filter?.tab ? DEFAULT_FILTER.grid : filter.grid;
        if (tab === filter?.tab) return;
        router.push(
            {
                pathname: DEFAULT_PATH_NAME,
                query: { ...router.query, tab, grid }
            },
            DEFAULT_PATH_NAME
        );
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

    const renderData = useCallback(() => {
        if (!isAuth && filter.category === 'me') return <NotAuth />;
        if (isLoading || !Array.isArray(data)) {
            return <SkeletonCard grid={filter.grid} isOpen={filter.isOpen} isDark={isDark} />;
        }
        if (Array.isArray(data)) {
            return (
                <CardItems
                    listNFT={data}
                    isDark={isDark}
                    grid={filter.grid}
                    isOpen={filter.isOpen}
                    noResult={filter.search.length > 0}
                    showCollection={filter.isShowCollection}
                />
            );
        }
    }, [isLoading, isDark, data, filter.isShowCollection, filter.grid, filter.isOpen, filter.category]);

    const renderHeader = useCallback(() => {
        if (filter.isShowCollection) {
            return (
                <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 `">
                    <header className="mt-10 flex flex-row items-center gap-x-2">
                        <h1 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">Nami Infinity</h1>
                        <div className="cursor-pointer" onClick={handleToggleModal}>
                            <HelpIcon size={24} color="currentColor" />
                        </div>
                    </header>
                </section>
            );
        }

        if (detailCollection?._id) {
            const { name, thumbnail, banner, total_nft } = detailCollection;
            return (
                <section className="m-auto px-4 mb-[60px]">
                    <section>
                        <div className="relative bg-white">
                            <img src={banner} layout="fill" className="h-[180px] w-[100vw] object-cover" />
                            <article className="max-w-screen-v3 2xl:max-w-screen-xxl px-4 m-auto">
                                <section className="absolute bottom-[-92px]">
                                    <section className="flex flex-row">
                                        <WrapperThumbnail src={thumbnail} width="140" height="140" className="rounded-full object-cover" />
                                        <div className="ml-4 gap-2 flex flex-col justify-end">
                                            <p className="text-gray-15 dark:text-gray-4 text-4xl font-semibold">{name}</p>
                                            <p className="dark:text-gray-7 text-gray-1">
                                                {t('nft:quantity')}: {total_nft} {t('nft:items')}
                                            </p>
                                        </div>
                                    </section>
                                </section>
                            </article>
                        </div>
                    </section>
                    <article className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                        <section className="px-4 mt-[124px] text-gray-15 dark:text-gray-4">{detailCollection?.[`description_${language}`]}</section>
                    </article>
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
                            className="!text-left !px-0 !text-base "
                            value={item.value}
                            onClick={(isClick) => isClick && handleTab(item.value)}
                            isActive={item.value === filter.tab}
                        >
                            {item.label}
                        </TabItem>
                    ))}
                </Tabs>
                <section className="mt-8 flex flex-row gap-x-3">
                    <AllFilters filter={filter} onChangeToggle={handleToggle} onChangeGird={handleSelectGrid} onChangeSearch={handleChangInput} />
                </section>
                <section className="mt-8 flex flex-row gap-6">
                    <section className={classNames('w-[388px]', { hidden: !filter.isOpen })}>
                        <CategoryFilter onChangeCategory={handleChangeCategory} isDark={isDark} category={filter.category} />
                        <CollectionFilter isDark={isDark} collections={dataCollection} filter={filter} onChangeCollection={handleChangeCollection} />
                        <TierFilter isDark={isDark} filter={filter} onChangeTier={handleChangeCheckBox} />
                    </section>
                    {renderData()}
                </section>
            </section>
            <ModalInfoInfinity open={isOpen} onClose={handleToggleModal} />
        </>
    );
};

const WrapperThumbnail = styled.img`
    border-radius: 100%;
`;

export default Filter;
