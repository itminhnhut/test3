import React, { useRef, useState, useMemo } from 'react';
import { FilterWrapper } from '.';
import PopoverSelect from '../PopoverSelect';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { TransactionTabs } from '../constant';
import { X } from 'react-feather';
import NoResult from 'components/screens/Support/NoResult';

const CategoryFilter = ({ category, setCategory, categoryConfig, language, t }) => {
    const popoverRef = useRef(null);
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { id } = router.query;
    const { user: auth } = useSelector((state) => state.auth) || null;
    const filterCategory = useMemo(
        () => categoryConfig.filter((cate) => cate.content[language].toLowerCase().includes(search.toLowerCase())) || [],
        [search, categoryConfig, language]
    );
    return (
        <FilterWrapper label={t('transaction-history:filter.category_type')}>
            <PopoverSelect
                className="w-full rounded-xl !left-0 !translate-x-0"
                hideChevron={Boolean(category)}
                labelValue={() => (
                    <div
                        className={classNames(
                            { 'text-txtPrimary dark:text-txtPrimary-dark flex justify-between items-center w-full': category },

                            {
                                'cursor-not-allowed': !auth
                            }
                        )}
                    >
                        {!category ? (
                            t('transaction-history:filter.all')
                        ) : (
                            <>
                                <span>{category?.content[language]}</span>
                                <X
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCategory(null);
                                    }}
                                    size={16}
                                />
                            </>
                        )}
                    </div>
                )}
                ref={popoverRef}
                value={search}
                onChange={(value) => auth && setSearch(value)}
            >
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                    {!filterCategory?.length ? (
                        <NoResult text={t('common:no_results_found')} />
                    ) : (
                        filterCategory?.map((cate) => (
                            <div
                                onClick={() => {
                                    setCategory(cate);
                                    popoverRef?.current?.close();
                                    setSearch('');
                                }}
                                key={cate.category_id}
                                className={classNames(
                                    ' text-txtPrimary dark:text-txtPrimary-dark flex items-center px-4 py-3',
                                    {
                                        'cursor-default pointer-events-none bg-hover dark:bg-hover-dark': category?.category_id === cate.category_id
                                    },
                                    {
                                        'cursor-pointer hover:bg-hover dark:hover:bg-hover-dark': !category || category?.category_id !== cate.category_id
                                    }
                                )}
                            >
                                {cate.content[language]}
                            </div>
                        ))
                    )}
                </div>
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default CategoryFilter;
