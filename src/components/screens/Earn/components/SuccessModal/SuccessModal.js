import React from 'react';
import { format as formatDate } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { getAssetFromCode } from 'redux/actions/utils';
import { formatNumber } from 'utils/reference-utils';
import ModalV2 from 'components/common/V2/ModalV2';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import { useRouter } from 'next/router';
import Button from 'components/common/V2/ButtonV2/Button';
import Tooltip from 'components/common/Tooltip';


const formatDateTime = (date = 0) => {
    return formatDate(date, 'hh:mm dd/MM/yyyy');
};


const SuccessModal = ({ onClose, pool, estimatedReward, depositAmount }) => {
    const { asset, rewardAsset, duration, apr } = pool;
    const { t } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const router = useRouter();


    return (
        <ModalV2 isVisible={true} onBackdropCb={onClose} className="max-w-[488px]">
            {/* <div className="font-semibold text-2xl">{t('earn:deposit_modal:success_title')}</div>

            <div className="h-6"></div> */}

            <img src="/images/screen/earn/earn_success.png" alt="" className="mx-auto w-[11.25rem] h-[11.25rem] dark:hidden" />
            <img src="/images/screen/earn/earn_success-dark.png" alt="" className="mx-auto w-[11.25rem] h-[11.25rem] hidden dark:block" />

            <div className="h-6"></div>

            <div className="text-txtSecondary dark:text-txtSecondary-dark text-center">{t('earn:deposit_modal:success_title')}</div>

            <div className="h-4"></div>

            <div className="font-semibold text-center text-2xl">
                {formatNumber(depositAmount, assetInfo?.assetDigit || 0)} {asset}
            </div>

            <div className="h-6"></div>

            <Tooltip
                className="w-[calc(50%-2.75rem)] after:!left-6"
                isV3
                id="apr-tooltip"
                place="top"
                effect="solid"
                overridePosition={({ left, top }) => ({ left: 32, top: top })}
            >
                {t('earn:deposit_modal:apr_tooltip')}
            </Tooltip>
            <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-4 flex flex-col space-y-4">
                <div className="flex justify-between space-x-2">
                    <div
                        className="text-txtSecondary dark:text-txtSecondary-dark border-b border-dashed border-gray-1 dark:border-gray-7"
                        data-tip=""
                        data-for="apr-tooltip"
                    >
                        {t('earn:deposit_modal:apr')}
                    </div>
                    <div className="font-semibold text-right text-green-3 dark:text-green-2">{(apr * 100).toFixed(2)}%</div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:period')}</div>
                    <div className="font-semibold text-right">
                        {duration} {duration > 1 ? t('common:days') : t('common:day')}
                    </div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:estimated_profit')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(estimatedReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                    </div>
                </div>
            </div>

            <div className="h-10"></div>
            {/* <HrefButton className="w-full" variants="primary" href="/wallet/earn">
                {t('earn:deposit_modal:go_to_wallet')}
            </HrefButton> */}
            <Button
                className="w-full"
                variants="primary"
                onClick={() => {
                    onClose?.();
                    router.push('/wallet/earn');
                }}
            >
                {t('earn:deposit_modal:go_to_wallet')}
            </Button>
        </ModalV2>
    );
};

export default SuccessModal;
