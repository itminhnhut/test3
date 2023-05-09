import React, { useEffect, useRef, useState } from 'react';
import DateFilter from './DateFilter';
import CommonFilter from './common/CommonFilter';
import { fiatFilter, sideFilter, statusFilter } from '../constants';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { FilterWrapper } from 'components/screens/TransactionHistory/TransactionFilter';
import { isNull } from 'lodash';
import { useDebounce } from 'react-use';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

const INITIAL_FILTER_LOCALIZED = {
    assetId: null,
    status: null,
    side: null
};
const FilterButton = ({ setFilter, filter, t, resetFilter, isResetAble, language }) => {
    const [filterLocalized, setFilterLocalized] = useState(INITIAL_FILTER_LOCALIZED);

    const [search, setSearch] = useState(null);

    useDebounce(
        () => {
            if (isNull(search)) return;
            setFilter({
                ...INITIAL_FILTER_LOCALIZED,
                from: null,
                to: null,
                displayingId: search.trim().toUpperCase()
            });
            setFilterLocalized(INITIAL_FILTER_LOCALIZED);
        },
        500,
        [search]
    );

    const onSelectFilter = (item, key) => {
        setFilter({
            [key]: item.key,
            displayingId: ''
        });
        setFilterLocalized((prev) => ({ ...prev, [key]: t(item.localized) }));
        setSearch(null);
    };

    return (
        <div className="flex flex-wrap lg:flex-nowrap -m-3 lg:m-0 lg:gap-6 items-end">
            <div className="p-3 lg:p-0 w-1/2 lg:w-[246px] z-[42]">
                <FilterWrapper label={t('common:transaction_id')}>
                    <SearchBoxV2
                        isValueTrim={false}
                        wrapperClassname="!h-11"
                        value={search || ''}
                        placeholder={t('dw_partner:placeholder.enter_txid')}
                        onChange={(value) => {
                            const regex = /[^A-Za-z0-9]+/g;
                            if (!regex.test(value)) setSearch(value);
                        }}
                    />
                </FilterWrapper>
            </div>
            <div className="p-3 lg:p-0 w-1/2 lg:w-[246px] z-[42]">
                <DateFilter
                    t={t}
                    filter={{
                        startDate: filter.from,
                        endDate: filter.to
                    }}
                    setFilter={({ startDate, endDate }) => {
                        setFilter({
                            from: startDate,
                            to: endDate,
                            displayingId: ''
                        });
                        setSearch(null);
                    }}
                />
            </div>
            <div className="p-3 lg:p-0 w-1/2 lg:w-[156px] z-[41] ">
                <CommonFilter
                    t={t}
                    subLabel={t('dw_partner:fiat_currency')}
                    boxLabel={filterLocalized?.assetId}
                    data={fiatFilter}
                    active={filter?.assetId}
                    onSelect={(asset) => onSelectFilter(asset, 'assetId')}
                />
            </div>
            <div className="p-3 lg:p-0 w-1/2 lg:w-[156px] z-40">
                <CommonFilter
                    t={t}
                    subLabel={language === LANGUAGE_TAG.VI ? 'Loại' : 'Method'}
                    boxLabel={filterLocalized?.side}
                    data={sideFilter}
                    active={filter?.side}
                    onSelect={(item) => onSelectFilter(item, 'side')}
                />
            </div>
            <div className="p-3 lg:p-0 w-1/2 lg:w-[156px] z-40">
                <CommonFilter
                    t={t}
                    subLabel={t('common:global_label.status')}
                    boxLabel={filterLocalized?.status}
                    data={statusFilter}
                    active={filter?.status}
                    onSelect={(item) => onSelectFilter(item, 'status')}
                />
            </div>
            <div className="p-3 lg:p-0 w-1/2 lg:w-[84px]">
                <ButtonV2
                    disabled={!isResetAble}
                    onClick={() => {
                        resetFilter();
                        setFilterLocalized(INITIAL_FILTER_LOCALIZED);
                        setSearch(null);
                    }}
                    variants="secondary"
                    className="!p-4 !text-txtSecondary dark:!text-txtSecondary-dark !h-11"
                >
                    {t('common:global_label.reset')}
                </ButtonV2>
            </div>
        </div>
    );
};

export default FilterButton;
