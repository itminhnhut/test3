import React, { useCallback, useEffect, useRef, useState } from 'react';
import PopoverSelect from '../PopoverSelect';
import AssetLogo from '../../../wallet/AssetLogo';
import { FilterWrapper } from '.';
import { useSelector } from 'react-redux';
import { List } from 'react-virtualized';
import classNames from 'classnames';
import { sortBy } from 'lodash';
import { X } from 'react-feather';

const AssetFilter = ({ asset, setAsset }) => {
    const popoverRef = useRef(null);
    const [search, setSearch] = useState('');

    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const [fitlerAssets, setFilterAssets] = useState([]);

    useEffect(() => {
        const filtered = assetConfigs.filter((asset) =>
            search ? asset?.assetCode?.toLowerCase().includes(search.toLowerCase()) || asset?.assetName?.toLowerCase().includes(search.toLowerCase()) : true
        );
        setFilterAssets(
            sortBy(filtered, [
                function (asset) {
                    return asset?.assetCode;
                }
            ])
        );
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
                        setSearch('');
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
                hideChevron={Boolean(asset)}
                labelValue={() => (
                    <div className={classNames({ 'text-txtPrimary dark:text-txtPrimary-dark flex justify-between items-center w-full': asset })}>
                        {!asset ? (
                            'Tất cả'
                        ) : (
                            <>
                                <div className="flex items-center  space-x-2">
                                    <AssetLogo useNextImg={true} size={24} assetCode={asset?.assetCode} />
                                    <span>{asset?.assetCode || asset?.assetName}</span>
                                </div>
                                <X
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setAsset(null);
                                    }}
                                    size={16}
                                />
                            </>
                        )}
                    </div>
                )}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                <List width={400} height={280} rowCount={fitlerAssets.length} rowHeight={48} rowRenderer={rowRenderer} />
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default React.memo(AssetFilter);
