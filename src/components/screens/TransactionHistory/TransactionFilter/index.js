import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import classNames from 'classnames';

const DateFilter = dynamic(() => import('./DateFilter', { ssr: false }));
const AssetFilter = dynamic(() => import('./AssetFilter', { ssr: false }));
const CategoryFilter = dynamic(() => import('./CategoryFilter', { ssr: false }));

export const FilterWrapper = ({ children, label, className }) => (
    <div
        className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full max-w-[240px]', {
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
        <div className="flex w-full space-x-6">
            <AssetFilter search={search} setSearch={setSearch} />
            <DateFilter filter={filter} setFilter={setFilter} />
            <CategoryFilter language={language} categoryConfig={categoryConfig} search={search} setSearch={setSearch} />
        </div>
    );
};

export default TransactionFilter;
