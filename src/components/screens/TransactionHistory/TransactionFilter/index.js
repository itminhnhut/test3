import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import classNames from 'classnames';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { INITAL_FILTER } from '../constant';
import { isNull } from 'lodash';
import DateFilter from './DateFilter';
import AssetFilter from './AssetFilter';
import CategoryFilter from './CategoryFilter';

export const FilterWrapper = ({ children, label, className }) => (
    <div
        className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full', {
            className
        })}
    >
        <div className="text-xs mb-3">{label}</div>
        {children}
    </div>
);

const TransactionFilter = ({ filter, setFilter, categoryConfig, language }) => {
    return (
        <div className="flex flex-wrap -m-3 items-end w-full">
            <div className="w-1/2 p-3 lg:w-1/4">
                <AssetFilter asset={filter.asset} setAsset={(asset) => setFilter({ asset })} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <DateFilter filter={filter} setFilter={setFilter} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <CategoryFilter
                    language={language}
                    category={filter.category}
                    setCategory={(category) => setFilter({ category })}
                    categoryConfig={categoryConfig}
                />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <ButtonV2
                    disabled={!filter.category && !filter.asset && isNull(filter.range.endDate)}
                    onClick={() => setFilter(INITAL_FILTER)}
                    variants="secondary"
                    className={'!leading-5 !h-auto !w-[85px] disabled:cursor-default '}
                >
                    Reset
                </ButtonV2>
            </div>
        </div>
    );
};

export default TransactionFilter;
