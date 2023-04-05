import React, { useRef, useState } from 'react';
import DateFilter from './DateFilter';
import CommonFilter from './common/CommonFilter';
import { fiatFilter, sideFilter, statusFilter } from '../constants';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const INITIAL_FILTER_LOCALIZED = {
    assetId: null,
    status: null,
    side: null
};
const FilterButton = ({ setState, filter, t, resetFilter, isResetAble }) => {
    const [filterLocalized, setFilterLocalized] = useState(INITIAL_FILTER_LOCALIZED);

    const onSelectFilter = (item, key) => {
        setState({
            params: {
                ...filter,
                [key]: item.key,
                page: 0
            }
        });
        setFilterLocalized((prev) => ({ ...prev, [key]: t(item.localized) }));
    };

    return (
        <div className="flex flex-wrap md:flex-nowrap -m-3 md:m-0 md:gap-6 items-end">
            <div className="p-3 md:p-0 w-1/2 md:w-[247px] z-[41]">
                <DateFilter
                    t={t}
                    filter={{
                        startDate: filter.from,
                        endDate: filter.to
                    }}
                    setFilter={({ startDate, endDate }) => {
                        setState({
                            params: {
                                ...filter,
                                from: startDate,
                                to: endDate,
                                page: 0
                            }
                        });
                    }}
                />
            </div>
            <div className="p-3 md:p-0 w-1/2 md:w-[247px] z-[41] ">
                <CommonFilter
                    t={t}
                    subLabel={'Tiền pháp định'}
                    boxLabel={filterLocalized?.assetId}
                    data={fiatFilter}
                    active={filter?.assetId}
                    onSelect={(asset) => onSelectFilter(asset, 'assetId')}
                />
            </div>
            <div className="p-3 md:p-0 w-1/2 md:w-[247px] z-40">
                <CommonFilter
                    t={t}
                    subLabel={t('common:global_label.type')}
                    boxLabel={filterLocalized?.side}
                    data={sideFilter}
                    active={filter?.side}
                    onSelect={(item) => onSelectFilter(item, 'side')}
                />
            </div>
            <div className="p-3 md:p-0 w-1/2 md:w-[247px] z-40">
                <CommonFilter
                    t={t}
                    subLabel={t('common:global_label.status')}
                    boxLabel={filterLocalized?.status}
                    data={statusFilter}
                    active={filter?.status}
                    onSelect={(item) => onSelectFilter(item, 'status')}
                />
            </div>
            <div className="p-3 md:p-0 w-full md:w-[84px]">
                <ButtonV2
                    disabled={!isResetAble}
                    onClick={() => {
                        resetFilter();
                        setFilterLocalized(INITIAL_FILTER_LOCALIZED);
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
