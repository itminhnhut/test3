import classNames from 'classnames';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import NoData from 'components/common/V2/TableV2/NoData';
import AssetLogo from 'components/wallet/AssetLogo';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import { formatWallet } from 'redux/actions/utils';

const AssetsDropdown = React.memo(
    forwardRef(({ assetOptions, setOpenSelectAsset, search, setSearch, mapAssetConfig }, ref) => {
        const router = useRouter();
        const { assetId: assetCode, side } = router.query;
        return (
            <div
                ref={ref}
                className={
                    'absolute z-10 right-0 top-full left-16 mt-2 flex flex-col py-4 space-y-6 max-h-[436px] min-h-[200px] rounded-xl shadow-common overflow-hidden bg-white nami-light-shadow dark:bg-darkBlue-3 dark:shadow-none dark:border dark:border-divider-dark'
                }
            >
                <div className="px-4">
                    <SearchBoxV2 value={search} onChange={(value) => setSearch(value)} />
                </div>
                <div className="overflow-y-auto flex-1 space-y-3">
                    {!assetOptions.length && <NoData isSearch={Boolean(search)} />}
                    {assetOptions.map((asset) => {
                        const disabled = asset?.assetCode === assetCode || +asset?.availableValue <= 0;
                        return (
                            <button
                                disabled={disabled}
                                key={asset._id}
                                onClick={() => {
                                    router.push(
                                        {
                                            pathname: PATHS.WITHDRAW_DEPOSIT.ID_EMAIL,
                                            query: {
                                                side,
                                                assetId: asset?.assetCode
                                            }
                                        },
                                        null,
                                        {
                                            shallow: true
                                        }
                                    );
                                    setOpenSelectAsset(false);
                                }}
                                className={classNames('flex items-center w-full disabled:cursor-default justify-between px-4 py-3 cursor-pointer transition ', {
                                    'hover:bg-hover dark:hover:bg-hover-dark': !disabled,
                                    'opacity-50': disabled
                                })}
                            >
                                <div className="flex items-center space-x-2">
                                    <AssetLogo assetCode={asset?.assetCode} size={24} />
                                    <span className="">{asset?.assetCode}</span>
                                    <span className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{mapAssetConfig?.[asset?.assetId]?.assetName}</span>
                                </div>
                                <span className="float-right text-txtSecondary">
                                    {formatWallet(asset?.availableValue || 0, mapAssetConfig?.[asset?.assetId]?.assetDigit || 0)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    })
);

export default AssetsDropdown;
