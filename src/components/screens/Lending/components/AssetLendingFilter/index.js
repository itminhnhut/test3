import React, { useCallback, useRef, useState, useMemo } from 'react';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import NoResult from 'components/screens/Support/NoResult';
import PopoverSelect from 'components/screens/Lending/components/AssetFilter/PopoverSelect';

//  ** svg
import { CheckCircleIcon } from 'components/svg/SvgIcon';

// ** redux
import { useSelector } from 'react-redux';
import { filterSearch } from 'redux/actions/utils';

// ** third party
import { X } from 'react-feather';
import sortBy from 'lodash/sortBy';
import classNames from 'classnames';
import { List } from 'react-virtualized';
import { useTranslation } from 'next-i18next';

const AssetLendingFilter = ({
    asset,
    onChangeAsset,
    assetCode,
    className,
    label = '',
    wrapperLabel,
    wrapperClassName = '',
    labelClassName = '',
    containerClassName = '',
    labelAsset = ''
}) => {
    const { t } = useTranslation();

    // ** useRef
    const popoverRef = useRef(null);

    // ** useState
    const [search, setSearch] = useState('');
    const { user: auth } = useSelector((state) => state.auth) || null;
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];

    // ** useMemo
    const filterAssets = useMemo(() => {
        const rs = sortBy(filterSearch(assetConfigs, ['assetCode', 'assetName'], search), [
            function (asset) {
                return asset?.assetCode;
            }
        ]).filter((f) => f.id !== assetCode);
        return rs;
    }, [assetConfigs, search, assetCode]);

    // ** render
    const rowRenderer = useCallback(
        ({ index, key, style }) => {
            const currentAsset = filterAssets[index];
            const isAssetChosen = asset && asset?.id === currentAsset?.id;
            return (
                <div style={style}>
                    <div
                        onClick={() => {
                            if (isAssetChosen) return;
                            popoverRef?.current?.close();
                            setTimeout(() => setSearch(''), 100);
                            onChangeAsset(currentAsset);
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
        [filterAssets, search, asset]
    );

    return (
        <section className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full', className)}>
            <div className={classNames('text-sm mb-3', { hidden: label?.length === 0 })}>{label}</div>
            <PopoverSelect
                containerClassName={classNames('z-50', containerClassName)}
                className={classNames('min-w-[400px] rounded-xl !left-0 !translate-x-0', wrapperClassName)}
                hideChevron={Boolean(asset)}
                wrapperLabel={wrapperLabel}
                labelAsset={labelAsset}
                labelValue={() => (
                    <>
                        <div
                            className={classNames(
                                { 'text-txtPrimary dark:text-txtPrimary-dark flex justify-between items-center w-full': asset }
                                // {
                                //     'cursor-not-allowed': !auth
                                // }
                            )}
                        >
                            {!asset ? (
                                t('transaction-history:filter.all')
                            ) : (
                                <>
                                    <div className={classNames('flex items-center space-x-2', labelClassName)}>
                                        <AssetLogo useNextImg={true} size={24} assetCode={asset?.assetCode} />
                                        <div>{asset?.assetCode || asset?.assetName}</div>
                                    </div>
                                    <div className="text-gray-7">
                                        <X
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onChangeAsset(null);
                                            }}
                                            size={16}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
                ref={popoverRef}
                value={search}
                onChange={(value) => setSearch(value)}
            >
                {!filterAssets?.length ? (
                    <NoResult text={t('common:no_results_found')} />
                ) : (
                    <>
                        <div className="dark:!text-gray-4 !text-gray-15 !text-base font-semibold px-4 mb-4">Tìm kiếm gần đây</div>
                        <List width={400} height={280} rowCount={filterAssets.length} rowHeight={60} rowRenderer={rowRenderer} />
                        <div className="dark:!text-gray-4 !text-gray-15 !text-base font-semibold px-4 my-4">Danh sách tài sản ký quỹ</div>
                        <List width={400} height={280} rowCount={filterAssets.length} rowHeight={60} rowRenderer={rowRenderer} />
                    </>
                )}
            </PopoverSelect>
        </section>
    );
};

export default React.memo(AssetLendingFilter);
