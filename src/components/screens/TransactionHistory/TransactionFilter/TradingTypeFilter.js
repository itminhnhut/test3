import React, { useRef } from 'react';
import { FilterWrapper } from '.';
import PopoverSelect from '../PopoverSelect';

const TradingTypeFilter = ({ search, setSearch }) => {
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
                {[...Array(10).keys()].map((e) => (
                    <div key={e} className="flex items-center px-4 py-3 space-x-2">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark">BNB</div>

                        <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">Avocado DAO token</div>
                    </div>
                ))}
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default TradingTypeFilter;
