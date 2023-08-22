import classNames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import Card from 'components/screens/WithdrawDeposit/components/common/Card';
import AssetLogo from 'components/wallet/AssetLogo';
import useOutsideClick from 'hooks/useOutsideClick';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { ChevronDown } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { formatNumber, getSymbolString, roundByExactDigit } from 'redux/actions/utils';
import AssetsDropdown from './AssetsDropdown';
import ReceiverInput from './ReceiverInput';
import SvgChevronDown from 'components/svg/ChevronDown';
import { X } from 'react-feather';
import useFetchApi from 'hooks/useFetchApi';
import ErrorTriggers from 'components/svg/ErrorTriggers';
import { getMarketWatch } from 'redux/actions/market';
import { API_GET_MARKET_WATCH } from 'redux/actions/apis';

export const MAX_NOTE_LENGTH = 70;

const DEPOSIT_AMOUNT = {
    MIN: 100e3,
    MAX: 50e6
};

const DEFAULT_QUOTE_SYMBOL = 'VNDC';

const DepositInputCard = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const { assetId: assetCode } = router.query;

    // SELECTOR
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs) || [];
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const spotWallets = useSelector((state) => state.wallet.SPOT) || {};
    const mapAssetConfig = useMemo(() => keyBy(assetConfigs, 'id'), [assetConfigs]);

    // CHECK IF ASSET IS ALLOW TO DEPOSIT
    useEffect(() => {
        const isAssetAllowed = paymentConfigs
            .filter((asset) => asset?.networkList || asset?.networkList?.length)
            .find((asset) => asset?.assetCode === assetCode);
        if (!Boolean(isAssetAllowed)) {
            router.query.assetId = paymentConfigs[0]?.assetCode || 'USDT';
            router.push(router);
        }
    }, [assetCode, paymentConfigs, router]);

    const { data: marketWatch, loading } = useFetchApi(
        {
            url: API_GET_MARKET_WATCH,
            params: {
                symbol: `${assetCode}VNDC`
            }
        },
        [Boolean(assetCode)],
        [assetCode]
    );

    let marketWatchPrice = marketWatch?.[0]?.p || 1;

    useEffect(() => {
        (async () => {
            try {
                const result = await getMarketWatch(`${assetCode}VNDC`);
                console.log('result:', result);
            } catch (error) {
                console.log('error:', error);
            }
        })();
    }, [assetCode]);

    // LOCAL STATE
    const assetListRef = useRef();
    const [amount, setAmount] = useState('');
    const [search, setSearch] = useState('');
    const [openSelectAsset, setOpenSelectAsset] = useState(false);
    useOutsideClick(assetListRef, () => setOpenSelectAsset(!openSelectAsset));

    // frequently used variable base on state, selector
    const currentAsset = useMemo(() => find(paymentConfigs, { assetCode }), [paymentConfigs, assetCode]);
    const currentAssetConfig = useMemo(() => {
        return mapAssetConfig[currentAsset?.assetId] || {};
    }, [currentAsset, mapAssetConfig]);

    const assetBalance = useMemo(() => {
        const balance = spotWallets?.[currentAsset?.assetId];
        return roundByExactDigit(balance?.value - balance?.locked_value, currentAssetConfig?.assetDigit || 0);
    }, [spotWallets, currentAsset, currentAssetConfig?.assetDigit]);

    const assetOptions = useMemo(() => {
        const listAssetAvailable = paymentConfigs
            .filter((asset) => asset?.networkList || asset?.networkList?.length)
            .filter((c) => c.assetCode?.includes(search.trim().toUpperCase()))
            .map((config) => {
                const wallet = spotWallets[config.assetId] || {
                    value: 0,
                    locked_value: 0
                };

                return {
                    ...config,
                    availableValue: wallet.value - wallet.locked_value
                };
            });

        return orderBy(listAssetAvailable, ['availableValue', 'assetCode'], ['desc', 'asc']);
    }, [paymentConfigs, spotWallets, search]);

    const currencyDepositAmount = useMemo(
        () => ({
            max: roundByExactDigit(DEPOSIT_AMOUNT.MAX / marketWatchPrice, currentAssetConfig?.assetDigit || 0),
            min: roundByExactDigit(DEPOSIT_AMOUNT.MIN / marketWatchPrice, currentAssetConfig?.assetDigit || 0)
        }),
        [currentAssetConfig?.assetDigit, marketWatchPrice]
    );

    const maxAmount = Math.min(assetBalance, currencyDepositAmount.max);
    const isMax = +amount === maxAmount;

    const onSetMax = () => {
        if (isMax) return;
        setAmount(maxAmount);
    };

    const isDepositAble =
        +amount >= currencyDepositAmount.min && +amount <= currencyDepositAmount.max && +amount <= assetBalance && +amount && Boolean(currentAsset);

    const error = useMemo(() => {
        if (!amount) return '';
        if (+amount > +assetBalance) return t('deposit_namiid-email:error.insufficient_balance');

        if (+amount * marketWatchPrice < currencyDepositAmount.min || +amount * marketWatchPrice > currencyDepositAmount.max) {
            return t('deposit_namiid-email:error.min_max', {
                min: formatNumber(currencyDepositAmount.min, currentAssetConfig?.assetDigit),
                max: formatNumber(currencyDepositAmount.max, currentAssetConfig?.assetDigit)
            });
        }

        return '';
    }, [marketWatchPrice, t, currentAssetConfig?.assetDigit, amount, assetBalance]);

    return (
        <>
            <Card className="max-w-[508px] ">
                <div className="mb-6">
                    <div
                        className={classNames(
                            'transition border border-transparent dark:focus-within:border-teal focus-within:border-green-3 bg-dark-12 dark:bg-dark-4 p-4 relative rounded-xl',
                            {
                                '!border-red': Boolean(error)
                            }
                        )}
                    >
                        {openSelectAsset && (
                            <AssetsDropdown
                                search={search}
                                setOpenSelectAsset={setOpenSelectAsset}
                                setSearch={setSearch}
                                mapAssetConfig={mapAssetConfig}
                                assetOptions={assetOptions}
                                ref={assetListRef}
                            />
                        )}
                        <div className="flex justify-between text-txtSecondary dark:text-txtSecondary-dark mb-4">
                            <p>{t('common:amount')}</p>
                            <p>
                                {t('common:available_balance')}:{' '}
                                <span className="cursor-pointer" onClick={onSetMax}>
                                    {formatNumber(assetBalance, currentAssetConfig?.assetDigit)}
                                </span>{' '}
                                {currentAsset?.assetCode}
                            </p>
                        </div>
                        <div className="flex items-center overflow-hidden select-none">
                            <div className="flex items-center flex-1  pr-2">
                                <NumberFormat
                                    thousandSeparator
                                    decimalScale={currentAssetConfig?.assetDigit || 0}
                                    allowNegative={false}
                                    placeholder="0"
                                    className="w-full font-semibold text-2xl"
                                    value={amount}
                                    onValueChange={({ value }) => setAmount(value)}
                                />
                            </div>

                            {Boolean(amount) && (
                                <>
                                    <div className={classNames('flex items-center text-darkBlue-5')}>
                                        <X className={classNames('transition cursor-pointer')} size={16} onClick={() => setAmount('')} color="currentColor" />
                                    </div>

                                    <div className="w-[1px] h-6 bg-divider dark:bg-divider-dark mx-2" />
                                </>
                            )}

                            <button
                                disabled={isMax}
                                className="font-semibold uppercase text-green-3 hover:text-green-4 active:text-green-4 dark:text-green-2 dark:hover:text-green-4 disabled:cursor-default dark:active:text-green-4 disabled:text-txtDisabled dark:disabled:text-txtDisabled-dark "
                                onClick={onSetMax}
                            >
                                MAX
                            </button>
                            <div className="w-[1px] h-6 bg-divider dark:bg-divider-dark mx-2" />
                            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenSelectAsset((prev) => !prev)}>
                                <AssetLogo assetCode={currentAsset?.assetCode} size={24} />
                                <span className="font-semibold">{currentAsset?.assetCode}</span>

                                <div className="text-txtPrimary dark:text-txtPrimary-dark">
                                    <SvgChevronDown
                                        className={classNames('transition-transform', {
                                            '!rotate-0': openSelectAsset
                                        })}
                                        size={24}
                                        color={'currentColor'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={classNames('overflow-hidden transition-[max-height_opacity] duration-300', {
                            'max-h-0 opacity-0 ease-out': !Boolean(error),
                            'max-h-[5rem] opacity-1 ease-in': Boolean(error)
                        })}
                    >
                        <div className="flex items-center mt-2">
                            <ErrorTriggers />
                            <div className="text-red text-xs leading-4 ml-1">{error}</div>
                        </div>
                    </div>
                </div>
                <ReceiverInput setAmount={setAmount} assetId={currentAsset?.assetId} isDepositAble={isDepositAble} amount={amount} />
            </Card>
        </>
    );
};

export default DepositInputCard;
