/* eslint-disable no-nested-ternary */
import { Transition } from '@headlessui/react';
import { IconArrowLeft, IconLoading, IconLock } from 'components/common/Icons';
import LayoutNoHeader from 'components/common/layouts/LayoutNoHeader';
import AssetLogo from 'components/wallet/AssetLogo';
import { debounce, isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import qs from 'qs';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { isMobile } from 'react-device-detect';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { API_GET_ME } from 'redux/actions/apis';
import { ApiStatus, KYC_STATUS } from 'redux/actions/const';
import { roundByWithdraw } from 'redux/actions/utils';
import { formatWallet } from 'src/redux/actions/utils';
import fetchAPI from '../utils/fetch-api';

const SuccessModal = ({
    handleClose,
    amount,
    assetCode,
    isComponentVisible,
    withdrawStatus,
}) => {
    const { t } = useTranslation();
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return null;
        }
        return (
            <div className="flex flex-col items-center justify-center p-5 relative">
                <div className="absolute -top-12 left-0 w-full flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 w-max">
                        <img
                            src={`/images/verification/${withdrawStatus}.png`}
                            alt="success"
                            className="object-fit w-20 h-20"
                        />
                    </div>
                </div>
                <p className="font-bold text-lg text-center mt-[50px]">
                    {t(`wallet:withdraw_${withdrawStatus}_title`)}
                </p>
                <p className="text-center mt-2">
                    {t(`wallet:withdraw_${withdrawStatus}_desc_1`)}{' '}
                    <span className="font-bold">
                        {amount}
                        {assetCode}
                    </span>{' '}
                    {t(`wallet:withdraw_${withdrawStatus}_desc_2`)}
                </p>
                <button
                    type="button"
                    onClick={handleClose}
                    className="px-8 py-[9px] bg-[#4021D0] rounded w-full text-white mt-5"
                    style={{ fontWeight: 500 }}
                >
                    {t('common:confirm')}
                </button>
            </div>
        );
    };

    return (
        <Transition
            show={isComponentVisible}
            enter="transform transition ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div
                className="bg-white w-[315px] rounded-[15px]"
                style={{ boxShadow: '0px 24px 40px rgba(2, 8, 61, 0.16)' }}
            >
                <Countdown
                    date={Date.now() + 5000}
                    onComplete={handleClose}
                    renderer={renderer}
                />
            </div>
        </Transition>
    );
};

const Wallet = () => {
    const [walletType, setWalletType] = useState('SPOT');
    const { t } = useTranslation();
    const [wallets, setWallets] = useState({});
    const [selectedAsset, setSelectedAsset] = useState({});
    const [step, setStep] = useState(1);
    const [userBalances, setUserBalances] = useState([]);
    const [amount, setAmount] = useState(0);
    const [errors, setErrors] = useState(null);
    const [offchainConfig, setOffchainConfig] = useState({});
    const [selectedAssetConfig, setSelectedAssetConfig] = useState({});

    const [kycStatus, setKycStatus] = useState(2);
    const [clientId, setClientId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [accessTokenExpired, setAccessTokenExpired] = useState(false);
    const [noRequestId, setNoRequestId] = useState(false);
    const [filterUserBalances, setFilterUserBalances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawStatus, setWithdrawStatus] = useState('failed');
    const [withdrawIntegerMultiple, setWithdrawIntegerMultiple] = useState(0);
    const [allowedDecimal, setAllowedDecimal] = useState(10);

    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const router = useRouter();

    const [isComponentVisible, setIsComponentVisible] = useState(false);

    const getWallets = async () => {
        const { data } = await fetchAPI({
            url: '/api/v1/user/wallet',
            options: {
                method: 'GET',
                headers: {
                    authorization: accessToken,
                    ClientId: `vndc_wallet_${clientId}`,
                },
            },
        });
        setWallets(data);
    };

    const getOffchainConfig = async () => {
        const result = await fetchAPI({
            url: '/api/v1/deposit/offchain_vndc/config',
            options: {
                method: 'GET',
                headers: {
                    authorization: accessToken,
                    ClientId: `vndc_wallet_${clientId}`,
                },
            },
        });
        if (result) {
            setOffchainConfig(result?.data);
        }
    };

    useAsync(async () => {
        if (!isEmpty(offchainConfig) && userBalances.length > 0) {
            const filterUserBalancesList = [];
            const allowedAssets = Object.keys(offchainConfig);
            userBalances.forEach((asset) => {
                const { id, walletType: _walletType } = asset;
                if (_walletType !== walletType) {
                    return null;
                }

                if (allowedAssets.includes(JSON.stringify(id))) {
                    filterUserBalancesList.push(asset);
                }
            });
            await setFilterUserBalances(filterUserBalancesList);
        }
    }, [offchainConfig, userBalances]);

    const submitToVNDC = async ({ submitAmount, asset }) => {
        const roundByAmount = roundByWithdraw(
            Number(submitAmount),
            withdrawIntegerMultiple,
        );
        const { status } = await fetchAPI({
            url: '/api/v1/deposit/offchain_vndc/withdraw',
            options: {
                method: 'POST',
                headers: {
                    authorization: accessToken,
                    ClientId: `vndc_wallet_${clientId}`,
                },
            },
            params: {
                amount: roundByAmount,
                asset,
                vndcId: clientId,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setWithdrawStatus('success');
        } else {
            setWithdrawStatus('failed');
        }
        return setIsComponentVisible(true);
    };

    const getAccessToken = async (token) => {
        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        await setClientId(query?.vndcId);
        if (query?.requestId) {
            const { status, data } = await fetchAPI({
                url: `/api/v1/get_offchain_vndc_token?requestId=${query?.requestId}`,
                options: {
                    method: 'GET',
                },
            });
            if (status === ApiStatus.SUCCESS) {
                setAccessToken(data?.accessToken);
            }
        } else {
            setNoRequestId(true);
        }
    };

    const getMe = async () => {
        const res = await fetchAPI({
            url: API_GET_ME,
            options: {
                method: 'GET',
                headers: {
                    authorization: accessToken,
                    ClientId: `vndc_wallet_${clientId}`,
                },
            },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            setKycStatus(data?.kycStatus);
        } else {
            setAccessTokenExpired(true);
        }
        setIsLoading(false);
    };

    const convertExponentialToDecimal = (exponentialNumber) => {
        // sanity check - is it exponential number
        const str = exponentialNumber.toString();
        if (str.indexOf('e') !== -1) {
            const exponent = parseInt(str.split('-')[1], 10);
            const result = exponentialNumber.toFixed(exponent);
            return result;
        }
        return exponentialNumber;
    };

    const countDecimals = (value) => {
        if (value) {
            const convertedValue = convertExponentialToDecimal(value);
            if (Math.floor(convertedValue) === convertedValue) {
                return 0;
            }

            return convertedValue.toString().split('.')[1].length || 0;
        }
    };

    useEffect(() => {
        if (isMobile) {
            getAccessToken();
        } else {
            router.push('/wallet/spot/withdraw/fiat/VNDC', undefined, {
                shallow: true,
            });
        }
    }, []);

    useAsync(async () => {
        if (clientId && accessToken) {
            await getMe();
            getOffchainConfig();
            getWallets();
        }
    }, [accessToken, clientId]);

    useEffect(() => {
        if (assetConfig && assetConfig.length > 0 && wallets) {
            setUserBalances(
                assetConfig.map((e) => ({
                    ...e,
                    ...(wallets && wallets[e.id] ? wallets[e.id] : {}),
                })),
            );
        }
    }, [assetConfig, wallets]);

    useEffect(() => {
        setWithdrawIntegerMultiple(
            +selectedAssetConfig?.withdrawIntegerMultiple,
        );
        setAllowedDecimal(
            countDecimals(+selectedAssetConfig?.withdrawIntegerMultiple),
        );
    }, [selectedAssetConfig]);

    const selectAsset = (asset, config) => {
        setSelectedAssetConfig(offchainConfig[config]?.[0]);
        setSelectedAsset(asset);
        setStep(2);
    };

    const goBack = () => {
        setSelectedAsset({});
        setSelectedAssetConfig({});
        setAmount(0);
        setStep(1);
    };

    const withdraw = () => {
        if (parseFloat(selectedAssetConfig?.withdrawMax) < parseFloat(amount)) {
            return setErrors({ max: true });
        }
        if (
            parseFloat(selectedAssetConfig?.withdrawMin) > parseFloat(amount) ||
            parseFloat(amount) <= 0
        ) {
            return setErrors({ min: true });
        }
        return submitToVNDC({
            asset: selectedAsset?.assetCode || '',
            submitAmount: amount,
            vndcId: clientId,
        });
    };

    const handleClose = () => {
        setIsComponentVisible(false);
    };

    if (isLoading) {
        return (
            <div className="flex flex-grow items-center justify-center px-5 py-4 text-lg text-center h-full">
                <IconLoading />
            </div>
        );
    }

    if (noRequestId) {
        return (
            <div className="flex flex-grow items-center justify-center px-5 py-4 text-lg text-center h-full">
                {t('wallet:no_request_id')}
            </div>
        );
    }

    const renderScreen = () => {
        if (
            kycStatus !== KYC_STATUS.APPROVED &&
            kycStatus !== KYC_STATUS.ADVANCE_KYC
        ) {
            return (
                <div className="flex flex-grow items-center justify-center px-5 py-4 text-lg text-center">
                    {t('wallet:withdraw_via_vndc_warn')}
                </div>
            );
        }
        return (
            <div className="flex flex-row">
                <Transition
                    show={isComponentVisible}
                    enter="transform transition ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transform transition ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50"
                >
                    <SuccessModal
                        handleClose={handleClose}
                        amount={formatWallet(
                            amount,
                            selectedAsset.displayDigit,
                        )}
                        assetCode={selectedAsset.assetCode}
                        isComponentVisible={isComponentVisible}
                        withdrawStatus={withdrawStatus}
                    />
                </Transition>

                <Transition
                    show={step === 1}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="opacity-0 scale-90"
                    enterTo="opacity-100 scale-100"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-60 scale-90"
                    className="flex flex-col flex-grow bg-white absolute top-0 left-0 w-full h-full"
                >
                    <div className="bg-black-5 px-5 py-4">
                        <div className="font-semibold text-black">
                            {t('wallet:spot')}
                        </div>
                        <div className="text-black-500 text-xs">
                            {t('wallet:withdraw_to_vndc')}
                        </div>
                    </div>
                    <div className="bg-white px-5 py-6 flex-grow">
                        <div className="text-lg font-bold mb-4">
                            {t('common:assets')}
                        </div>
                        {filterUserBalances.map((e) => (
                            <div
                                key={e?.assetCode}
                                className="py-2.5 flex items-center justify-between"
                                onClick={() => selectAsset(
                                    e,
                                    Object.keys(offchainConfig).filter(
                                        // eslint-disable-next-line eqeqeq
                                        (config) => config == e?.id,
                                    )?.[0],
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="mr-4 w-8 h-8">
                                        <AssetLogo
                                            assetCode={e?.assetCode}
                                            size={32}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="font-semibold text-sm flex-grow truncate">
                                            {e?.assetCode}
                                        </div>
                                        <div className="text-black-500 text-xs">
                                            {e?.assetName}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm">
                                        {e.value
                                            ? formatWallet(
                                                e.value - e.lockedValue,
                                                e.displayDigit,
                                            )
                                            : '---'}
                                    </div>
                                    <div className="text-xs text-black-500 flex items-center justify-end">
                                        <span className="mr-1">
                                            <IconLock />
                                        </span>
                                        <span>
                                            {' '}
                                            {e.lockedValue
                                                ? formatWallet(
                                                    e.lockedValue,
                                                    e.displayDigit,
                                                )
                                                : '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Transition>
                <Transition
                    show={step === 2}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                    className="flex flex-col flex-grow bg-white absolute top-0 left-0 w-full h-full"
                >
                    <div className="flex items-center justify-center relative h-[56px] px-4 border-0 border-b border-black-200">
                        <button
                            className="btn btn-icon absolute left-2"
                            type="button"
                            onClick={() => goBack()}
                        >
                            <IconArrowLeft />
                        </button>
                        <div className="flex items-center justify-center">
                            <AssetLogo
                                assetCode={selectedAsset.assetCode}
                                size={24}
                            />
                            <span className="font-medium ml-1.5">
                                {selectedAsset.assetCode}
                            </span>
                        </div>
                    </div>
                    <div className="p-4 flex-grow">
                        <div className="mb-10">
                            <div className="text-sm text-black-600">
                                {t('common:available_balance')}
                            </div>
                            <div className="text-3xl font-bold">
                                {selectedAsset.value
                                    ? formatWallet(
                                        selectedAsset.value -
                                              selectedAsset.lockedValue,
                                        selectedAsset.displayDigit,
                                    )
                                    : '---'}{' '}
                                <span className="text-lg font-semibold">
                                    {selectedAsset.assetCode}
                                </span>
                            </div>
                            <div className="text-xs text-black-500 flex items-center">
                                <span className="mr-1">
                                    <IconLock />
                                </span>
                                <span>
                                    {' '}
                                    {selectedAsset.lockedValue
                                        ? formatWallet(
                                            selectedAsset.lockedValue,
                                            selectedAsset.displayDigit,
                                        )
                                        : '--'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="form-group">
                                <label htmlFor="amount">
                                    {t('common:amount')}
                                </label>
                                <div
                                    className={`input-group relative ${
                                        errors?.min || errors?.max
                                            ? 'is-error'
                                            : ''
                                    }`}
                                >
                                    <NumberFormat
                                        className="form-control form-control-lg !text-base"
                                        placeholder="Nhập số tiền"
                                        decimalScale={allowedDecimal}
                                        thousandSeparator
                                        allowNegative={false}
                                        value={amount}
                                        onValueChange={({ value }) => {
                                            if (errors) {
                                                setErrors(null);
                                            }

                                            if (value.length > 0) {
                                                return setAmount(Number(value));
                                            }

                                            return setAmount(0);
                                        }}
                                        inputMode="decimal"
                                        pattern="[0-9]*"
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn"
                                            type="button"
                                            onClick={() => setAmount(
                                                roundByWithdraw(
                                                    Number(
                                                        selectedAsset.value -
                                                                selectedAsset.lockedValue,
                                                    ),
                                                    withdrawIntegerMultiple,
                                                ),
                                            )}
                                        >
                                            <span className="input-group-text text-teal-700 font-semibold">
                                                {t('common:max')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-pink mt-2">
                                    {errors?.min
                                        ? `${t('convert:errors.min', {
                                            amount: formatWallet(
                                                selectedAssetConfig?.withdrawMin,
                                                selectedAsset.displayDigit,
                                            ),
                                        })} ${selectedAsset.assetCode}`
                                        : errors?.max
                                            ? `${t('convert:errors.max', {
                                                amount: formatWallet(
                                                    selectedAssetConfig?.withdrawMax,
                                                    selectedAsset.displayDigit,
                                                ),
                                            })} ${selectedAsset.assetCode}`
                                            : null}
                                </div>
                            </div>
                            <div className="mt-3 text-xs">
                                <span className="text-black-600">
                                    {t('common:fee')}:{' '}
                                </span>
                                <span className="font-semibold">
                                    {formatWallet(
                                        selectedAssetConfig?.withdrawFee,
                                    )}{' '}
                                    {selectedAssetConfig?.coin}
                                </span>
                            </div>
                            <div className="mt-1 text-xs">
                                <span className="text-black-600">
                                    {t('common:min')}:{' '}
                                </span>
                                <span className="font-semibold">
                                    {formatWallet(
                                        selectedAssetConfig?.withdrawMin,
                                        selectedAsset.displayDigit,
                                    )}{' '}
                                    {selectedAssetConfig?.coin}
                                </span>
                            </div>
                            <div className="mt-1 text-xs">
                                <span className="text-black-600">
                                    {t('common:max')}:{' '}
                                </span>
                                <span className="font-semibold">
                                    {formatWallet(
                                        selectedAssetConfig?.withdrawMax,
                                        selectedAsset.displayDigit,
                                    )}{' '}
                                    {selectedAssetConfig?.coin}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 mb-20">
                        <button
                            className="btn btn-primary w-full"
                            type="button"
                            disabled={isLoading}
                            onClick={withdraw}
                        >
                            {t('wallet:withdraw_btn')}
                        </button>
                    </div>
                </Transition>
            </div>
        );
    };

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                />
            </Head>
            <LayoutNoHeader>
                {' '}
                {accessTokenExpired ? (
                    <div className="flex flex-grow items-center justify-center px-5 py-4 text-lg text-center">
                        {t('wallet:expired_token')}
                    </div>
                ) : (
                    renderScreen()
                )}
            </LayoutNoHeader>
        </>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'wallet',
                'spot',
                'error',
                'convert',
            ])),
        },
    };
}

export default Wallet;
