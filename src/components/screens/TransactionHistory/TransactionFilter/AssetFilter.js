import React, { useCallback, useRef, useState, useMemo } from 'react';
import PopoverSelect from '../PopoverSelect';
import AssetLogo from '../../../wallet/AssetLogo';
import { FilterWrapper } from '.';
import { useSelector } from 'react-redux';
import { List } from 'react-virtualized';
import classNames from 'classnames';
import { sortBy } from 'lodash';
import { X } from 'react-feather';
import NoResult from 'components/screens/Support/NoResult';
import { CheckCircleIcon } from 'components/svg/SvgIcon';

const AssetFilter = ({ asset, setAsset, t }) => {
    const popoverRef = useRef(null);
    const [search, setSearch] = useState('');
    const { user: auth } = useSelector((state) => state.auth) || null;
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];

    const fitlerAssets = useMemo(() => {
        return sortBy(
            assetConfigs.filter((asset) =>
                search ? asset?.assetCode?.toLowerCase().includes(search.toLowerCase()) || asset?.assetName?.toLowerCase().includes(search.toLowerCase()) : true
            ),
            [
                function (asset) {
                    return asset?.assetCode;
                }
            ]
        );
    }, [assetConfigs, search]);

    const rowRenderer = useCallback(
        ({ index, key, style }) => {
            const currentAsset = fitlerAssets[index];
            const isAssetChosen = asset && asset?.id === currentAsset?.id;
            return (
                <div style={style}>
                    <div
                        onClick={() => {
                            if (isAssetChosen) return;
                            popoverRef?.current?.close();
                            setSearch('');
                            setAsset(currentAsset);
                        }}
                        key={key}
                        className={classNames('flex items-center justify-between px-4 py-3 hover:bg-hover dark:hover:bg-hover-dark ', {
                            'text-txtPrimary dark:text-txtPrimary-dark': isAssetChosen,
                            'cursor-pointer ': !isAssetChosen
                        })}
                    >
                        <div className="flex items-center space-x-2">
                            <AssetLogo useNextImg={true} size={24} assetCode={currentAsset?.assetCode} />
                            <div className="text-txtPrimary dark:text-txtPrimary-dark">{currentAsset?.assetCode}</div>
                            <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{currentAsset?.assetName}</div>
                        </div>
                        {isAssetChosen && <CheckCircleIcon color="currentColor" size={16} />}
                    </div>
                </div>
            );
        },
        [fitlerAssets, search, asset]
    );

    return (
        <FilterWrapper label={t('transaction-history:filter.asset_type')}>
            <PopoverSelect
                containerClassName="!z-40"
                className="min-w-[400px] rounded-xl !left-0 !translate-x-0"
                hideChevron={Boolean(asset)}
                labelValue={() => (
                    <div
                        className={classNames(
                            { 'text-txtPrimary dark:text-txtPrimary-dark flex justify-between items-center w-full': asset },
                            {
                                'cursor-not-allowed': !auth
                            }
                        )}
                    >
                        {!asset ? (
                            t('transaction-history:filter.all')
                        ) : (
                            <>
                                <div className="flex items-center  space-x-2">
                                    <AssetLogo useNextImg={true} size={24} assetCode={asset?.assetCode} />
                                    <span>{asset?.assetCode || asset?.assetName}</span>
                                </div>
                                <div className="text-gray-7">
                                    <X
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAsset(null);
                                        }}
                                        size={16}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                {!fitlerAssets?.length ? (
                    <NoResult text={t('common:no_results_found')} />
                ) : (
                    <List width={400} height={280} rowCount={fitlerAssets.length} rowHeight={60} rowRenderer={rowRenderer} />
                )}
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default React.memo(AssetFilter);
