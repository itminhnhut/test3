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
import { formatNumber, getAssetFromCode } from 'redux/actions/utils';
import { WalletCurrency } from 'utils/reference-utils';
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
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import RedeemConfirm from './RedeemConfirm';

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

const ERROR = {
    POSITION_NOT_FOUND: {
        en: 'Position not found',
        vi: 'Vị thế Earn ko tìm thấy'
    },
    INVALID_REDEEM_EARLIER: {
        en: 'Could not redeem in earn time',
        vi: 'Ko thể redeem trước hạn'
    },
    INVALID_POSITION_STATUS: {
        en: 'This position is ended',
        vi: 'Vị thế này đã kết thúc'
    },
    INVALID_REWARD_AMOUNT: {
        en: 'No reward to claim',
        vi: 'hết ròi'
    },
    RENEW_UNAVAILABLE: {
        en: 'Unable to renew',
        vi: 'ko renew được'
    },
    429: {
        en: 'No spam',
        vi: 'ko spam'
    },
    INVALID_MAINTENANCE_TIME: {
        en: 'Earn system is currently suspending',
        vi: 'Chuơng trình Earn đang trong giai đoạn bảo trì'
    }
};

const STATUS = {
    SUSPENDING: 'suspending',
    NON_RENEWAL: 'non_renewal',
    RENEWAL: 'renewal'
};

const MODAL = {
    REDEEM_CONFIRM: 'REDEEM_CONFIRM',
    REDEEM_WARNING: 'REDEEM_WARNING',
    REDEEM_SUCCESS: 'REDEEM_SUCCESS'
};

const suspendDuration = 1800000; // 30 min
const EarnPositionDetail = ({ onClose, position, usdRate }) => {
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
        canRedeemEarly,
        canReStake
    } = position;
    const { t } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const [autoRenew, setAutoRenew] = useState(isRenew);
    const [depositAmount, setDepositAmount] = useState(amount);
    const [claimedAmount, setClaimedAmount] = useState(withdrewAmt);
    const [isLoading, setIsLoading] = useState(false);
    const [actionError, setActionError] = useState();
    const [modal, setModal] = useState();
    const [isSuspending, setIsSuspending] = useState(false);
    const router = useRouter();
    const quote = useMemo(() => {
        if (asset === rewardAsset) {
            return 1;
        }

        const assetPrice = usdRate?.[WalletCurrency[asset]] || 0;
        const rewardPrice = usdRate?.[WalletCurrency[rewardAsset]] || 0;

        return rewardPrice === 0 ? 1 : assetPrice / rewardPrice;
    }, [usdRate, asset, rewardAsset]);
    const estDailyReward = (apr * quote * depositAmount) / 365;
    const equivalentClaimedReward = claimedAmount / quote;

    const today = getUTCToday();

    const now = Date.now();
    useIsomorphicLayoutEffect(() => {
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
        } else {
            timeout = setTimeout(() => {
                setIsSuspending(true);
            }, today + ONE_DAY - suspendDuration / 2 - now);
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

    const isEarly = now < rewardsEndDate * 1000;
    const canRedeem = !isSuspending && depositAmount && (!isEarly || !!canRedeemEarly) && !isLoading;
    const leftOverReward = rewardAmt - claimedAmount;
    const canClaim = !isSuspending && leftOverReward > 0 && !isLoading;

    const redeem = async () => {
        if (!canRedeem) {
            return;
        }

        try {
            setIsLoading(true);
            const { message, code } = await FetchApi({
                url: API_EARN_REDEEM,
                options: {
                    method: 'POST',
                    params: {
                        _id
                    }
                }
            });
            if (message === 'ok') {
                setDepositAmount(0);
                setModal(MODAL.REDEEM_SUCCESS);
            } else {
                closeModal();
                const error = ERROR[code || '']?.[language];
                setActionError(error || t('wallet:earn_wallet:position:error'));
            }
        } catch (error) {
            setActionError(t('wallet:earn_wallet:position:error'));

        } finally {
            setIsLoading(false);
        }
    }
    const openRedeemModal = () => {
        if (!canRedeem) {
            return;
        }
        if (isEarly) {
            setModal(MODAL.REDEEM_WARNING);
            return;
        } else {
            setModal(MODAL.REDEEM_CONFIRM);
        }
    };

    const claimProfit = async () => {
        if (!canClaim) {
            return;
        }

        try {
            setIsLoading(true);
            const { message, code } = await FetchApi({
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
                setClaimedAmount(rewardAmt);
            } else {
                const error = ERROR[code || '']?.[language];
                setActionError(error || t('wallet:earn_wallet:position:error'));
            }
        } catch (error) {
            setActionError(t('wallet:earn_wallet:position:error'));
        } finally {
            setIsLoading(false);
        }
    };
    const toggleAutoRenew = async () => {
        try {
            setIsLoading(true);
            const { message, code } = await FetchApi({
                url: API_EARN_TOGGLE_RENEW,
                options: {
                    method: 'PUT',
                    params: {
                        _id
                    }
                }
            });
            if (message === 'ok') {
                setAutoRenew((old) => !old);
            } else {
                const error = ERROR[code || '']?.[language];
                setActionError(error || t('wallet:earn_wallet:position:error'));
            }
        } catch (error) {
            setActionError(t('wallet:earn_wallet:position:error'));
        } finally {
            setIsLoading(false);
        }
    };
    const closeModal = () => setModal(undefined);
    const closeErrorModal = () => setActionError(undefined);

    const status = isSuspending ? STATUS.SUSPENDING : autoRenew ? STATUS.RENEWAL : STATUS.NON_RENEWAL;
    const Bagde = useMemo(() => {
        return (
            <div
                className={classNames('rounded-2xl flex space-x-2 items-center py-1 px-4', {
                    'bg-yellow-2/10 text-yellow-2': status === STATUS.SUSPENDING,
                    'bg-divider dark:bg-divider-dark text-txtTextBtn-tonal dark:text-txtTextBtn-tonal_dark': status === STATUS.NON_RENEWAL,
                    'bg-green-2/10 text-green-3 dark:text-green-2': status === STATUS.RENEWAL
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
                    {formatNumber(depositAmount, assetInfo?.assetDigit || 0)} {asset}
                </div>

                {Bagde}
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl">
                <Tooltip
                    className="max-w-[calc(100%-6rem)] after:!left-6"
                    isV3
                    id="estimated_profit"
                    place="top"
                    // effect="solid"
                    overridePosition={({ left, top }) => ({ left: 32, top: 400 })}
                >
                    {t('wallet:earn_wallet:position:unclaimed_tooltip')}
                </Tooltip>
                <div className="flex justify-between">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:apr')}</div>
                    <div className="font-semibold text-green-3 dark:text-green-2 text-right">{+(apr * 100).toFixed(2)}%</div>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:estimated_profit')}</div>
                    <div className="font-semibold text-right">
                        {formatNumber(estDailyReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                    </div>
                </div>
                <div className="flex justify-between py-3 mt-3">
                    <div
                        className="text-txtSecondary dark:text-txtSecondary-dark divide-dashed border-dashed border-b border-gray-1 dark:border-gray-7"
                        data-tip=""
                        data-for="estimated_profit"
                    >
                        {t('wallet:earn_wallet:position:unclaimed_profit')}
                    </div>
                    <span className="font-semibold text-right flex items-center flex-1 space-x-3">
                        <span className="flex-1">
                            {formatNumber(leftOverReward, rewardInfo?.assetDigit || 0)} {rewardAsset}
                        </span>
                        {leftOverReward > 0 && (
                            <Button className="!p-0 !h-auto !w-auto" variants="text" onClick={claimProfit} disabled={!canClaim} loading={isLoading}>
                                {t('wallet:earn_wallet:position:claim')}
                            </Button>
                        )}
                    </span>
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
                    <div className="font-semibold text-right">{formatDateTime(purchaseTime)}</div>
                </div>
                <div className="flex justify-between mt-4">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:profited_at')}</div>
                    <div className="font-semibold text-right">{formatDateTime(rewardsEndDate)}</div>
                </div>
                {autoRenew && (
                    <div className="flex justify-between mt-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:renew_at')}</div>
                        <div className="font-semibold text-right">{formatDateTime(rewardsEndDate)}</div>
                    </div>
                )}
            </div>

            <div className="h-6"></div>

            <div className="bg-gray-13 dark:bg-dark-4 p-4 rounded-xl">
                {isSuspending ? (
                    <>
                        {canReStake ? (
                            <div className="flex items-center font-semibold space-x-4">
                                <span>{t('wallet:earn_wallet:position:auto_renew')}</span>
                                <SwitchV2 processing={isLoading} checked={autoRenew} disabled={true} />
                            </div>
                        ) : (
                            <div className="flex items-center font-semibold space-x-2.5">
                                <BxsInfoCircle size={20} />
                                <span>{t('common:note')}</span>
                            </div>
                        )}

                        <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">{suspend_msg}</div>
                    </>
                ) : (
                    <>
                        {canReStake && (
                            <>
                                <div className="flex items-center font-semibold space-x-4">
                                    <span>{t('wallet:earn_wallet:position:auto_renew')}</span>
                                    <SwitchV2 processing={isLoading} checked={autoRenew} onChange={toggleAutoRenew} />
                                </div>
                                <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:earn_wallet:position:auto_renew_tooltip')}</div>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="h-10"></div>
            <Button className="w-full" disabled={!canRedeem} loading={isLoading} onClick={openRedeemModal}>
                {t('wallet:earn_wallet:position:redeem')}
            </Button>

            <AlertModalV2
                isVisible={modal === MODAL.REDEEM_WARNING}
                type="warning"
                onConfirm={() => setModal(MODAL.REDEEM_CONFIRM)}
                onClose={closeModal}
                title={t('wallet:earn_wallet:position:early_redeem')}
                textButton={t('common:confirm')}
                message={t('wallet:earn_wallet:position:early_redeem_note')}
            />
            <AlertModalV2
                isVisible={modal === MODAL.REDEEM_SUCCESS}
                type="success"
                onConfirm={() => {
                    closeModal();
                    setTimeout(() => router.push('/earn?tab=history'));
                }}
                onClose={() => {
                    // don't use onClose() real quick. It will produce a bug
                    closeModal();
                    setTimeout(onClose);
                }}
                textButton={t('wallet:earn_wallet:position:go_to_history')}
                message={t('wallet:earn_wallet:position:redeem_success')}
            >
                <div className="text-xl font-semibold text-center mt-4">
                    {formatNumber(amount - equivalentClaimedReward, assetInfo?.assetDigit || 0)} {asset}
                </div>
            </AlertModalV2>
            <AlertModalV2 isVisible={!!actionError} title={t('common:error')} type="error" onClose={closeErrorModal} message={actionError} />
            <RedeemConfirm
                isVisible={modal === MODAL.REDEEM_CONFIRM}
                position={position}
                amount={depositAmount}
                claimedReward={claimedAmount}
                quote={quote}
                isEarly={isEarly}
                onClose={() => {
                    closeModal();
                    setTimeout(onClose);
                }}
                onConfirm={redeem}
                isLoading={isLoading}
            />
        </ModalV2>
    );
};

export default EarnPositionDetail;
