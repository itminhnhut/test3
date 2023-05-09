import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect } from 'react';
import * as Error from 'redux/actions/apiError';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, CopyText } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
// import { NoDataDarkIcon } from 'components/common/V2/TableV2/NoData';
import { find, isEmpty, keys, pickBy } from 'lodash';
import NamiCircle from 'components/svg/NamiCircle';
import TagV2 from 'components/common/V2/TagV2';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import { API_CONFIRM_ORDER_CONVERT_SMALL_BALANCE, API_GET_NAMI_RATE, API_PREFETCH_ORDER_CONVERT_SMALL_BALANCE } from '../../redux/actions/apis';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import router from 'next/router';
import { WALLET_SCREENS } from 'pages/wallet';

const TransferSmallBalanceToNami = ({ width, className, allAssets }) => {
    const { t } = useTranslation();
    const [isShowPoppup, setIsShowPoppup] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [currentTheme] = useDarkMode();
    const [listCheck, setListCheck] = useState([]);
    const [listAsset, setListAsset] = useState([]);
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
    const [isShowModalSuccess, setIsShowModalSuccess] = useState(false);
    const [namiRate, setNamiRate] = useState(null);
    const [isOpenModalKyc, setIsOpenModalKyc] = useState(false);
    const auth = useSelector((state) => state.auth.user) || null;

    const isDark = currentTheme === THEME_MODE.DARK;

    const initNamiRate = async () => {
        const res = await fetchAPI({
            url: API_GET_NAMI_RATE,
            options: {
                method: 'GET'
            }
        });

        if (res?.status === ApiStatus.SUCCESS) {
            setNamiRate(res.data);
        }
    };

    useEffect(() => {
        initNamiRate();
    }, []);

    useEffect(() => {
        if (allAssets) {
            if (!namiRate) setListAsset([]);
            else {
                let _listAsset = [];
                allAssets.forEach((item) => {
                    const { assetCode, assetDigit, id, available } = item;

                    const namiValue = formatWallet(available * namiRate[id], 8);

                    if (id !== 1 && namiValue > 0 && namiValue < 1000) {
                        _listAsset.push({
                            id,
                            assetCode,
                            assetDigit,
                            available,
                            namiValue
                        });
                    }
                });
                setListAsset(_listAsset);
            }
        }
    }, [namiRate, allAssets]);

    useEffect(() => {
        if (listAsset && isEmpty(listCheck)) {
            const parseArray = _.reduce(
                listAsset,
                (acc, { id, wallet }) => {
                    if (id === 1) return acc;
                    return {
                        ...acc,
                        [id]: false
                    };
                },
                {}
            );

            setListCheck(parseArray);
        }
    }, [listAsset]);

    const handleCheckAll = () => {
        if (!namiRate || listAsset.length === 0) return;
        setIsCheckAll((prev) => {
            setListCheck((prevListCheck) => _.mapValues(prevListCheck, () => !prev));
            return !prev;
        });
    };

    const handleCheckToken = (id) => {
        setListCheck((prev) => {
            if (prev[id] && isCheckAll) {
                setIsCheckAll(false);
            }
            return { ...listCheck, [id]: !listCheck[id] };
        });
    };

    const handleBtnConvert = () => {
        setIsShowModalConfirm(true);
        if (!state.loadingPreOrder) fetchPreSwapOrder(state.fromAsset, state.toAsset, +state.fromAmount);
    };

    const listChecked = keys(pickBy(listCheck));

    const getTotalGet = () => {
        let totalGet = formatWallet(
            listAsset.reduce((sum, item) => (listChecked.includes(item?.id + '') ? sum + parseFloat(item?.namiValue) : sum), 0),
            8
        );

        totalGet = parseFloat(parseFloat(totalGet).toFixed(8));
        return totalGet;
    };

    const getAmount = () => Object.values(listCheck).reduce((a, item) => a + (item === true ? 1 : 0), 0);

    const [state, set] = useState({
        loadingPreOrder: false,
        preOrder: null,
        shouldRefreshRate: false,
        resultErr: ''
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const [swapTimer, setSwapTimer] = useState(null);

    const fetchPreSwapOrder = async () => {
        setState({ loadingPreOrder: true, preOrder: null });

        const assets = [];
        listAsset.forEach((item) => {
            if (listChecked.includes(item?.id + '')) {
                assets.push({
                    assetId: item?.id,
                    value: item?.available
                });
            }
        });

        const { status, data, code } = await fetchAPI({
            url: API_PREFETCH_ORDER_CONVERT_SMALL_BALANCE,
            options: {
                method: 'POST'
            },
            params: {
                assets
            }
        });

        if (status === ApiStatus.SUCCESS && data) {
            setState({ preOrder: data, shouldRefreshRate: false });
            setSwapTimer(data?.swapTimeout);
        } else {
            const e = find(Error, { code });
            console.error('Error when prefetch convert', e);
        }
        setState({ loadingPreOrder: false });
    };

    useEffect(() => {
        let interval;
        if (swapTimer) {
            interval = setInterval(() => {
                setSwapTimer((lastTimerCount) => {
                    if (lastTimerCount <= 1) {
                        clearInterval(interval);
                    }
                    return lastTimerCount - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [swapTimer]);

    const onConfirmOrder = async (preOrderId) => {
        setState({ processingOrder: true, resultErr: '' });

        const { status, data, code } = await fetchAPI({
            url: API_CONFIRM_ORDER_CONVERT_SMALL_BALANCE,
            options: {
                method: 'POST'
            },
            params: { preOrderId }
        });

        setState({ processingOrder: false });

        if (status === ApiStatus.SUCCESS && data) {
            const { displayingId } = data;
            setState({ preOrder: null, invoiceId: displayingId });
            setIsShowModalSuccess(true);
        } else {
            const e = find(Error, { code });
            const msg = e ? t(`error:${e?.message}`) : t('error:COMMON_ERROR');
            setState({ resultErr: code ? `(${code}) ${msg}` : `${msg}` });
            setSwapTimer(null);
        }
    };

    return (
        <>
            <button
                onClick={() => (auth?.kyc_status !== 2 ? setIsOpenModalKyc(true) : setIsShowPoppup((prev) => !prev))}
                className={`bg-gray-10 dark:bg-dark-2 flex items-center justify-between text-txtTabHover dark:text-white
           text-sm gap-3 rounded-md px-4 py-3 cursor-pointer ${className}`}
            >
                <LogoIcon />
                <div className="flex items-center gap-3">
                    {t('wallet:convert_small', { asset: 'NAMI' })}
                    <BxChevronDown size={24} />
                </div>
            </button>
            <ModalV2
                isVisible={isShowPoppup}
                onBackdropCb={() => setIsShowPoppup(false)}
                className="!w-auto"
                wrapClassName="!py-[14px] px-0 m-auto w-[488px] h-[680px] rounded-xl !border border-divider dark:border-divider-dark"
                btnCloseclassName="px-8 !pt-0"
            >
                <div className=" text-gray-15 dark:text-gray-4 tracking-normal text-base">
                    <div className="txtPri-3 px-8">{t('wallet:convert_small_balance')}</div>
                    {listAsset ? (
                        <div className="mt-6">
                            <div className="flex items-center gap-2 txtSecond-3 px-8 pb-3">
                                <div className="w-[100px]">{t('common:assets')}</div>
                                <span className="flex-auto text-right">{t('common:amount')}</span>
                                <div className="w-[154px] text-right overflow-hidden">{t('common:amount_nami')}</div>
                            </div>

                            <div className="max-h-[332px] h-[332px] overflow-y-scroll px-8">
                                {listAsset.length > 0 ? (
                                    listAsset.map((item) => {
                                        const { id, available, assetCode, assetDigit, namiValue } = item;
                                        return (
                                            <div key={'convert_small_ballance_' + id} className="py-3 flex items-center gap-2">
                                                <CheckBox
                                                    className="w-[100px]"
                                                    boxContainerClassName="w-5 h-5"
                                                    labelClassName="text-gray-15 dark:text-gray-4 tracking-normal text-base"
                                                    label={assetCode}
                                                    onChange={() => handleCheckToken(id)}
                                                    active={listCheck[id]}
                                                />
                                                <span className="flex-auto text-right">
                                                    {available ? formatWallet(available, assetCode === 'USDT' ? 2 : assetDigit) : '0.0000'}
                                                </span>
                                                <div className="w-[154px] text-right overflow-hidden">≈{namiValue}</div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="mt-6 py-[72px] px-[53px] flex items-center flex-col justify-center">
                                        {isDark ? <NoDataDarkIcon size={124} /> : <NoDataLightIcon size={124} />}
                                        <span className="text-txtSecondary dark:text-darkBlue-5 text-base mt-3">{t('common:no_assets_available')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 h-[332px] flex items-center justify-center">
                            <Spiner isDark={isDark} />
                        </div>
                    )}

                    <div className="px-8 border-t border-divider dark:border-divider-dark">
                        <div className="py-6 flex items-center justify-between select-none">
                            <CheckBox
                                className="w-[100px]"
                                boxContainerClassName="w-5 h-5"
                                labelClassName="text-gray-15 dark:text-gray-4 tracking-normal text-base font-semibold"
                                label={t('common:all')}
                                onChange={() => handleCheckAll()}
                                active={isCheckAll}
                                isDisable={!namiRate || listAsset.length === 0}
                            />
                            <span className="flex-auto text-right">{getAmount() + ' ' + t('wallet:selected')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base text-gray-1 dark:text-gray-7">{t('convert:you_will_get')}</span>
                            <span className="text-gray-15 dark:text-gray-4 tracking-normal text-[18px] leading-[26px] font-semibold">
                                {getTotalGet() + ' NAMI'}
                            </span>
                        </div>
                        <ButtonV2
                            disabled={!namiRate || listAsset.length === 0 || Object.values(listCheck).every((item) => !item)}
                            className="px-6 w-full mt-10"
                            onClick={handleBtnConvert}
                        >
                            {t('common:convert')}
                        </ButtonV2>
                    </div>
                </div>
            </ModalV2>

            {/* If user have not KYC yet */}
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} onBackdropCb={() => setIsOpenModalKyc(false)} />

            {/* Modal Confirm */}
            <ModalConfirm
                key="modal_confirm"
                isVisible={isShowModalConfirm}
                onBackdropCb={() => {
                    setIsShowModalConfirm(false);
                    setState({ preOrder: null });
                    setSwapTimer(null);
                }}
                t={t}
                onConfirm={() => (swapTimer ? onConfirmOrder(state.preOrder?.preOrderId) : !state.loadingPreOrder && fetchPreSwapOrder())}
                data={state.preOrder}
                swapTimer={swapTimer}
            />

            {/* Modal Result */}
            <ModalSuccess key="modal_success" isVisible={isShowModalSuccess} onBackdropCb={() => setIsShowModalSuccess(false)} t={t} />
            <AlertModalV2
                key="modal_error"
                isVisible={!!state.resultErr}
                onClose={() => setState({ resultErr: '' })}
                type="error"
                title={t('common:convert_fail')}
                message={state.resultErr}
            />
        </>
    );
};

const ModalConfirm = ({ isVisible, onBackdropCb, t, onConfirm, data, swapTimer }) => {
    if (!isVisible) return null;
    const positiveLabel = swapTimer <= 0 ? t('common:refresh') : `${t('common:convert')} (${swapTimer})`;

    return (
        <ModalV2 isVisible={isVisible} onBackdropCb={onBackdropCb} className="!max-w-[488px]" wrapClassName="!py-[30px] px-0" btnCloseclassName="px-8 !pt-0">
            <div className="text-gray-1 dark:text-gray-7 tracking-normal text-base font-normal flex items-center justify-between w-full flex-col px-8">
                <div className="relative h-20">
                    <NamiCircle className="absolute -translate-x-1/2" size={81.6} />
                </div>
                <span className="mt-6 mb-4">{t('wallet:convert_small_balance')}</span>
                <span className="txtPri-3">{t('common:confirm_convert')}</span>
                <TagV2 className="whitespace-nowrap mt-4 mb-8" type="warning">
                    {t('common:waiting_confirmation')}
                </TagV2>
                <div className="w-full rounded-md dark:bg-dark-4 bg-gray-13 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span>{t('common:amount_of_asset')}</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">{data?.assets?.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t('common:amount_of_estimate_nami')}</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">{data?.toQty}</span>
                    </div>
                </div>
                <ButtonV2 className="mt-10" onClick={onConfirm}>
                    {positiveLabel}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

const ModalSuccess = ({ isVisible, onBackdropCb, t }) => {
    return (
        <ModalV2 isVisible={isVisible} onBackdropCb={onBackdropCb} className="!max-w-[488px]" wrapClassName="!py-[30px] px-0" btnCloseclassName="px-8 !pt-0">
            <div className="text-gray-1 dark:text-gray-7 tracking-normal text-base font-normal flex items-center justify-between w-full flex-col px-8">
                <div className="relative h-20">
                    <NamiCircle className="absolute -translate-x-1/2" size={81.6} />
                </div>
                <span className="mt-6 mb-4">{t('wallet:convert_small_balance')}</span>
                <span className="txtPri-3">{t('common:convert_success')}</span>
                <TagV2 className="whitespace-nowrap mt-4 mb-8" type="success">
                    {t('common:convert_success')}
                </TagV2>
                <div className="w-full rounded-md dark:bg-dark-4 bg-gray-13 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span>ID</span>
                        <CopyText className="font-semibold text-gray-15 dark:text-gray-4" text={'#6'} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t('common:amount_of_asset')}</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">6</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t('common:time')}</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">6</span>
                    </div>
                </div>
                <ButtonV2 className="mt-10" onClick={() => router.push(`/${WALLET_SCREENS.TRANSACTION_HISTORY}`)}>
                    {t('common:global_btn.view_history')}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

export default TransferSmallBalanceToNami;

const NoDataLightIcon = ({ size }) => (
    <svg width={size ?? 168} height={size ?? 168} viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#fff" d="M0 0h168v168H0z" />
        <path
            d="m134.92 126.737-116.025 6.605-2.779-67.914-.463-11.017v-.263c0-.058-.029-.146-.029-.234l-.347-8.182c-.087-1.753 1.274-3.244 3.01-3.302l48.778-2.046c1.737-.058 3.184 1.286 3.271 3.04l.232 5.552 33.696-1.403V59.35h28.166l.261 8.27 2.229 59.117z"
            fill="#E9EEF4"
        />
        <path
            d="m152.641 70.042-17.369 60.198c-.319 1.082-1.39 1.841-2.635 1.9h-.028l-49.126 1.841-2.17.088-40.673 1.519-18.469.702c-1.737.058-3.184-1.14-3.271-2.689v-.234l18.787-58.65.55-1.724v-.03c.348-1.022 1.39-1.752 2.577-1.81l.81-.03 91.042-3.536 17.051-.672c1.939-.088 3.387 1.49 2.924 3.127z"
            fill="url(#ls10512bha)"
        />
        <path d="M132.434 59.3h-28.167V47.525l24.519-1.023c1.737-.087 3.185 1.286 3.271 3.01l.087 2.133.087 2.134.203 5.23v.293z" fill="url(#xhrnpzl8nb)" />
        <path
            d="M152.726 30.542v28.755h-20.292v-.292l-.203-5.23-.087-2.134-.087-2.133a3.11 3.11 0 0 0-3.271-3.01l-24.519 1.023V30.542h48.459z"
            fill="#E9EEF4"
        />
        <path d="M134.055 34.262H110v.701h24.055v-.701zM126.818 37.297H110V38h16.818v-.702zM126.818 40.37H110v.7h16.818v-.7z" fill="#fff" />
        <defs>
            <linearGradient id="ls10512bha" x1="82.539" y1="106.923" x2="144.736" y2="30.209" gradientUnits="userSpaceOnUse">
                <stop offset=".008" stop-color="#C6CEDE" />
                <stop offset=".22" stop-color="#D1D8E4" />
                <stop offset=".315" stop-color="#D8DEE8" />
                <stop offset=".852" stop-color="#F7F8FA" stop-opacity=".513" />
                <stop offset=".977" stop-color="#fff" stop-opacity=".4" />
            </linearGradient>
            <linearGradient id="xhrnpzl8nb" x1="103.243" y1="56.27" x2="146.839" y2="48.191" gradientUnits="userSpaceOnUse">
                <stop offset=".008" stop-color="#C6CEDE" />
                <stop offset=".017" stop-color="#C7CFDE" />
                <stop offset=".65" stop-color="#EFF2F6" />
                <stop offset=".977" stop-color="#fff" />
            </linearGradient>
        </defs>
    </svg>
);

const NoDataDarkIcon = ({ size }) => (
    <svg width={size ?? 168} height={size ?? 168} viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="m140.01 130.891-127.62 7.137-3.11-73.459-.475-11.926v-.27a2.286 2.286 0 0 1 0-.253l-.404-8.89c-.04-.91.285-1.8.904-2.472a3.471 3.471 0 0 1 2.4-1.114l53.645-2.216a3.485 3.485 0 0 1 2.496.923 3.438 3.438 0 0 1 1.097 2.41l.255 5.993 37.075-1.527v12.686h30.995l.282 8.942 2.46 64.036z"
            fill="#E2E8F0"
        />
        <path
            d="m159.513 69.552-19.108 65.126a3.024 3.024 0 0 1-1.116 1.482 3.06 3.06 0 0 1-1.775.56l-54.005 1.989-2.38.087-44.72 1.641-20.33.75a3.348 3.348 0 0 1-2.397-.73 3.3 3.3 0 0 1-1.205-2.184v-.253l20.594-63.452.606-1.858a3.065 3.065 0 0 1 1.11-1.43 3.099 3.099 0 0 1 1.728-.56h.879l100.155-3.83 18.766-.706c2.1-.122 3.682 1.623 3.198 3.368z"
            fill="url(#ky4xxhhbva)"
        />
        <path
            d="M137.27 57.912h-30.996V45.184l26.963-1.108a3.453 3.453 0 0 1 2.485.89 3.39 3.39 0 0 1 1.109 2.381l.096 2.312.106 2.295.228 5.653.009.305z"
            fill="url(#ot2ez301nb)"
        />
        <path
            d="M159.577 26.801v31.111H137.27v-.305l-.228-5.653-.106-2.295-.096-2.312a3.39 3.39 0 0 0-1.109-2.381 3.43 3.43 0 0 0-2.485-.89l-26.972 1.108V26.8h53.303z"
            fill="#E2E8F0"
        />
        <path d="M139.043 30.814h-26.444v.768h26.444v-.768zM131.084 34.121h-18.485v.768h18.485v-.768zM131.084 37.428h-18.485v.768h18.485v-.768z" fill="#fff" />
        <defs>
            <linearGradient id="ky4xxhhbva" x1="81.945" y1="122.473" x2="101.632" y2="29.207" gradientUnits="userSpaceOnUse">
                <stop offset=".01" stop-color="#9FA4AB" />
                <stop offset=".26" stop-color="#9FA4AB" />
                <stop offset=".35" stop-color="#A2A7AE" stop-opacity=".96" />
                <stop offset=".46" stop-color="#ABAFB6" stop-opacity=".86" />
                <stop offset=".6" stop-color="#BABDC2" stop-opacity=".7" />
                <stop offset=".74" stop-color="#CFD1D4" stop-opacity=".47" />
                <stop offset=".89" stop-color="#E9EAEB" stop-opacity=".18" />
                <stop offset=".98" stop-color="#F9F9F9" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="ot2ez301nb" x1="94.976" y1="50.994" x2="146.389" y2="50.994" gradientUnits="userSpaceOnUse">
                <stop offset=".01" stop-color="#9FA4AB" />
                <stop offset=".19" stop-color="#9FA4AB" />
                <stop offset=".33" stop-color="#A5AAB0" />
                <stop offset=".52" stop-color="#B6BABF" />
                <stop offset=".74" stop-color="#D2D4D7" />
                <stop offset=".98" stop-color="#F9F9F9" />
            </linearGradient>
        </defs>
    </svg>
);
