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
import Tooltip from 'components/common/Tooltip';

const formatDateTime = (date = 0) => {
    return formatDate(date, 'hh:mm:ss dd/MM/yyyy');
};

const ConfirmModal = ({ onClose, onConfirm, pool, estimatedReward, depositAmount, subcribeAt, autoRenew, isLoading }) => {
    const { asset, rewardAsset, duration, apr, id } = pool;
    const { t } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const dispatch = useDispatch();

    const profitAt = subcribeAt + ONE_DAY;
    const endAt = subcribeAt + duration * ONE_DAY;


    return (
        <ModalV2 isVisible={true} onBackdropCb={isLoading ? null : onClose} className="max-w-[488px]">
            <div className="font-semibold text-2xl">{t('earn:deposit_modal:confirm_title')}</div>

            <div className="h-6"></div>

            <Tooltip
                className="w-[calc(50%-2.75rem)] after:!left-6"
                isV3
                id="apr-confirm-tooltip"
                place="top"
                effect="solid"
                overridePosition={({ left, top }) => ({ left: 32, top: top })}
            >
                {t('earn:deposit_modal:apr_tooltip')}
            </Tooltip>
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
                    <div
                        className="text-txtSecondary dark:text-txtSecondary-dark border-b border-dashed border-gray-1 dark:border-gray-7"
                        data-tip=""
                        data-for="apr-confirm-tooltip"
                    >
                        {t('earn:deposit_modal:apr')}
                    </div>
                    <div className="font-semibold text-right text-green-3 dark:text-green-2">{(apr * 100).toFixed(2)}%</div>
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
            <Button className="w-full" onClick={onConfirm} loading={isLoading}>
                {t('earn:deposit_modal:confirm')}
            </Button>
        </ModalV2>
    );
};

export default ConfirmModal;
