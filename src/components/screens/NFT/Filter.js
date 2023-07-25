import { useState, useMemo, useEffect } from 'react';
import { Search } from 'react-feather';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';

import { useTranslation } from 'next-i18next';

import CheckBox from 'components/common/CheckBox';
import RadioBox2 from 'components/common/RadioBox2';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import CollapseV2 from 'components/common/V2/CollapseV2';
import InputV2 from 'components/common/V2/InputV2';

import { GridAltIcon, GridIcon, FilterSharpIcon, CloseIcon } from 'components/svg/SvgIcon';

import classNames from 'classnames';
import styled from 'styled-components';
import colors from 'styles/colors';

// Dynamic
const NotAuth = dynamic(() => import('./NoAuth'), { ssr: false });
const ListFilter = dynamic(() => import('./ListFilter'), { ssr: false });

const tabs = [
    { label: 'NFT', value: 'NFT' },
    { label: 'Voucher', value: 'Voucher' }
];

const iniData = {
    category: 0,
    tab: 'NFT',
    search: '',
    isOpen: true,
    grid: 4,
    rarity: [],
    collection: []
};

const listCategory = [
    {
        name: { vi: 'Tất cả', en: 'All' },
        active: 0
    },
    {
        name: { vi: 'Bộ sưu tập của tôi', en: 'My collection' },
        active: 1
    }
];

const listCollection = [
    {
        name: { vi: 'Infinity', en: 'Infinity' },
        active: 0
    }
];

const listRarity = [
    {
        name: { vi: 'Bình thường', en: 'Normal' },
        active: 0
    },
    {
        name: { vi: 'Hiếm', en: 'Rate' },
        active: 2
    },
    {
        name: { vi: 'Siêu hiếm', en: 'Super rate' },
        active: 3
    },
    {
        name: { vi: 'Cực hiếm', en: 'Extremely rate' },
        active: 4
    },
    {
        name: { vi: 'Tối thượng', en: 'Supreme' },
        active: 5
    }
];

const Filter = ({ isDark }) => {
    const { user: isAuth } = useSelector((state) => state.auth);

    const [filter, setFilter] = useState(iniData);
    const [data, setData] = useState([]);
    const {
        i18n: { language }
    } = useTranslation();

    const handleA = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    };

    const handleAPI = async () => {
        try {
            await handleA().then((response) => {
                setData([2]);
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleAPI();
    }, []);

    const handleTab = (tab) => {
        setFilter((prev) => ({ ...prev, tab }));
    };

    const handleSelectGrid = (grid) => {
        setFilter((prev) => ({ ...prev, grid }));
    };

    const handleChangeCheckBox = (rarity) => {
        setFilter((prev) => ({ ...prev, rarity: [...prev.rarity, rarity] }));
    };

    const handleChangeCategory = (category) => {
        setFilter((prev) => ({ ...prev, category }));
    };

    const handleChangeCollection = (collection) => {
        setFilter((prev) => ({ ...prev, collection: [...prev.collection, collection] }));
    };

    const handleToggle = () => {
        setFilter((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    };

    const handleChangInput = (search) => {
        setFilter((prev) => ({ ...prev, search }));
    };

    const renderCategory = () => {
        return (
            <>
                {listCategory?.map((item) => {
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

    const renderCollections = () => {
        return (
            <>
                <CollapseV2
                    key={`NFT_Collections`}
                    className="w-full last:pb-4"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label="Bộ sưu tập"
                    labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12"
                    active={true}
                >
                    {listCollection?.map((item) => {
                        return (
                            <CheckBox
                                key={item.name?.[language]}
                                className="mr-6 mb-4"
                                boxContainerClassName="w-6 h-6"
                                label={item.name?.[language]}
                                active={filter?.collection.includes(item?.active)}
                                labelClassName="text-gray-1 dark:text-gray-7 text-base"
                                onChange={() => handleChangeCollection(item.active)}
                            />
                        );
                    })}
                </CollapseV2>
                <div className="my-6 h-[1px] bg-divider dark:bg-divider-dark" />
            </>
        );
    };

    const renderRarity = () => {
        return (
            <CollapseV2
                key={`NFT_Rarity`}
                className="w-full last:pb-4"
                divLabelClassname="w-full justify-between"
                chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                label="Độ hiếm"
                labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12"
                active={true}
            >
                {listRarity?.map((rarity) => {
                    return (
                        <CheckBox
                            key={rarity.name?.[language]}
                            className="mr-6 mb-4"
                            boxContainerClassName="w-6 h-6"
                            label={rarity.name?.[language]}
                            active={filter?.rarity.includes(rarity?.active)}
                            labelClassName="text-gray-1 dark:text-gray-7 text-base"
                            onChange={() => handleChangeCheckBox(rarity.active)}
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

    return (
        <>
            <Tabs isDark tab={filter.tab} className="mt-8 gap-6 border-b border-divider dark:border-divider-dark">
                {tabs?.map((item, idx) => (
                    <TabItem key={idx} V2 className="!text-left !px-0 !text-base" value={item.value} onClick={(isClick) => isClick && handleTab(item.value)}>
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
                    {renderRarity()}
                </section>
                {isAuth ? <ListFilter isOpen={filter.isOpen} grid={filter.grid} /> : <NotAuth />}
            </section>
        </>
    );
};

const WrapperGird = styled.div.attrs(({ active }) => ({
    className: `${classNames({ 'bg-gray-12 dark:bg-dark-2': active })}`
}))``;

const WrapperBtnFilter = styled.button.attrs({
    className: 'flex flex-row items-center gap-2 mx-4'
})``;

export default Filter;
