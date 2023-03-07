import React, { useCallback, useEffect, useRef, useState } from 'react';
import PopoverSelect from '../PopoverSelect';
import AssetLogo from '../../../wallet/AssetLogo';
import { FilterWrapper } from '.';
import { useSelector } from 'react-redux';
import { List } from 'react-virtualized';

const AssetFilter = ({ search, setSearch }) => {
    const popoverRef = useRef(null);

    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const [fitlerAssets, setFilterAssets] = useState([]);

    useEffect(() => {
        const filtered = assetConfigs.filter((asset) => (search ? asset?.assetCode?.toLowerCase().includes(search.toLowerCase()) : true));
        setFilterAssets(filtered);
    }, [assetConfigs, search]);

    const rowRenderer = useCallback(
        ({ index, key, style }) => {
            const asset = fitlerAssets[index];
            return (
                <div style={style} key={key} className="flex items-center px-4 py-3 space-x-2 cursor-pointer hover:bg-hover dark:hover:bg-hover-dark">
                    <AssetLogo useNextImg={true} size={24} assetCode={asset?.assetCode} />
                    <div className="text-txtPrimary dark:text-txtPrimary-dark">{asset?.assetCode}</div>

                    <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{asset?.assetName}</div>
                </div>
            );
        },
        [fitlerAssets, search]
    );

    return (
        <FilterWrapper label="Loại tài sản">
            <PopoverSelect
                containerClassName="!z-40"
                className="min-w-[400px] rounded-xl !left-0 !translate-x-0"
                labelValue={'Loại tài sản'}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                <List width={400} height={280} rowCount={fitlerAssets.length} rowHeight={48} rowRenderer={rowRenderer} />
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default AssetFilter;
