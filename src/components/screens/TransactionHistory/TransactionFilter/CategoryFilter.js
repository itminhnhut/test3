import React, { useRef, useState, useMemo } from 'react';
import { FilterWrapper } from '.';
import PopoverSelect from '../PopoverSelect';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { X } from 'react-feather';
import NoResult from 'components/screens/Support/NoResult';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import { filterSearch } from 'redux/actions/utils';

const CategoryFilter = ({ category, setCategory, categoryConfig, language, t }) => {
    const popoverRef = useRef(null);
    const [search, setSearch] = useState('');
    const { user: auth } = useSelector((state) => state.auth) || null;
    const filterCategory = useMemo(() => filterSearch(categoryConfig, [`content.${language}`], search), [search, categoryConfig, language]);
    return (
        <FilterWrapper label={t('transaction-history:filter.category_type')}>
            <PopoverSelect
                className="w-[280px] md:w-full rounded-xl !left-0 !translate-x-0"
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
                                <div className="text-gray-7">
                                    <X
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCategory(null);
                                        }}
                                        size={16}
                                    />
                                </div>
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
                        filterCategory?.map((cate) => {
                            const isCategoryChosen = category && category?.category_id === cate.category_id;
                            return (
                                <div
                                    onClick={() => {
                                        if (isCategoryChosen) return;
                                        setCategory(cate);
                                        popoverRef?.current?.close();
                                        setTimeout(() => setSearch(''), 100);
                                    }}
                                    key={cate.category_id}
                                    className={classNames(
                                        ' text-txtPrimary dark:text-txtPrimary-dark hover:bg-hover dark:hover:bg-hover-dark flex items-center justify-between px-4 py-3',
                                        {
                                            'cursor-pointer ': !isCategoryChosen
                                        }
                                    )}
                                >
                                    {cate.content[language]}

                                    {isCategoryChosen && <CheckCircleIcon color="currentColor" size={16} />}
                                </div>
                            );
                        })
                    )}
                </div>
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default CategoryFilter;
