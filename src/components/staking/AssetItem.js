import AssetLogo from 'components/wallet/AssetLogo';
import { APY_PERCENT } from 'constants/staking';
import { useTranslation } from 'next-i18next';
import React from 'react';

const AssetItem = ({ assetId = 72, assetCode = 'VNDC' }) => {
    const { t } = useTranslation();
    return (
        <div className="font-semibold text-sm lg:text-base text-txtPrimary dark:text-txtPrimary-dark flex items-center gap-2">
            <div className="w-6 h-6">
                <AssetLogo size={24} assetId={assetId} />
            </div>
            <div className="flex items-center gap-2">
                <div className="">{assetCode}</div>
                <div className="text-teal">
                    {APY_PERCENT[assetCode]}%/{t('common:year')}
                </div>
            </div>
        </div>
    );
};

export default AssetItem;
