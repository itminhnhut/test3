import React, { useCallback, useRef, useState, useMemo } from 'react';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import NoResult from 'components/screens/Support/NoResult';
import PopoverSelect from 'components/screens/Lending/components/AssetFilter/PopoverSelect';

//  ** svg
import { CheckCircleIcon } from 'components/svg/SvgIcon';

// ** redux
import { useSelector } from 'react-redux';
import { filterSearch, formatNumber } from 'redux/actions/utils';

// ** third party
import { X } from 'react-feather';
import sortBy from 'lodash/sortBy';
import classNames from 'classnames';
import { List } from 'react-virtualized';
import { useTranslation } from 'next-i18next';
import { COLLATERAL } from '../../constants';
import { useLocalStorage } from 'react-use';
import { LOCAL_STORAGE_KEY } from 'redux/actions/const';

const MAX_SEARCH_LIST_LENGTH = 3;

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
    labelAsset = '',
    assets = [],
    assetListKey,
    isAuth
}) => {
    const { t } = useTranslation();

    const wallets = useSelector((state) => state.wallet?.SPOT);

    // ** Local Storage
    const [localPreviousSearch, setLocalPreviousSearch] = useLocalStorage(LOCAL_STORAGE_KEY.LENDING_SEARCH_LIST, []);

    // ** useRef
    const popoverRef = useRef(null);

    // ** useState
    const [search, setSearch] = useState('');
    const [previousSearchList, setPreviousSearchList] = useState(localPreviousSearch);

    // ** useMemo
    const filterAssets = useMemo(() => {
        const newAssets = [...assets].map((asset) => {
            const walletBalance = wallets?.[asset?.id];
            const available = walletBalance ? Math.max(walletBalance?.value, 0) - Math.max(walletBalance?.locked_value, 0) : 0;
            return { ...asset, available };
        });

        const searchAssets = filterSearch(newAssets, ['assetCode', 'assetName'], search);

        return sortBy(searchAssets, [
            function (asset) {
                return -asset.available;
            },
            function (asset) {
                return asset.assetCode;
            }
        ]).filter((f) => f.id !== assetCode);
    }, [assets, search, assetCode, wallets]);

    // ** render
    const rowRenderer = useCallback(
        ({ index, key, style, list }) => {
            const currentAsset = list[index];
            const isAssetChosen = asset && asset?.id === currentAsset?.id;

            return (
                <div key={key} style={style}>
                    <div
                        onClick={() => {
                            if (isAssetChosen) return;

                            popoverRef?.current?.close();
                            setTimeout(() => setSearch(''), 100);
                            onChangeAsset(currentAsset);

                            // save to localStorage search list only for collateral list && isAuth
                            if (assetListKey === COLLATERAL && isAuth) {
                                const copySearchList = JSON.parse(JSON.stringify(previousSearchList));
                                const existAsset = copySearchList.find((asset) => asset?.id === currentAsset?.id);
                                if (existAsset) return;

                                const newSearchList = [currentAsset, ...copySearchList].slice(0, MAX_SEARCH_LIST_LENGTH);
                                setPreviousSearchList(newSearchList);
                                setLocalPreviousSearch(newSearchList);
                            }
                        }}
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
                        <div className="flex items-center space-x-2 text-txtPrimary dark:text-txtPrimary-dark">
                            {/* SHOW BALANCE AVAILABLE ONLY ON COLLATERAL LIST AND AUTH */}
                            {assetListKey === COLLATERAL && isAuth && <span>{formatNumber(currentAsset?.available, currentAsset?.assetDigit || 0)}</span>}

                            {isAssetChosen && <CheckCircleIcon color="currentColor" size={16} />}
                        </div>
                    </div>
                </div>
            );
        },
        [search, asset, assetListKey, isAuth]
    );

    return (
        <section className={classNames('text-txtSecondary dark:text-txtSecondary-dark w-full', className)}>
            <div className={classNames('text-sm mb-3', { hidden: label?.length === 0 })}>{label}</div>
            <PopoverSelect
                containerClassName={classNames('z-50', containerClassName)}
                className={classNames('min-w-[400px] rounded-xl !left-0 !translate-x-0', wrapperClassName)}
                chevronClassName="!text-txtPrimary dark:!text-txtPrimary-dark"
                wrapperLabel={wrapperLabel}
                labelAsset={labelAsset}
                labelValue={() => (
                    <>
                        <div className={classNames({ 'text-txtPrimary dark:text-txtPrimary-dark flex justify-between items-center w-full': asset })}>
                            {!asset ? (
                                t('transaction-history:filter.all')
                            ) : (
                                <div className={classNames(' flex items-center space-x-2', labelClassName)}>
                                    <div className="w-6 h-6 min-w-[24px] min-h-[24px]">
                                        <AssetLogo useNextImg={true} size={24} assetCode={asset?.assetCode} />
                                    </div>
                                    <div className="font-semibold">{asset?.assetCode || asset?.assetName}</div>
                                </div>
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
                        {!Boolean(search) && isAuth && assetListKey === COLLATERAL && previousSearchList.length > 0 && (
                            <>
                                <div className="dark:!text-gray-4 !text-gray-15 !text-base font-semibold px-4 mb-4">Tìm kiếm gần đây</div>
                                <div className="space-y-3">
                                    {previousSearchList.map((currentAsset) => {
                                        const isAssetChosen = asset && asset?.id === currentAsset?.id;
                                        return (
                                            <div
                                                onClick={() => {
                                                    if (isAssetChosen) return;

                                                    popoverRef?.current?.close();
                                                    setTimeout(() => setSearch(''), 100);
                                                    onChangeAsset(currentAsset);

                                                    // save to localStorage search list only for collateral list && isAuth
                                                    if (assetListKey === COLLATERAL && isAuth) {
                                                        const copySearchList = JSON.parse(JSON.stringify(previousSearchList));
                                                        const existAsset = copySearchList.find((asset) => asset?.id === currentAsset?.id);
                                                        if (existAsset) return;

                                                        const newSearchList = [currentAsset, ...copySearchList].slice(0, MAX_SEARCH_LIST_LENGTH);
                                                        setPreviousSearchList(newSearchList);
                                                        setLocalPreviousSearch(newSearchList);
                                                    }
                                                }}
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

                                                {isAssetChosen && (
                                                    <div className="flex items-center space-x-2 text-txtPrimary dark:text-txtPrimary-dark">
                                                        <CheckCircleIcon color="currentColor" size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        <div className="dark:!text-gray-4 !text-gray-15 !text-base font-semibold px-4 my-4">Danh sách tài sản ký quỹ</div>
                        <List
                            width={400}
                            height={180}
                            rowCount={filterAssets.length}
                            rowHeight={60}
                            rowRenderer={(props) => rowRenderer({ ...props, list: filterAssets })}
                        />
                    </>
                )}
            </PopoverSelect>
        </section>
    );
};

export default React.memo(AssetLendingFilter);
