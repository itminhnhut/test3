import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search } from 'react-feather';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useTranslation } from 'next-i18next';

import FetchApi from 'utils/fetch-api';

import { API_GET_COLLECTION, API_GET_LIST_NFT, API_GET_DETAIL_COLLECTION } from 'redux/actions/apis';

import CheckBox from 'components/common/CheckBox';
import RadioBox2 from 'components/common/RadioBox2';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import CollapseV2 from 'components/common/V2/CollapseV2';
import InputV2 from 'components/common/V2/InputV2';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';

import { NoResultIcon } from 'components/svg/SvgIcon';
import { GridAltIcon, GridIcon, FilterSharpIcon, CloseIcon } from 'components/svg/SvgIcon';

import classNames from 'classnames';
import styled from 'styled-components';
import colors from 'styles/colors';

// Dynamic
const NotAuth = dynamic(() => import('./NoAuth'), { ssr: false });
const ListFilter = dynamic(() => import('./ListFilter'), { ssr: false });

export const TABS = [
    { label: 'NFT', value: 2 },
    { label: 'Voucher', value: 1 }
];

const iniData = {
    category: 'all',
    tab: 2,
    search: '',
    isOpen: true,
    grid: 4,
    tier: [],
    collection: [],
    isShowCollection: true
};

const LIST_CATEGORY = [
    {
        name: { vi: 'Tất cả', en: 'All' },
        active: 'all'
    },
    {
        name: { vi: 'Bộ sưu tập của tôi', en: 'My collection' },
        active: 'me'
    }
];

export const LIST_TIER = [
    {
        name: { vi: 'Bình thường', en: 'Common' },
        active: 'C',
        key: 'normal'
    },
    {
        name: { vi: 'Hiếm', en: 'Rate' },
        active: 'R',
        key: 'rate'
    },
    {
        name: { vi: 'Siêu hiếm', en: 'Epic' },
        active: 'SR',
        key: 'super'
    },
    {
        name: { vi: 'Cực hiếm', en: 'Legendary' },
        active: 'UR',
        key: 'extremely'
    },
    {
        name: { vi: 'Tối thượng', en: 'Mythic' },
        active: 'UL',
        key: 'supreme'
    }
];

const Filter = ({ isDark }) => {
    const router = useRouter();

    const { user: isAuth } = useSelector((state) => state.auth);

    const [filter, setFilter] = useState(iniData);

    const [dataCollection, setDataCollection] = useState(null);
    const [detailCollection, setDetailCollection] = useState({});

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
            const resData = await FetchApi({
                url: API_GET_LIST_NFT,
                params: {
                    category: filter.tab,
                    ...(filter?.tier.length > 0 && { tier: filter?.tier.join(', ') }),
                    ...(filter?.collection.length > 0 && { nft_collection: filter?.collection.join(', ') }),
                    is_all: filter.category === 'all',
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

    // console.log('filter', filter);
    // console.log('data collection', dataCollection);

    const renderCategory = () => {
        return (
            <>
                {LIST_CATEGORY?.map((item) => {
                    return (
                        <RadioBox2
                            isDark={isDark}
                            classNameInput="w-6 h-6"
                            key={item.name?.[language]}
                            id={item.name?.[language]}
                            label={item.name?.[language]}
                            checked={item?.active === filter?.category}
                            onChange={() => handleChangeCategory(item?.active)}
                        />
                    );
                })}
                <div className="my-6 h-[1px] bg-divider dark:bg-divider-dark" />
            </>
        );
    };

    const renderCollections = useCallback(() => {
        if (!Array.isArray(dataCollection) || !filter.isShowCollection) return;
        return (
            <>
                <CollapseV2
                    active={true}
                    label="Bộ sưu tập"
                    key={`NFT_Collections`}
                    className="w-full last:pb-4"
                    reload={dataCollection?.length > 0}
                    divLabelClassname="w-full justify-between"
                    labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                >
                    {dataCollection?.length > 0 &&
                        dataCollection?.map((item) => {
                            return (
                                <CheckBox
                                    key={item.name}
                                    className="mr-6 mb-4"
                                    boxContainerClassName="w-6 h-6"
                                    label={item.name}
                                    active={filter?.collection.includes(item?._id)}
                                    labelClassName="text-gray-1 dark:text-gray-7 text-base"
                                    onChange={() => handleChangeCollection(item._id)}
                                />
                            );
                        })}
                </CollapseV2>
                <div className="my-6 h-[1px] bg-divider dark:bg-divider-dark" />
            </>
        );
    }, [dataCollection, filter.isShowCollection, filter.collection]);

    const renderTier = () => {
        return (
            <CollapseV2
                key={`NFT_tier`}
                className="w-full last:pb-4"
                divLabelClassname="w-full justify-between"
                chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                label="Độ hiếm"
                labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12"
                active={true}
            >
                {LIST_TIER?.map((tier) => {
                    return (
                        <CheckBox
                            key={tier.name?.[language]}
                            className="mr-6 mb-4"
                            boxContainerClassName="w-6 h-6"
                            label={tier.name?.[language]}
                            active={filter?.tier.includes(tier?.active)}
                            labelClassName="text-gray-1 dark:text-gray-7 text-base"
                            onChange={() => handleChangeCheckBox(tier.active)}
                        />
                    );
                })}
            </CollapseV2>
        );
    };

    const renderFilter = useMemo(() => {
        return filter.isOpen ? (
            <WrapperBtnFilter>
                <CloseIcon color="currentColor" size={16} />
                <span className="font-semibold text-gray-15 dark:text-gray-7">Đóng</span>
            </WrapperBtnFilter>
        ) : (
            <WrapperBtnFilter>
                <FilterSharpIcon />
                <span className="font-semibold text-gray-15 dark:text-gray-7">Lọc</span>
            </WrapperBtnFilter>
        );
    }, [filter.isOpen]);

    const renderData = () => {
        if (!isAuth && filter.category === 'me') return <NotAuth />;
        if (data?.length > 0) return <ListFilter listNFT={data} isOpen={filter.isOpen} grid={filter.grid} showCollection={filter.isShowCollection} />;

        if (data?.length === 0 && filter.search.length > 0)
            return (
                <div className="flex items-center justify-center flex-col m-auto pt-20">
                    <NoResultIcon />
                    <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">Không tìm thấy kết quả</div>
                </div>
            );
        return (
            <div className="flex items-center justify-center flex-col m-auto">
                <div className="block dark:hidden">
                    <NoDataLightIcon />
                </div>
                <div className="hidden dark:block">
                    <NoDataDarkIcon />
                </div>
                <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">Bạn hiện không có NFT</div>
            </div>
        );
    };

    const renderHeader = useCallback(() => {
        if (filter.isShowCollection) {
            return (
                <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px]">
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
                            key={idx}
                            V2
                            className="!text-left !px-0 !text-base"
                            value={item.value}
                            onClick={(isClick) => isClick && handleTab(item.value)}
                        >
                            {item.label}
                        </TabItem>
                    ))}
                </Tabs>
                <section className="mt-8 flex flex-row gap-3">
                    <section className="flex flex-row h-12 dark:bg-dark-2 bg-dark-12 rounded-md" onClick={handleToggle}>
                        {renderFilter}
                    </section>
                    <section className="w-full">
                        <InputV2
                            value={filter.search}
                            allowClear
                            placeholder="Tìm kiếm Token"
                            onChange={(value) => handleChangInput(value)}
                            prefix={<Search strokeWidth={2} className="text-gray-1 w-4 h-4" />}
                        />
                    </section>
                    <section className="flex flex-row  border-[2px] border-divider dark:border-divider-dark rounded-md border-solid cursor-pointer h-12 w-[96px]">
                        <WrapperGird
                            active={filter.grid === 4}
                            className={classNames('w-full flex justify-center items-center border-r-2 border-r-divider dark:border-r-divider-dark')}
                            onClick={() => handleSelectGrid(4)}
                        >
                            <GridAltIcon />
                        </WrapperGird>
                        <WrapperGird
                            active={filter.grid === 6}
                            className={classNames('w-full flex justify-center items-center rounded-tr-[6px] rounded-br-[6px]')}
                            onClick={() => handleSelectGrid(6)}
                        >
                            <GridIcon />
                        </WrapperGird>
                    </section>
                </section>
                <section className="mt-8 flex flex-row gap-6">
                    <section className={classNames('w-[388px]', { hidden: !filter.isOpen })}>
                        {renderCategory()}
                        {renderCollections()}
                        {renderTier()}
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
