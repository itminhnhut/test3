import React, { useMemo, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { ONE_DAY } from 'constants/constants';
import { format as formatDate } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { getAssetFromCode } from 'redux/actions/utils';
import { formatNumber } from 'utils/reference-utils';
import Button from 'components/common/V2/ButtonV2/Button';
import FetchApi from 'utils/fetch-api';
import { API_DEPOSIT_EARN } from 'redux/actions/apis';
import toast from 'utils/toast';
import { useDispatch } from 'react-redux';
import { getUserEarnBalance } from 'redux/actions/user';

const formatDateTime = (date = 0) => {
    return formatDate(date, 'hh:mm dd/MM/yyyy');
};


const ConfirmModal = ({ onClose, onConfirm, pool, estimatedReward, depositAmount, subcribeAt, autoRenew }) => {
    const { asset, rewardAsset, duration, apr, id } = pool;
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const dispatch = useDispatch();


    const profitAt = subcribeAt + ONE_DAY;
    const endAt = subcribeAt + duration * ONE_DAY;

    const deposit = async () => {

        if(isLoading) {
            return
        }

        try {
            setIsLoading(true);
            const { message } = await FetchApi({
                url: API_DEPOSIT_EARN,
                options: {
                    method: 'POST',
                    params: {
                        asset,
                        pool_id: id,
                        amount: depositAmount,
                        isRenew: autoRenew
                    }
                }
            });
            if (message === 'ok') {
                dispatch(getUserEarnBalance());
                onConfirm?.();

            } else {
                toast({
                    text: t('earn:deposit_modal:error'),
                    type: 'error'
                });
            }
        } catch (error) {
            toast({
                text: t('earn:deposit_modal:error'),
                type: 'error'
            });
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <ModalV2 isVisible={true} onBackdropCb={isLoading ? null : onClose} className="max-w-[488px]">
            <div className="font-semibold text-2xl">{t('earn:deposit_modal:confirm_title')}</div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-4 flex flex-col space-y-4">
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:deposit_amount')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(depositAmount, assetInfo?.assetDigit || 0)} {asset}
                    </div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:reward_asset')}</div>
                    <div className="font-semibold text-right">{rewardAsset}</div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:period')}</div>
                    <div className="font-semibold text-right">
                        {duration} {duration > 1 ? t('common:days') : t('common:day')}
                    </div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:apr')}</div>
                    <div className="font-semibold text-right text-teal">{(apr * 100).toFixed(2)}%</div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:starts_at')}</div>
                    <div className="font-semibold text-right">{formatDateTime(subcribeAt)}</div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:profits_at')}</div>
                    <div className="font-semibold text-right">{formatDateTime(profitAt)}</div>
                </div>
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:ends_at')}</div>
                    <div className="font-semibold text-right">{formatDateTime(endAt)}</div>
                </div>
                {autoRenew && (
                    <div className="flex justify-between space-x-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:renews_at')}</div>
                        <div className="font-semibold text-right">{formatDateTime(endAt)}</div>
                    </div>
                )}
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-4 flex flex-col space-y-4">
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:estimated_profit')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(estimatedReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                    </div>
                </div>
            </div>

            <div className="h-10"></div>
            <Button className="w-full" onClick={deposit} loading={isLoading} >
                {t('earn:deposit_modal:confirm')}
            </Button>
        </ModalV2>
    );
};

export default ConfirmModal;
