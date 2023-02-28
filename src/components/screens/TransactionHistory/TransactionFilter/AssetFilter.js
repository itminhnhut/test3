import React, { useRef } from 'react';
import PopoverSelect from '../PopoverSelect';
import AssetLogo from '../../../wallet/AssetLogo';
import { FilterWrapper } from '.';
const AssetFilter = ({ search, setSearch }) => {
    const popoverRef = useRef(null);

    return (
        <FilterWrapper label="Loại tài sản">
            <PopoverSelect
                className="min-w-[400px] rounded-xl !left-0 !translate-x-0"
                labelValue={'Loại tài sản'}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                {[...Array(10).keys()].map((e) => (
                    <div key={e} className="flex items-center px-4 py-3 space-x-2">
                        <AssetLogo size={24} assetCode={'BNB'} />
                        <div className="text-txtPrimary dark:text-txtPrimary-dark">BNB</div>

                        <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">Avocado DAO token</div>
                    </div>
                ))}
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default AssetFilter;
