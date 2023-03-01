import React, { useRef } from 'react';
import PopoverSelect from '../PopoverSelect';
import AssetLogo from '../../../wallet/AssetLogo';
import { FilterWrapper } from '.';
import { useSelector } from 'react-redux';
const AssetFilter = ({ search, setSearch }) => {
    const popoverRef = useRef(null);
   
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];

    return (
        <FilterWrapper label="Loại tài sản">
            <PopoverSelect
                className="min-w-[400px] rounded-xl !left-0 !translate-x-0"
                labelValue={'Loại tài sản'}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                {assetConfigs.map((asset) => (
                    <div key={asset?.id} className="flex items-center px-4 py-3 space-x-2">
                        <AssetLogo useNextImg={true} size={24} assetCode={asset?.assetCode} />
                        <div className="text-txtPrimary dark:text-txtPrimary-dark">{asset?.assetCode}</div>

                        <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{asset?.assetName}</div>
                    </div>
                ))}
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default AssetFilter;
