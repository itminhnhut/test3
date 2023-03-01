import React, { useRef } from 'react';
import { FilterWrapper } from '.';
import PopoverSelect from '../PopoverSelect';

const CategoryFilter = ({ search, setSearch, categoryConfig, language }) => {
    const popoverRef = useRef(null);

    return (
        <FilterWrapper label="Loại giao dịch">
            <PopoverSelect
                className="w-full rounded-xl !left-0 !translate-x-0"
                labelValue={'Loại tài sản'}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                {categoryConfig.filter(cate => cate.content[language].toLowerCase().includes(search.toLowerCase())).map((cate) => (
                    <div
                        key={cate.category_id}
                        className="cursor-pointer hover:bg-hover dark:hover:bg-hover-dark text-txtPrimary dark:text-txtPrimary-dark flex items-center px-4 py-3"
                    >
                        {cate.content[language]}
                    </div>
                ))}
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default CategoryFilter;
