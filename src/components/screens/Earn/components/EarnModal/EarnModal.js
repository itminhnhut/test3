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
import { getAssetFromCode } from 'redux/actions/utils';
import { WalletCurrency, formatNumber } from 'utils/reference-utils';
import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/V2/ButtonV2/Button';
import FetchApi from 'utils/fetch-api';
import { API_DEPOSIT_EARN, API_GET_MARKET_WATCH } from 'redux/actions/apis';
import toast from 'utils/toast';
import useQuery from 'hooks/useQuery';
import { useRouter } from 'next/router';
import Tooltip from 'components/common/Tooltip';

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

const suspendDuration = 1800000 // 30 minutes

const Token = ({ symbol }) => {
    return (
        <div className="flex space-x-2 items-center">
            <AssetLogo assetId={WalletCurrency[symbol]} size={24} />
            <span className="font-semibold">{symbol}</span>
        </div>
    );
};

const EarnModal = ({ onClose, pool, isSuspending }) => {
    const { asset, rewardAsset, accumulatedAmount, totalSupply, duration, apr, min, max, id } = pool;
    const { t } = useTranslation();
    const assetInfo = getAssetFromCode(asset);
    const rewardInfo = getAssetFromCode(rewardAsset);
    const [depositAmount, setDepositAmount] = useState();
    const [autoRenew, setAutoRenew] = useState(true);
    const [agree, setAgree] = useState(false);
    const userBalance = useSelector((state) => state?.wallet?.SPOT?.[WalletCurrency[asset]]?.value) || 0;
    const { data: spotList } = useQuery([API_GET_MARKET_WATCH], async () => {
        const { data } = await FetchApi({
            url: API_GET_MARKET_WATCH,
        });
        return data;
    });
    const quote = useMemo(() => {
        const tokenPair = spotList?.find((pair) => {
            return pair.b === asset && pair.q === rewardAsset;
        })
        return tokenPair?.p || 0;
    }, [spotList, asset, rewardAsset])
    const router = useRouter();

    const poolLoad = +((accumulatedAmount * 100) / totalSupply).toFixed(2);
    const availableSize = totalSupply - accumulatedAmount;

    const utcToday = getUTCToday();
    const subcribeAt = utcToday + ONE_DAY;
    const profitAt = subcribeAt + ONE_DAY;
    const endAt = profitAt + ONE_DAY;


    const maxDeposit = Math.min(max, availableSize);
    const isSoldOut = availableSize < min;

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
    let systemMsg = ''
    if (isSoldOut) {
        systemMsg = t('earn:deposit_modal:full_pool')
    } else if (isSuspending) {
        systemMsg = t('earn:deposit_modal:full_pool');
    }

    const deposit = async () => {
        if (!canDeposit) {
            return;
        }

        try {
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
                toast({
                    text: t('earn:deposit_modal:success'),
                    type: 'success'
                });
                onClose();
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
        }
    };
    const buyToken = () => {
        router.push({
            pathname: '/withdraw-deposit/crypto',
            query: {
                side: 'BUY',
                assetId: asset
            }
        });
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
                            <div
                                className="text-txtSecondary dark:text-txtSecondary-dark border-b border-dashed border-gray-1 dark:border-gray-7"
                                data-tip=""
                                data-for="apr-tooltip"
                            >
                                {t('earn:deposit_modal:apr')}:
                            </div>
                            <div className="font-semibold text-right">{+(apr * 100).toFixed(2)}%</div>
                        </div>
                        <div className="flex justify-between space-x-2">
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:period')}:</div>
                            <div className="font-semibold text-right">
                                {duration} {duration > 1 ? t('common:days') : t('common:day')}
                            </div>
                        </div>
                    </div>
                    {systemMsg && (
                        <div className="mt-2 flex items-center">
                            <ErrorTriggersIcon />
                            <span>{systemMsg}</span>
                        </div>
                    )}

                    <div className="h-6"></div>

                    <div className="flex justify-between items-center">
                        <span className="font-semibold">{t('earn:deposit_modal:amount')}</span>
                        <div className="flex space-x-1 py-2 text-sm items-center">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:available')}:</span>
                            <span className="font-semibold">{formatNumber(userBalance, asset.assetDigit || 0)}</span>
                            <AddCircle onClick={buyToken} size={16} />
                        </div>
                    </div>
                    <TradingInput
                        containerClassName="mt-2"
                        inputClassName="!text-left"
                        value={depositAmount}
                        onValueChange={({ value }) => setDepositAmount(value)}
                        renderTail={<Token symbol={asset} />}
                        placeholder={t('earn:deposit_modal:placeholder')}
                        allowedDecimalSeparators={[',', '.']}
                        decimalScale={assetInfo?.assetDigit || 0}
                        thousandSeparator={true}
                        validator={validation}
                        allowNegative={false}
                        inputMode="decimal"
                        clearAble
                    />

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
                </div>

                <div className="bg-gray-13 dark:bg-dark-4 rounded-xl p-4">
                    <div className="font-semibold">{t('earn:deposit_modal:summary')}</div>
                    <div className="h-4"></div>

                    <div className="flex justify-between space-x-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('earn:deposit_modal:estimated_profit')}:</div>
                        <div className="font-semibold">
                            {formatNumber((quote * apr * duration * +depositAmount) / 365, rewardInfo?.assetDigit ?? 0)} {rewardAsset}
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
            <Button className="w-full" disabled={!canDeposit} onClick={deposit}>
                {t('earn:deposit_modal:deposit')}
            </Button>
        </ModalV2>
    );
};

export default EarnModal;
