import React, { useMemo, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import AssetLogo from 'components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import { getAssetFromCode } from 'redux/actions/utils';
import { WalletCurrency, formatNumber } from 'utils/reference-utils';
import Button from 'components/common/V2/ButtonV2/Button';
import { BxsInfoCircle } from 'components/svg/SvgIcon';

const RedeemConfirm = ({ onClose, position, isVisible, amount, claimedReward, quote, isEarly, isLoading, onConfirm }) => {
    const { asset, rewardAsset, _id } = position;
    const { t } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);

    const equivalentClaimedReward = claimedReward / quote;

    return (
        <ModalV2 isVisible={isVisible} onBackdropCb={isLoading ? null : onClose} className="w-[30.5rem]">
            <div className="font-semibold text-2xl">
                {t('wallet:earn_wallet:position:redeem')} {asset}
            </div>

            <div className="text-center flex flex-col space-y-4 items-center mt-6">
                <AssetLogo assetId={WalletCurrency[asset]} size={48} />

                <div className="font-semibold text-2xl mt-4">
                    {formatNumber(amount - equivalentClaimedReward, assetInfo?.assetDigit || 0)} {asset}
                </div>
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl flex flex-col space-y-4">
                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:deposited')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(amount, assetInfo?.assetDigit || 0)} {asset}
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:equivalent_claimed_profit')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(equivalentClaimedReward, assetInfo?.assetDigit || 0)} {asset}
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:claimed_profit')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(claimedReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:rate')}</div>
                    <div className="font-semibold text-right">
                        1 {asset} ≈ {formatNumber(quote, rewardInfo?.assetDigit)} {rewardAsset}
                    </div>
                </div>
            </div>

            {isEarly && (
                <>
                    <div className="h-6"></div>
                    <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <BxsInfoCircle size={24} />
                            <span className="font-semibold">{t('common:note')}</span>
                        </div>

                        <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:early_redeem_note')}</div>
                    </div>
                </>
            )}

            <div className="h-10"></div>
            <Button className="w-full" loading={isLoading} onClick={onConfirm}>
                {t('wallet:earn_wallet:position:redeem')}
            </Button>
        </ModalV2>
    );
};

export default RedeemConfirm;
