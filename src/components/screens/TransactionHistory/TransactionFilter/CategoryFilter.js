import React, { useRef, useState } from 'react';
import { FilterWrapper } from '.';
import PopoverSelect from '../PopoverSelect';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { TransactionTabs } from '../constant';

const CategoryFilter = ({ category, setCategory, categoryConfig, language }) => {
    const popoverRef = useRef(null);
    const [search, setSearch] = useState('');
    const router = useRouter();
    const { id } = router.query;

    return (
        <FilterWrapper label="Loại giao dịch">
            <PopoverSelect
                className="w-full rounded-xl !left-0 !translate-x-0"
                labelValue={() => <span className={classNames({ 'text-txtPrimary dark:text-txtPrimary-dark': category })}>{!category ? 'Tất cả' : category?.content[language]}</span>}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                <div className="max-h-[300px] overflow-y-scroll space-y-3">
                    {categoryConfig
                        .filter((cate) => cate.content[language].toLowerCase().includes(search.toLowerCase()))
                        .map((cate) => (
                            <div
                                onClick={() => {
                                    setCategory(cate);
                                    popoverRef?.current?.close();
                                    setSearch('');
                                    if (id === TransactionTabs[0].key) return;
                                    router.push(TransactionTabs[0].href);
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
                        ))}
                </div>
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default CategoryFilter;
