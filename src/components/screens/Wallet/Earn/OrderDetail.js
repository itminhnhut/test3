import React, { useMemo, useState } from 'react';
import SwitchV2 from 'components/common/V2/SwitchV2';
import ModalV2 from 'components/common/V2/ModalV2';
import AddCircle from 'components/svg/AddCircle';
import TradingInput from 'components/trade/TradingInput';
import AssetLogo from 'components/wallet/AssetLogo';
import { ONE_DAY } from 'constants/constants';
import { format as formatDate } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { getAssetFromCode } from 'redux/actions/utils';
import { WalletCurrency, formatNumber } from 'utils/reference-utils';
import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/V2/ButtonV2/Button';
import FetchApi from 'utils/fetch-api';
import { API_DEPOSIT_EARN, API_EARN_CLAIM_REWARD, API_EARN_REDEEM, API_EARN_TOGGLE_RENEW, API_GET_MARKET_WATCH } from 'redux/actions/apis';
import toast from 'utils/toast';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';
import Tooltip from 'components/common/Tooltip';
import { ChevronRight, Clock } from 'react-feather';
import classNames from 'classnames';
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect';
import { BxsInfoCircle } from 'components/svg/SvgIcon';

const formatDateTime = (date = 0) => {
    return formatDate(date, 'hh:mm dd/MM/yyyy');
};

const getUTCToday = () => {
    const now = new Date();
    const d = now.getUTCDate();
    const m = now.getUTCMonth();
    const y = now.getUTCFullYear();
    const utcToday = Date.UTC(y, m, d);
    return utcToday;
};

const Token = ({ symbol }) => {
    return (
        <div className="flex space-x-2 items-center">
            <span className="font-semibold">{symbol}</span>
        </div>
    );
};

const STATUS = {
    SUSPENDING: 'suspending',
    NON_RENEWAL: 'non_renewal',
    RENEWAL: 'renewal',
}

const suspendDuration = 1800000 // 30 min
const EarnPositionDetail = ({ onClose, position, marketWatch }) => {
    const {
        asset,
        rewardAsset,
        rewardAmt = 0,
        withdrewAmt = 0,
        isRenew,
        duration,
        apr = 0,
        amount = 0,
        _id,
        purchaseTime,
        rewardsEndDate,
        redeemDate,
        canRedeemEarly
    } = position;
    const { t } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const [autoRenew, setAutoRenew] = useState(isRenew);
    const [depositAmount, setDepositAmount] = useState(amount);
    const [claimedAmount, setClaimedAmount] = useState(withdrewAmt);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuspending, setIsSuspending] = useState(false);
    const quote = useMemo(() => {
        const tokenPair = marketWatch?.find((pair) => {
            return pair.b === asset && pair.q === rewardAsset;
        });
        return tokenPair?.p || 1;
    }, [marketWatch, asset, rewardAsset]);
    const estDailyReward = apr * quote * amount / 365

    const today = getUTCToday();
    const subcribeAt = today + ONE_DAY;
    const profitAt = subcribeAt + ONE_DAY;
    const endAt = profitAt + ONE_DAY;

    const now = Date.now();
    useIsomorphicLayoutEffect(() => {
        const today = getUTCToday();
        let timeout;
        if (now < today + suspendDuration / 2) {
            setIsSuspending(true);
            timeout = setTimeout(() => {
                setIsSuspending(false);
            }, today + suspendDuration / 2 - now);
        } else if (now > today + ONE_DAY - suspendDuration / 2) {
            setIsSuspending(true);
            timeout = setTimeout(() => {
                setIsSuspending(false);
            }, today + ONE_DAY + suspendDuration / 2 - now);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [now]);

    const suspend_msg = useMemo(() => {
        const from = formatDate(today - suspendDuration / 2, 'hh:mm');
        const to = formatDate(today + suspendDuration / 2, 'hh:mm');

        return t('wallet:earn_wallet:position:suspending_desc', { from, to });
    }, [t]);


    const isEarly = now < redeemDate * 1000;
    const canRedeem = !isSuspending && depositAmount && (!isEarly || !!canRedeemEarly);
    const leftOverReward = rewardAmt - claimedAmount;
    const canClaim = !isSuspending && leftOverReward > 0 && !isLoading;
    const redeem = async () => {
        if (!canRedeem || isLoading) {
            return;
        }

        try {
            setIsLoading(true)
            const { message } = await FetchApi({
                url: API_EARN_REDEEM,
                options: {
                    method: 'POST',
                    params: {
                        _id
                    }
                }
            });
            if (message === 'ok') {
                toast({
                    text: t('wallet:earn_wallet:position:redeem_success'),
                    type: 'success'
                });
                setDepositAmount(0)
            } else {
                toast({
                    text: t('wallet:earn_wallet:position:error'),
                    type: 'error'
                });
            }
        } catch (error) {
            toast({
                text: t('wallet:earn_wallet:position:error'),
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };
    const claimProfit = async () => {
        if (!canClaim) {
            return;
        }

        try {
            setIsLoading(true);
            const { message } = await FetchApi({
                url: API_EARN_CLAIM_REWARD,
                options: {
                    method: 'POST',
                    params: {
                        _id
                    }
                }
            });
            if (message === 'ok') {
                toast({
                    text: t('wallet:earn_wallet:position:claim_success'),
                    type: 'success'
                });
                setClaimedAmount(rewardAmt)
            } else {
                toast({
                    text: t('wallet:earn_wallet:position:error'),
                    type: 'error'
                });
            }
        } catch (error) {
            toast({
                text: t('wallet:earn_wallet:position:error'),
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };
    const toggleAutoRenew = async () => {
        try {
            setIsLoading(true);
            const { message } = await FetchApi({
                url: API_EARN_TOGGLE_RENEW,
                options: {
                    method: 'PUT',
                    params: {
                        _id
                    }
                }
            });
            if (message === 'ok') {
                setAutoRenew(old => !old);
            }
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const status = isSuspending ? STATUS.SUSPENDING : autoRenew ? STATUS.RENEWAL : STATUS.NON_RENEWAL;
    const Bagde = useMemo(() => {
        return (
            <div
                className={classNames('rounded-2xl flex space-x-2 items-center py-1 px-4', {
                    'bg-yellow-2/10 text-yellow-2': status === STATUS.SUSPENDING,
                    'bg-divider dark:bg-divider-dark text-txtSecondary dark:txt-txtSecondary-dark': status === STATUS.NON_RENEWAL,
                    'bg-green-2/10 text-green-2': status === STATUS.RENEWAL
                })}
            >
                <Clock color="currentColor" size={13} />
                <span className="text-sm">{t(`wallet:earn_wallet:position:${status}`)}</span>
            </div>
        );
    }, [t, autoRenew, isSuspending, status]);

    return (
        <ModalV2 isVisible={true} onBackdropCb={onClose} className="w-[600px]">
            <div className="font-semibold text-2xl">{t('wallet:earn_wallet:position:title')}</div>

            <div className="text-center flex flex-col space-y-4 items-center mt-6">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:earn_wallet:position:description', {
                        asset,
                        rewardAsset
                    })}
                </div>
                <div className="flex items-center space-x-2">
                    <AssetLogo assetId={WalletCurrency[asset]} size={48} />
                    <ChevronRight color="currentColor" size={24} />
                    <AssetLogo assetId={WalletCurrency[rewardAsset]} size={48} />
                </div>

                <div className="font-semibold text-2xl">
                    {formatNumber(amount, asset?.assetDigit || 0)} {asset}
                </div>

                {Bagde}
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl">
                <Tooltip
                    className="max-w-[calc(100%-6rem)] after:!left-6"
                    isV3
                    id="unclaimed-tooltip"
                    place="top"
                    effect="solid"
                    overridePosition={({ left, top }) => ({ left: 32, top: top })}
                >
                    {t('wallet:earn_wallet:position:unclaimed_tooltip')}
                </Tooltip>
                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:apr')}</div>
                    <div className="font-semibold text-teal text-right">{+(apr * 100).toFixed(2)}%</div>
                </div>
                <div className="flex justify-between mt-4">
                    <div
                        className="text-txtSecondary dark:text-txtSecondary-dark border-dashed border-b border-gray-1 dark:border-gray-7"
                        data-tip=""
                        data-for="unclaimed-tooltip"
                    >
                        {t('wallet:earn_wallet:position:estimated_profit')}
                    </div>
                    <div className="font-semibold text-right">
                        {formatNumber(estDailyReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                    </div>
                </div>
                <div className="flex justify-between py-3 mt-3">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:unclaimed_profit')}</div>
                    <div className="font-semibold text-right">
                        <span>
                            {formatNumber(leftOverReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                        </span>
                        <span
                            className={classNames(
                                'ml-3 cursor-pointer',
                                canClaim ? 'text-teal cursor-pointer' : 'text-txtDisabled dark:text-txtDisabled-dark cursor-not-allowed'
                            )}
                            onClick={claimProfit}
                        >
                            {t('wallet:earn_wallet:position:claim')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl">
                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:period')}</div>
                    <div className="font-semibold text-right">
                        {duration} {duration > 1 ? t('common:days') : t('common:day')}
                    </div>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:subcribed_at')}</div>
                    <div className="font-semibold text-right">{formatDateTime(purchaseTime || subcribeAt)}</div>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:profited_at')}</div>
                    <div className="font-semibold text-right">{formatDateTime(rewardsEndDate || endAt)}</div>
                </div>
                {autoRenew && (
                    <div className="flex justify-between mt-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:renew_at')}</div>
                        <div className="font-semibold text-right">{formatDateTime(rewardsEndDate || endAt)}</div>
                    </div>
                )}
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl">
                {isSuspending ? (
                    <>
                        <div className="flex items-center font-semibold space-x-2.5">
                            <BxsInfoCircle size={20} />
                            <span>{t('common:note')}</span>
                        </div>
                        <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">{suspend_msg}</div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center font-semibold space-x-4">
                            <span>{t('wallet:earn_wallet:position:auto_renew')}</span>
                            <SwitchV2 processing={isLoading} checked={autoRenew} onChange={toggleAutoRenew} />
                        </div>
                        <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:auto_renew_tooltip')}</div>
                    </>
                )}
            </div>

            <div className="h-10"></div>
            <Button className="w-full" disabled={canRedeem} loading={isLoading} onClick={redeem}>
                {t('wallet:earn_wallet:position:redeem')}
            </Button>
        </ModalV2>
    );
};

export default EarnPositionDetail;
