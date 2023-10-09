import React, { useMemo, useState } from 'react';
import SwitchV2 from 'components/common/V2/SwitchV2';
import ModalV2 from 'components/common/V2/ModalV2';
import AddCircle from 'components/svg/AddCircle';
import TradingInput from 'components/trade/TradingInput';
import AssetLogo from 'components/wallet/AssetLogo';
import { ONE_DAY } from 'constants/constants';
import { format as formatDate, startOfTomorrow } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { formatNumber, getAssetFromCode, getLoginUrl } from 'redux/actions/utils';
import { WalletCurrency } from 'utils/reference-utils';
import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/V2/ButtonV2/Button';
import FetchApi from 'utils/fetch-api';
import { API_DEPOSIT_EARN, API_GET_MARKET_WATCH, API_GET_USD_RATE } from 'redux/actions/apis';
import toast from 'utils/toast';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';
import Tooltip from 'components/common/Tooltip';
import { KYC_STATUS } from 'redux/actions/const';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import ErrorTriggersIcon from 'components/svg/ErrorTriggers';
import classNames from 'classnames';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import SuccessModal from '../SuccessModal/SuccessModal';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

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

const Token = ({ symbol, className }) => {
    return (
        <div className={classNames('flex space-x-2 items-center', className)}>
            <AssetLogo assetId={WalletCurrency[symbol]} size={24} />
            <span className="font-semibold">{symbol}</span>
        </div>
    );
};

const MODAL = {
    CONFIRM: 'CONFIRM',
    SUCCESS: 'SUCCESS',
    KYC: 'KYC'
};

const ERROR = {
    FARMING_POOL_NOT_FOUND: {
        en: 'This pool is currently inactive',
        vi: 'Pool ko khả dụng'
    },
    PROJECT_NOT_FOUND: {
        en: 'This pool is not existed',
        vi: 'Pool ko tồn tại'
    },
    INVALID_SUBSCRIPTION_START_TIME: {
        en: 'This pool is not ready yet',
        vi: 'Pool này chưa bắt đầu'
    },
    INVALID_PROJECT: {
        en: 'This pool is full',
        vi: 'Pool này đã đầy'
    },
    INVALID_AMOUNT: {
        en: 'Invalid amount',
        vi: 'Số lượng nạp ko hợp lệ'
    },
    INVALID_BALANCEL: {
        en: 'Insufficient balance',
        vi: 'Hết tiền ròi'
    },
    INVALID_MAINTENANCE_TIME: {
        en: 'Earn system is currently suspending',
        vi: 'Chuơng trình Earn đang trong giai đoạn bảo trì'
    }
};

const EarnModal = ({ onClose, pool, isSuspending }) => {
    const { asset, rewardAsset, accumulatedAmount, totalSupply, duration, apr, min, max, id, renewable } = pool;
    const { t, i18n: { language } } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const [depositAmount, setDepositAmount] = useState();
    const [depositError, setDepositError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [autoRenew, setAutoRenew] = useState(true);
    const [agree, setAgree] = useState(false);
    const [openModal, setOpenModal] = useState();
    const auth = useSelector((state) => state?.auth?.user || null);
    const kyc_status = auth?.kyc_status ?? KYC_STATUS.NO_KYC;

    const userBalance =
        useSelector((state) => {
            const userAsset = state?.wallet?.SPOT?.[WalletCurrency[asset]];
            if (!userAsset) {
                return 0;
            }
            const { value = 0, locked_value = 0 } = userAsset;
            return value - locked_value;
        }) || 0;
    const { data: usdRate } = useQuery([API_GET_USD_RATE], async () => {
        const { data } = await FetchApi({
            url: API_GET_USD_RATE
        });
        if (data) {
            data[39] = data[72];
        }
        return data;
    });
    const quote = useMemo(() => {
        if (asset === rewardAsset) {
            return 1;
        }

        const assetPrice = usdRate?.[WalletCurrency[asset]] || 0;
        const rewardPrice = usdRate?.[WalletCurrency[rewardAsset]] || 0;

        return rewardPrice === 0 ? 0 : assetPrice / rewardPrice;
    }, [usdRate, asset, rewardAsset]);
    const router = useRouter();

    const poolLoad = +((accumulatedAmount * 100) / totalSupply).toFixed(2);
    const availableSize = totalSupply - accumulatedAmount;

    const utcToday = getUTCToday();
    const subcribeAt = utcToday + ONE_DAY;
    const profitAt = subcribeAt + ONE_DAY;
    const endAt = subcribeAt + duration * ONE_DAY;

    const maxDeposit = Math.min(max, availableSize);
    const isSoldOut = availableSize < min || availableSize === 0;

    const estimatedReward = (quote * apr * duration * +depositAmount) / 365;

    const validation = useMemo(() => {
        let isValid = true;
        let msg = null;
        if (min > +depositAmount) {
            msg = t('earn:deposit_modal:min_deposit') + ` ${min}`;
            isValid = false;
        }
        if (maxDeposit < +depositAmount) {
            msg = t('earn:deposit_modal:max_deposit') + ` ${maxDeposit}`;
            isValid = false;
        }
        if (userBalance < +depositAmount) {
            msg = t('earn:deposit_modal:insufficient');
            isValid = false;
        }
        return { isValid, msg, isError: !isValid };
    }, [depositAmount, min, maxDeposit, userBalance]);

    const canDeposit = !isSoldOut && !validation.isError && depositAmount && agree;
    let systemMsg = '';
    if (isSoldOut) {
        systemMsg = t('earn:deposit_modal:pool_full');
    } else if (isSuspending) {
        systemMsg = t('earn:deposit_modal:suspending');
    }

    const closeModal = () => setOpenModal(undefined);
    const closeErrorModal = () => setDepositError(undefined);
    const buyToken = () => {
        router.push({
            pathname: '/withdraw-deposit/crypto',
            query: {
                side: 'BUY',
                assetId: asset
            }
        });
    };
    const deposit = async () => {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            const { message, code } = await FetchApi({
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
                setOpenModal(MODAL.SUCCESS);
            } else {
                closeModal();
                const error = ERROR[code || '']?.[language];
                setDepositError(error || t('earn:deposit_modal:error'));
            }
        } catch (error) {
            closeModal();
            setDepositError(t('earn:deposit_modal:error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalV2 isVisible={true} onBackdropCb={onClose} className="max-w-[800px]">
            <div className="font-semibold text-2xl">
                {t('earn:deposit_modal:title', {
                    asset,
                    reward: rewardAsset
                })}
            </div>

            <div className="grid grid-cols-2 gap-x-6 mt-6">
                <div className="">
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
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:pool_size')}:</div>
                            <div className="font-semibold text-right">
                                {formatNumber(totalSupply, assetInfo?.assetDigit || 0)} {asset} ({poolLoad}%)
                            </div>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:available_size')}:</div>
                            <div className="font-semibold text-right">
                                {formatNumber(availableSize, assetInfo?.assetDigit || 0)} {asset}
                            </div>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:period')}:</div>
                            <div className="font-semibold text-right">
                                {duration} {duration > 1 ? t('common:days') : t('common:day')}
                            </div>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <div
                                className="text-txtSecondary dark:text-txtSecondary-dark border-b border-dashed border-gray-1 dark:border-gray-7"
                                data-tip=""
                                data-for="apr-tooltip"
                            >
                                {t('earn:deposit_modal:apr')}:
                            </div>
                            <div className="font-semibold text-right text-green-3 dark:text-green-2">{+(apr * 100).toFixed(2)}%</div>
                        </div>
                    </div>
                    {systemMsg && (
                        <div className="mt-2 flex items-center text-red space-x-1">
                            <ErrorTriggersIcon />
                            <span className="text-xs">{systemMsg}</span>
                        </div>
                    )}

                    <div className="h-6"></div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">{t('earn:deposit_modal:amount')}</span>
                        {auth && (
                            <div className="flex space-x-1 py-2 text-sm items-center">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:available')}:</span>
                                <span className="font-semibold">{formatNumber(userBalance, assetInfo?.assetDigit || 0)}</span>
                                <AddCircle onClick={buyToken} size={16} className="cursor-pointer" />
                            </div>
                        )}
                    </div>
                    <TradingInput
                        containerClassName="mt-2"
                        inputClassName="!text-left"
                        value={depositAmount}
                        onValueChange={({ value }) => setDepositAmount(value)}
                        renderTail={
                            <div className="flex items-center">
                                <Button className="pr-3" variants="text" onClick={() => setDepositAmount(Math.min(userBalance, maxDeposit))}>
                                    MAX
                                </Button>
                                <Token symbol={asset} className="pl-3 border-l border-divider dark:border-divider-dark" />
                            </div>
                        }
                        placeholder={t('earn:deposit_modal:placeholder')}
                        allowedDecimalSeparators={[',', '.']}
                        decimalScale={assetInfo?.assetDigit || 0}
                        thousandSeparator={true}
                        validator={validation}
                        allowNegative={false}
                        errorTooltip={false}
                        inputMode="decimal"
                    />

                    {renewable && (
                        <>
                            <Tooltip
                                className="w-[calc(50%-2.75rem)] after:!left-6"
                                isV3
                                id="renew-tooltip"
                                place="top"
                                effect="solid"
                                overridePosition={({ left, top }) => ({ left: 32, top: top })}
                            >
                                {t('earn:deposit_modal:renew_tooltip')}
                            </Tooltip>
                            <div className="mt-4 flex space-x-4">
                                <span className="font-semibold border-b border-dashed border-gray-1 dark:border-gray-7" data-tip="" data-for="renew-tooltip">
                                    {t('earn:deposit_modal:auto_renew')}
                                </span>
                                <SwitchV2 checked={autoRenew} onChange={setAutoRenew} />
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-4">
                    <div className="font-semibold">{t('earn:deposit_modal:summary')}</div>
                    <div className="h-4"></div>

                    <div className="flex justify-between space-x-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:estimated_profit')}:</div>
                        <div className="font-semibold">
                            {formatNumber(estimatedReward, rewardInfo?.assetDigit ?? 0)} {rewardAsset}
                        </div>
                    </div>
                    <div className="flex justify-between space-x-2 mt-3">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:quote')}:</div>
                        <div className="font-semibold">
                            {1} {asset} ≈ {formatNumber(quote, rewardInfo?.assetDigit ?? 0)} {rewardAsset}
                        </div>
                    </div>

                    <div className="h-5"></div>
                    <hr className="border-divider dark:border-divider-dark"></hr>
                    <div className="h-5"></div>

                    <div className="relative">
                        <div className="border-l border-gray-1 dark:border-gray-7 border-dashed h-full absolute"></div>
                        <div className="flex flex-col space-y-4">
                            <div className="relative">
                                <div className="bg-gray-13 dark:bg-dark-4 absolute h-1/2 w-2 -left-1"></div>
                                <div className="rounded-full bg-teal w-2 h-2 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                                <div className="flex justify-between space-x-2 items-center flex-1 ml-2">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:starts_at')}:</div>
                                    <div className="font-semibold text-right">{formatDateTime(subcribeAt)}</div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="rounded-full bg-teal w-2 h-2 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                                <div className="flex justify-between space-x-2 items-center flex-1 ml-2">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:profits_at')}:</div>
                                    <div className="font-semibold text-right">{formatDateTime(profitAt)}</div>
                                </div>
                            </div>
                            <div className="relative">
                                {!autoRenew && <div className="bg-gray-13 dark:bg-dark-4 absolute h-1/2 w-2 -left-1 bottom-0"></div>}
                                <div className="rounded-full bg-teal w-2 h-2 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                                <div className="flex justify-between space-x-2 items-center flex-1 ml-2">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:ends_at')}:</div>
                                    <div className="font-semibold text-right">{formatDateTime(endAt)}</div>
                                </div>
                            </div>
                            {autoRenew && (
                                <div className="relative">
                                    <div className="bg-gray-13 dark:bg-dark-4 absolute h-1/2 w-2 -left-1 bottom-0"></div>
                                    <div className="rounded-full bg-teal w-2 h-2 absolute -left-1 top-1/2 -translate-y-1/2"></div>
                                    <div className="flex justify-between space-x-2 items-center flex-1 ml-2">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:renews_at')}:</div>
                                        <div className="font-semibold text-right">{formatDateTime(endAt)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-8"></div>

            <CheckBox
                active={agree}
                onChange={() => {
                    setAgree((old) => !old);
                }}
                label={
                    <div
                        className=""
                        dangerouslySetInnerHTML={{
                            __html: t('earn:deposit_modal:terms')
                        }}
                    ></div>
                }
                sizeCheckIcon={24}
                boxContainerClassName="!w-6 !h-6"
                labelClassName="!text-sm md:!text-base"
            />

            <div className="h-10"></div>
            {auth ? (
                kyc_status === KYC_STATUS.APPROVED ? (
                    <Button className="w-full" disabled={!canDeposit} onClick={() => setOpenModal(MODAL.CONFIRM)}>
                        {t('earn:deposit_modal:deposit')}
                    </Button>
                ) : (
                    <Button className="w-full" onClick={() => setOpenModal(MODAL.KYC)}>
                        {t('common:kyc_now')}
                    </Button>
                )
            ) : (
                <HrefButton className="w-full" variants="primary" href={getLoginUrl('sso')}>
                    {t('common:sign_in')}
                </HrefButton>
            )}
            <ModalNeedKyc onBackdropCb={closeModal} isOpenModalKyc={openModal === MODAL.KYC} />
            {!isSuspending && openModal === MODAL.CONFIRM && (
                <ConfirmModal
                    pool={pool}
                    autoRenew={autoRenew}
                    depositAmount={depositAmount}
                    estimatedReward={estimatedReward}
                    onClose={closeModal}
                    subcribeAt={subcribeAt}
                    onConfirm={deposit}
                    isLoading={isLoading}
                />
            )}
            {openModal === MODAL.SUCCESS && (
                <SuccessModal
                    autoRenew={autoRenew}
                    depositAmount={depositAmount}
                    estimatedReward={estimatedReward}
                    pool={pool}
                    onClose={() => {
                        // don't use onClose() real quick. It will produce a bug
                        setOpenModal(undefined);
                        setTimeout(onClose);
                    }}
                    onConfirm={() => {
                        setOpenModal(undefined);
                        router.push('/wallet/earn');
                    }}
                />
            )}
            <AlertModalV2 isVisible={!!depositError} title={t('common:error')} type="error" onClose={closeErrorModal} message={depositError} />
        </ModalV2>
    );
};

export default EarnModal;
