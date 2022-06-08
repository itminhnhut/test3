import React, { useEffect, useMemo, useState } from 'react';
import { NoticePopup } from 'components/screens/OnusWithdrawGate/styledExternalWdl';
import { useSelector } from 'react-redux';
import { Key, X } from 'react-feather';

import { PulseLoader } from 'react-spinners';
import Axios from 'axios';
import { handleLogin, WalletCurrency, } from 'components/screens/OnusWithdrawGate/helper';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AssetLogo from 'components/wallet/AssetLogo';
import NumberFormat from 'react-number-format';

import 'react-input-range/lib/css/index.css';
import classNames from 'classnames';
import SortIcon from 'components/screens/Mobile/SortIcon';
import Div100vh from 'react-div-100vh';
import CheckSuccess from 'components/svg/CheckSuccess';
import { isNumeric } from 'utils';
import { format } from 'date-fns';
import Button from 'components/common/Button';
import Modal from 'components/common/ReModal';
import { PORTAL_MODAL_ID } from 'constants/constants';
import colors from 'styles/colors';
import Head from 'next/head';
import { DIRECT_WITHDRAW_ONUS } from 'redux/actions/apis';
import AssetName from 'components/wallet/AssetName';
import find from 'lodash/find';
import LayoutMobile from "components/common/layouts/LayoutMobile";
import Divider from 'components/common/Divider';

const ASSET_LIST = [WalletCurrency.VNDC, WalletCurrency.NAMI];

const MIN_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.NAMI]: 0,
};

const MAX_WITHDRAWAL = {
    [WalletCurrency.VNDC]: 500e6,
    [WalletCurrency.NAMI]: 100000,
};

const VNDC_WITHDRAWAL_FEE = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.NAMI]: 0,
};

const DECIMAL_SCALES = {
    [WalletCurrency.VNDC]: 0,
    [WalletCurrency.NAMI]: 1,
};

const WDL_STATUS = {
    UNKNOWN: 'UNKNOWN',
    MINIMUM_WITHDRAW_NOT_MET: 'MINIMUM_WITHDRAW_NOT_MET',
    LOGGED_OUT: 'LOGGED_OUT',
    INVALID_INPUT: 'INVALID_INPUT',
    NOT_ENOUGH_BASE_CURRENCY: 'NOT_ENOUGH_BASE_CURRENCY',
    NOT_ENOUGH_EXCHANGE_CURRENCY: 'NOT_ENOUGH_EXCHANGE_CURRENCY',
    not_in_range: 'not_in_range',
};

const MAINTAIN = true;

const ExternalWithdrawal = (props) => {
    // initial state
    const [currentCurr, setCurrentCurr] = useState(null);
    const [amount, setAmount] = useState('init');
    const [modal, setModal] = useState({
        isListAssetModal: false,
        isSuccessModal: false,
        isNotice: false,
    });
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wdlResult, setWdlResult] = useState(null);
    const [error, setError] = useState(null);

    // map state from redux
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const futuresBalances = useSelector((state) => state.wallet.FUTURES) || {};

    // use hooks
    const { t } = useTranslation();
    const isDark = true;

    const assets = useMemo(() => {
        const _assets = [];

        ASSET_LIST.forEach(item => {
            const _config = find(assetConfigs, { id: item });
            if (_config) {
                const balance = futuresBalances[_config.id] || {
                    value: 0,
                    value_locked: 0,
                };
                _assets.push({
                    ..._config,
                    ...balance,
                    available: balance?.value - balance?.locked_value,

                });
            }
        });
        return _assets;
    }, [assetConfigs, futuresBalances]);

    useEffect(() => {
        setCurrentCurr(assets[0]);
    }, [assets]);

    useEffect(() => {
        setAmount('');
    }, [currentCurr]);

    const {
        min = 0,
        max = 0,
        fee = 0,
        decimalScale = 0,
    } = useMemo(() => {
        return {
            min: MIN_WITHDRAWAL[currentCurr?.id],
            max: MAX_WITHDRAWAL[currentCurr?.id],
            fee: VNDC_WITHDRAWAL_FEE[currentCurr?.id],
            decimalScale: DECIMAL_SCALES[currentCurr?.id],
        };
    }, [currentCurr]);

    // helper
    const handleModal = (key, value = null) =>
        setModal({
            ...modal,
            [key]: value
        });

    const onAllDone = () => {
        setModal({ isSuccessModal: false });
        setAmount('');
        setWdlResult(null);
        setError(null);
    };

    const onWdl = async (amount, currency, balance) => {
        // console.log('namidev-DEBUG: RE-CHECK__ ', amount, currency)

        try {
            setIsSubmitting(true);
            setError(null);
            const { data } = await Axios.post(DIRECT_WITHDRAW_ONUS, {
                amount,
                currency,
            });
            // let data = {status: 'ok', message: 'PHA_KE_DATA', data: {currency: 72, amount: 40000, amountLeft: 32000}}
            if (data && data.status === 'ok') {
                const res = (data.hasOwnProperty('data') && data.data) || {};
                setWdlResult(res); // get withdraw result
                handleModal('isSuccessModal', true);
            } else {
                // console.log('namidev-DEBUG: ERROR_OCCURED____ ', data)
                const status = data ? data.status : WDL_STATUS.UNKNOWN;
                // console.log('namidev-DEBUG: STATUS__ ', status)
                // handle problem
                switch (status) {
                    case WDL_STATUS.MINIMUM_WITHDRAW_NOT_MET:
                        setError(t('ext_gate:err.min_wdl_not_met'));
                        break;
                    case WDL_STATUS.INVALID_INPUT:
                        setError(t('ext_gate:err.invalid_input'));
                        break;
                    case WDL_STATUS.LOGGED_OUT:
                        setError(t('ext_gate:err.logged_out'));
                        break;
                    case WDL_STATUS.NOT_ENOUGH_BASE_CURRENCY:
                    case WDL_STATUS.NOT_ENOUGH_EXCHANGE_CURRENCY:
                        setError(t('ext_gate:err.insufficient'));
                        break;
                    case WDL_STATUS.not_in_range:
                        setError(t('ext_gate:err.not_in_range'));
                        break;
                    default:
                        setError(t('ext_gate:err.unknown'));
                        break;
                }
            }
        } catch (e) {
            console.log('Notice: ', e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const errorMessage = useMemo(() => {
        if (!isNumeric(+amount) || !amount) return;
        if (+amount < min) {
            return (
                <div className="text-xs">
                    <span className="text-onus-secondary mr-1">
                        {t('ext_gate:min_notice')}:
                    </span>
                    <span>
                        {formatNumber(min, decimalScale)}{' '}
                        {currentCurr?.assetCode}
                    </span>
                </div>
            );
        }
        if (+amount > currentCurr?.available) {
            return (
                <div className="text-xs">
                    <span className="text-onus-secondary mr-1">
                        {t('ext_gate:insufficient')}
                    </span>
                </div>
            );
        }
        if (+amount > max) {
            return (
                <div className="text-xs">
                    <span className="text-onus-secondary mr-1">
                        {t('ext_gate:max_notice')}
                    </span>
                    <span>
                        {formatNumber(max, decimalScale)}{' '}
                        {currentCurr?.assetCode}
                    </span>
                </div>
            );
        }
    }, [min, max, decimalScale, amount, currentCurr]);

    const isDisableBtn = !amount || !!errorMessage;

    const amountLeft = wdlResult?.amountLeft || 0;
    const wdlAmount = wdlResult?.amount || 0;
    const wdlCurrency = wdlResult?.currency || 0;
    return (
        <LayoutMobile>
            <Head>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <Div100vh className="px-4 py-6 flex flex-col bg-onus">
                <div className="flex-1 text-onus font-medium text-sm">
                    <div className="flex items-center px-4 bg-onus-1 rounded-md h-11 mb-6">
                        <AssetLogo assetCode="ONUS" size={28}/>
                        <span className="ml-1">
                            {t('ext_gate:onus_wallet')}
                        </span>
                    </div>

                    <span className="text-onus-secondary text-xs uppercase">
                        {t('ext_gate:choose_asset')}
                    </span>
                    <div
                        className="flex justify-between items-center px-4 bg-onus-1 rounded-md h-11 mb-6 mt-2"
                        onClick={() => handleModal('isListAssetModal', true)}
                    >
                        <div className="flex items-center font-medium">
                            <AssetLogo
                                size={28}
                                assetCode={currentCurr?.assetCode}
                            />
                            <span className="ml-1">
                                {currentCurr?.assetName}
                            </span>
                        </div>
                        <SortIcon size={14}/>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-onus-secondary text-xs uppercase">
                            {t('ext_gate:amount')}
                        </span>
                        {errorMessage}
                    </div>
                    <div className="flex justify-between items-center pl-4 bg-onus-1 rounded-md h-11 mb-2 mt-2">
                        <NumberFormat
                            thousandSeparator
                            allowNegative={false}
                            className="outline-none text-sm font-medium flex-1 py-2"
                            value={amount}
                            onValueChange={({ value }) => setAmount(value)}
                            decimalScale={decimalScale}
                        />
                        <div
                            className="flex items-center"
                            onClick={() =>
                                setAmount(formatNumber(Math.min(currentCurr?.available || 0, max), decimalScale))
                            }
                        >
                            <span className="px-4 py-2 text-[#418FFF] font-semibold">
                                {t('ext_gate:max_opt')}
                            </span>
                            <div
                                className="h-full leading-[2.75rem] bg-[#36445A] w-16 text-[#8492A7] rounded-r-md text-center">
                                {currentCurr?.assetCode}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs mb-6">
                        <span className="text-onus-secondary mr-1">
                            {t('ext_gate:available')}:
                        </span>
                        <span>
                            {formatNumber(currentCurr?.available, decimalScale)}{' '}
                            {currentCurr?.assetName}
                        </span>
                    </div>

                    <span className="text-onus-secondary text-xs uppercase">
                        {t('ext_gate:trans_fee')}
                    </span>
                    <div className="flex justify-between items-center pl-4 bg-onus-1 rounded-md h-11 mb-6 mt-2">
                        <span>{fee > 0 ? formatNumber(fee, decimalScale): t('common:free')}</span>
                        <div
                            className="h-full leading-[2.75rem] bg-[#36445A] w-16 text-[#8492A7] rounded-r-md text-center">
                            {currentCurr?.assetName}
                        </div>
                    </div>
                </div>
                <div className="text-center mb-2">
                    {error && <span className="text-sm text-red">{error}</span>}
                </div>
                <div
                    className={classNames(
                        'bg-[#0068FF] h-12 w-full rounded-md text-center leading-[3rem] text-onus font-semibold',
                        {
                            '!bg-darkBlue-4 text-txtSecondary-dark': isDisableBtn
                        }
                    )}
                    onClick={() => !isDisableBtn && onWdl(+amount, currentCurr?.id)}
                >
                    {isSubmitting ? (
                        <PulseLoader color={colors.white} size={3}/>
                    ) : (
                        t('ext_gate:wdl_btn')
                    )}
                </div>
            </Div100vh>

            <Div100vh
                className={classNames(
                    'fixed top-0 left-0 right-0 z-30 p-6 bg-onus text-onus',
                    'translate-y-full transition-transform duration-500',
                    {
                        'translate-y-0': modal.isListAssetModal,
                    }
                )}
            >
                <div className="relative w-full flex justify-center items-center mb-12">
                    <span className="font-semibold">{t('ext_gate:choose_asset')}</span>
                    <div
                        className="absolute top-0 right-0 p-1 cursor-pointer"
                        onClick={() => handleModal('isListAssetModal', false)}
                    >
                        <X size={16}/>
                    </div>
                </div>
                {assets.map((a, i) => {
                    return (
                        <div key={a.id} className="">
                            {i !== 0 && <Divider/>}
                            <div
                                className="flex justify-between items-center my-4"
                                onClick={() => {
                                    handleModal('isListAssetModal', false);
                                    setCurrentCurr(a);
                                }}
                            >
                                <div className="flex items-center">
                                    <AssetLogo size={40} assetCode={a.assetCode}/>
                                    <div className="ml-3">
                                        <div className="font-bold">
                                            {a.assetCode}
                                        </div>
                                        <div className="text-onus-secondary text-sm">
                                            {a.assetName}
                                        </div>
                                    </div>
                                </div>
                                {a.id === currentCurr?.id && (
                                    <CheckSuccess size={24}/>
                                )}
                            </div>
                        </div>
                    );
                })}
            </Div100vh>

            <Modal
                isVisible={modal.isSuccessModal}
                containerClassName="px-6 py-8 !min-w-[18rem] !top-[50%]"
            >
                <div className="absolute right-0 top-0 p-3">
                    <X
                        size={16}
                        className="cursor-pointer hover:text-dominant"
                        onClick={onAllDone}
                    />
                </div>
                <img
                    className="mx-auto"
                    src={getS3Url(isDark
                        ? '/images/screen/wallet/coins_pana_dark.png'
                        : '/images/screen/wallet/coins_pana.png'
                    )}
                    width={150}
                    height={150}
                />
                <p className="text-center font-semibold text-lg mt-5">
                    {t('wallet:mobile:transfer_asset_success', {})}
                </p>
                <p className="text-center text-sm text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:mobile:tips')}
                </p>
                <div className="mt-7 mb-8 space-y-4">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium text-txtSecondary dark:text-txtSecondary-dark">
                            {t('wallet:mobile:time')}
                        </span>
                        <span className="font-semibold">
                            {format(Date.now(), 'yyyy-MM-dd hh:mm:ss')}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="font-medium text-txtSecondary dark:text-txtSecondary-dark">
                            {t('wallet:mobile:amount')}
                        </span>
                        <span className="font-semibold">
                            {formatNumber(+wdlAmount, decimalScale)}&nbsp;
                            <AssetName assetId={wdlCurrency}/>
                        </span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span
                            className="font-medium text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap mr-3">
                            {t('wallet:mobile:transfer_from_to')}
                        </span>
                        <span className="font-semibold whitespace-nowrap">
                            {t('ext_gate:nami_futures_wallet')}
                            &nbsp;-&nbsp;
                            {t('ext_gate:onus_wallet')}
                        </span>
                    </div>
                </div>
                <Button
                    componentType="button"
                    title={t('common:cancel')}
                    onClick={() => handleModal('isSuccessModal', false)}
                />
            </Modal>

            <NoticePopup active={modal.isNotice} isDark={isDark}>
                <div className="NoticePopup__Header">{t('modal:notice')}</div>
                <div className="NoticePopup__Content">
                    <Key size={24} color="#03BBCC"/>
                    {t('common:sign_in_to_continue')}
                    <a href="#" onClick={() => handleLogin(false)}>
                        {t('common:sign_in')}
                    </a>
                </div>
            </NoticePopup>
        </LayoutMobile>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'modal',
            'ext_gate',
            'wallet',
        ])),
    },
});

export default ExternalWithdrawal;
