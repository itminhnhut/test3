import React, { useState } from 'react';

import DateFilter from './DateFilter';
import AssetFilter from './AssetFilter';
import TradingTypeFilter from './TradingTypeFilter';
import classNames from 'classnames';

export const FilterWrapper = ({ children, label, className }) => (
    <div
        className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full max-w-[240px] z-1000', {
            [className]: className,
        })}
    >
        <div className="text-xs mb-3">{label}</div>
        {children}
    </div>
);

const TransactionFilter = ({ filter, setFilter }) => {
    const [search, setSearch] = useState('');

    return (
        <div className="flex w-full space-x-6">
            <AssetFilter search={search} setSearch={setSearch} />
            <DateFilter filter={filter} setFilter={setFilter} />
            <TradingTypeFilter search={search} setSearch={setSearch} />
        </div>
    );
};

export default TransactionFilter;
