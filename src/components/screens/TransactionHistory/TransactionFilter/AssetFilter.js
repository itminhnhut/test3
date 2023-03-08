import React, { useCallback, useEffect, useRef, useState } from 'react';
import PopoverSelect from '../PopoverSelect';
import AssetLogo from '../../../wallet/AssetLogo';
import { FilterWrapper } from '.';
import { useSelector } from 'react-redux';
import { List } from 'react-virtualized';
import classNames from 'classnames';

const AssetFilter = ({ search, setSearch, asset, setAsset }) => {
    const popoverRef = useRef(null);

    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const [fitlerAssets, setFilterAssets] = useState([]);

    useEffect(() => {
        const filtered = assetConfigs.filter((asset) => (search ? asset?.assetCode?.toLowerCase().includes(search.toLowerCase()) : true));
        setFilterAssets(filtered);
    }, [assetConfigs, search]);

    const rowRenderer = useCallback(
        ({ index, key, style }) => {
            const currentAsset = fitlerAssets[index];
            const isAssetChosen = asset && asset?.id === currentAsset?.id;
            return (
                <div
                    onClick={() => {
                        if (isAssetChosen) return;
                        popoverRef?.current?.close();
                        setAsset(currentAsset);
                    }}
                    style={style}
                    key={key}
                    className={classNames('flex items-center px-4 py-3 space-x-2 ', {
                        'bg-hover dark:bg-hover-dark pointer-events-none': isAssetChosen,
                        'cursor-pointer hover:bg-hover dark:hover:bg-hover-dark': !isAssetChosen
                    })}
                >
                    <AssetLogo useNextImg={true} size={24} assetCode={currentAsset?.assetCode} />
                    <div className="text-txtPrimary dark:text-txtPrimary-dark">{currentAsset?.assetCode}</div>

                    <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{currentAsset?.assetName}</div>
                </div>
            );
        },
        [fitlerAssets, search, asset]
    );

    return (
        <FilterWrapper label="Loại tài sản">
            <PopoverSelect
                containerClassName="!z-40"
                className="min-w-[400px] rounded-xl !left-0 !translate-x-0"
                labelValue={() => <span className={classNames({ 'text-txtPrimary': asset })}>{!asset ? 'Tất cả' : asset?.assetCode || asset?.assetName}</span>}
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
