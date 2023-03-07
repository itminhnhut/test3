import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import classNames from 'classnames';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const DateFilter = dynamic(() => import('./DateFilter', { ssr: false }));
const AssetFilter = dynamic(() => import('./AssetFilter', { ssr: false }));
const CategoryFilter = dynamic(() => import('./CategoryFilter', { ssr: false }));

export const FilterWrapper = ({ children, label, className }) => (
    <div
        className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full', {
            [className]: className
        })}
    >
        <div className="text-xs mb-3">{label}</div>
        {children}
    </div>
);

const TransactionFilter = ({ filter, setFilter, categoryConfig, language }) => {
    const [search, setSearch] = useState('');

    return (
        <div className="flex flex-wrap -m-3 items-end w-full">
            <div className="w-1/2 p-3 lg:w-1/4">
                <AssetFilter search={search} setSearch={setSearch} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <DateFilter filter={filter} setFilter={setFilter} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <CategoryFilter language={language} categoryConfig={categoryConfig} search={search} setSearch={setSearch} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <ButtonV2 variants="secondary" className="!leading-5 !h-auto !w-[85px] ">
                    Reset
                </ButtonV2>
            </div>
        </div>
    );
};

export default TransactionFilter;
