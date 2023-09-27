import Button from 'components/common/V2/ButtonV2/Button';
import { HotIcon } from 'components/screens/MarketV2/MarketTable';
import AssetLogo from 'components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { WalletCurrency } from 'utils/reference-utils';
import { useEarnCtx } from '../../context/EarnContext';


const Token = ({ symbol }) => {
    return (
        <div className="flex space-x-2 items-center">
            <AssetLogo assetId={WalletCurrency[symbol]} size={32} />
            <span className="font-semibold">{symbol}</span>
        </div>
    );
};

const HotPool = ({ pool }) => {

    const {asset, rewardAsset, duration, apr} = pool;
    const { setPoolInfo } = useEarnCtx();
    const {t} = useTranslation();
    const onClick = () => {
        setPoolInfo(pool);
    };

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark p-4 rounded-xl">
            <div className="flex justify-between items-center">
                <Token symbol={asset} />
                <div className="flex space-x-2 items-center px-4 py-1 rounded-full bg-teal/10">
                    <HotIcon />
                    <span className="text-teal text-sm">{t('earn:hot')}</span>
                </div>
            </div>

            <div className="flex justify-between mt-4">
                <div className="">
                    <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('earn:apr')}</div>
                    <div className="font-semibold text-teal">{apr} %</div>
                </div>
                <div className="">
                    <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('earn:period')}</div>
                    <div className="font-semibold">{`${duration} ${duration > 1 ? t('common:days') : t('common:day')}`}</div>
                </div>
                <div className="">
                    <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('earn:reward')}</div>
                    <Token symbol={rewardAsset} />
                </div>
            </div>

            <div className="mt-4">
                <Button onClick={onClick}>{t('earn:deposit')}</Button>
            </div>
        </div>
    );
};

export default HotPool;
