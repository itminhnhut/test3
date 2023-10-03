import React, { memo, useMemo, useState } from 'react';
import SwitchV2 from 'components/common/V2/SwitchV2';
import ModalV2 from 'components/common/V2/ModalV2';
import AddCircle from 'components/svg/AddCircle';
import TradingInput from 'components/trade/TradingInput';
import AssetLogo from 'components/wallet/AssetLogo';
import { ONE_DAY } from 'constants/constants';
import { format as formatDate, startOfTomorrow } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { getAssetFromCode, getLoginUrl } from 'redux/actions/utils';
import { WalletCurrency, formatNumber } from 'utils/reference-utils';
import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/V2/ButtonV2/Button';
import FetchApi from 'utils/fetch-api';
import { API_DEPOSIT_EARN, API_GET_MARKET_WATCH } from 'redux/actions/apis';
import toast from 'utils/toast';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';
import Tooltip from 'components/common/Tooltip';
import { KYC_STATUS } from 'redux/actions/const';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import ErrorTriggersIcon from 'components/svg/ErrorTriggers';
import classNames from 'classnames';


const formatDateTime = (date = 0) => {
    return formatDate(date, 'hh:mm dd/MM/yyyy');
};


const SuccessModal = ({ onClose, pool, estimatedReward, depositAmount, autoRenew }) => {
    const { asset, rewardAsset, duration, apr } = pool;
    const { t } = useTranslation();
    const router = useRouter();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);

    const goToWallet = async () => {
        router.push('/wallet/earn')
    };

    return (
        <ModalV2 isVisible={true} onBackdropCb={onClose} className="max-w-[488px]">
            <div className="font-semibold text-2xl">{t('earn:deposit_modal:success_title')}</div>

            <div className="h-6"></div>

            <img src="/images/screen/earn/earn_success.png" alt="" className="mx-auto w-[11.25rem] h-[11.25rem] dark:hidden" />
            <img src="/images/screen/earn/earn_success-dark.png" alt="" className="mx-auto w-[11.25rem] h-[11.25rem] hidden dark:block" />

            <div className="h-6"></div>

            <div className="text-txtSecondary dark:text-txtSecondary-dark text-center">{t('earn:deposit_modal:success_title')}</div>

            <div className="h-4"></div>

            <div className="font-semibold text-center text-2xl">
                {formatNumber(depositAmount, assetInfo?.assetDigit || 0)} {asset}
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-4 flex flex-col space-y-4">
                <div className="flex justify-between space-x-2">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:apr')}</div>
                    <div className="font-semibold text-right text-teal">{(apr * 100).toFixed(2)}%</div>
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
            <Button className="w-full" onClick={goToWallet}>
                {t('earn:deposit_modal:go_to_wallet')}
            </Button>
        </ModalV2>
    );
};

export default SuccessModal;
