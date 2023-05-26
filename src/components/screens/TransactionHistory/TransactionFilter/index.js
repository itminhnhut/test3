import React from 'react';
import classNames from 'classnames';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import DateFilter from './DateFilter';
import AssetFilter from './AssetFilter';
import CategoryFilter from './CategoryFilter';
import { isFilterEmpty } from '..';

export const FilterWrapper = ({ children, label, className }) => (
    <div className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full', className)}>
        <div className="text-sm mb-3">{label}</div>
        {children}
    </div>
);

const TransactionFilter = ({ filter, setFilter, resetFilter, categoryConfig, language, t }) => {
    return (
        <div className="flex flex-wrap -m-3 items-end w-full">
            <div className="w-1/2 p-3 lg:w-1/4">
                <AssetFilter asset={filter.asset} setAsset={(asset) => setFilter({ asset })} t={t} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <DateFilter filter={filter} setFilter={setFilter} t={t} />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <CategoryFilter
                    language={language}
                    category={filter.category}
                    setCategory={(category) => setFilter({ category })}
                    categoryConfig={categoryConfig}
                    t={t}
                />
            </div>
            <div className="w-1/2 p-3 lg:w-1/4">
                <ButtonV2
                    disabled={isFilterEmpty(filter)}
                    onClick={resetFilter}
                    variants="secondary"
                    className={'!leading-5 !h-auto !w-[85px] disabled:cursor-default '}
                >
                    {t('transaction-history:reset')}
                </ButtonV2>
            </div>
        </div>
    );
};

export default TransactionFilter;
