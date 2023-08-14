import classNames from 'classnames';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import InputV2 from 'components/common/V2/InputV2';
import NoData from 'components/common/V2/TableV2/NoData';
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import AssetLogo from 'components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { forwardRef } from 'react';
import { dwLinkBuilder, formatWallet } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const AssetsDropdown = React.memo(
    forwardRef(({ assetOptions, setOpenSelectAsset, search, setSearch, mapAssetConfig }, ref) => {
        const router = useRouter();
        const { assetId: assetCode } = router.query;
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
                        const disabled = asset?.assetCode === assetCode;
                        return (
                            <button
                                disabled={disabled}
                                key={asset._id}
                                onClick={() => {
                                    router
                                        .push(dwLinkBuilder(TYPE_DW.ID_EMAIL, SIDE.SELL, asset?.assetCode), null, {
                                            scroll: false,
                                            shallow: false
                                        })
                                        .finally(() => {
                                            setOpenSelectAsset(false);
                                        });
                                }}
                                className={classNames(
                                    'flex items-center w-full disabled:cursor-default justify-between px-4 py-3 cursor-pointer transition hover:bg-hover dark:hover:bg-hover-dark',
                                    {
                                        'bg-hover dark:bg-hover-dark': disabled
                                    }
                                )}
                            >
                                <div className="flex">
                                    <AssetLogo assetCode={asset?.assetCode} size={24} />
                                    <span className="ml-2">{asset.assetCode}</span>
                                </div>
                                <span className="float-right text-txtSecondary">
                                    {formatWallet(asset.availableValue, mapAssetConfig[asset.assetId]?.assetDigit || 0)}
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
