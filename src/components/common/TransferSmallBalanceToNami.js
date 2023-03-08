import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect } from 'react';
import * as Error from 'redux/actions/apiError';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, setTransferModal, walletLinkBuilder, CopyText } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { NoDataDarkIcon } from 'components/common/V2/TableV2/NoData';
import { TabItemNao } from 'components/screens/Nao/NaoStyle';
import { find, isEmpty, isNumber, keys, pickBy } from 'lodash';
import NamiCircle from 'components/svg/NamiCircle';
import TagV2 from 'components/common/V2/TagV2';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import { PATHS } from 'constants/paths';
import { API_CONFIRM_ORDER_CONVERT_SMALL_BALANCE, API_GET_NAMI_RATE, API_PREFETCH_ORDER_CONVERT_SMALL_BALANCE } from '../../redux/actions/apis';

const REJECT_PREORDER = ['BROKER_ERROR', 'PRICE_CHANGED', 'INVALID_SWAP_REQUEST_ID', 'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET'];

const TransferSmallBalanceToNami = ({ width, className, allAssets }) => {
    const { t } = useTranslation();
    const [isShowPoppup, setIsShowPoppup] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [currentTheme] = useDarkMode();
    const [listCheck, setListCheck] = useState([]);
    const [listAsset, setListAsset] = useState([]);
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
    const [isShowModalResult, setIsShowModalResult] = useState(false);
    const [dataModal, setDataModal] = useState({ amount: 0, namiAmount: 0 });
    const [namiRate, setNamiRate] = useState(null);

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
                    const { assetCode, assetDigit, assetName, id, status, wallet, walletTypes, available } = item;

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
        if (allAssets && isEmpty(listCheck)) {
            const parseArray = _.reduce(
                allAssets,
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
    }, [allAssets]);

    const handleCheckAll = () => {
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
        // onRefreshData();
    };

    const listChecked = keys(pickBy(listCheck));

    const getTotalGet = () => {
        const totalGet = formatWallet(
            listAsset.reduce((sum, item) => (listChecked.includes(item?.id + '') ? sum + parseFloat(item?.namiValue) : sum), 0),
            1
        );
        return totalGet;
    };

    const getAmount = () => Object.values(listCheck).reduce((a, item) => a + (item === true ? 1 : 0), 0);

    const [state, set] = useState({
        loadingPreOrder: false,
        preOrder: null,
        shouldRefreshRate: false
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
        setState({ processingOrder: true });

        const result = await fetchAPI({
            url: API_CONFIRM_ORDER_CONVERT_SMALL_BALANCE,
            options: {
                method: 'POST'
            },
            params: { preOrderId }
        });

        setState({ processingOrder: false });

        if (result?.status === ApiStatus.SUCCESS && result?.data) {
            const { displayingId } = result?.data;
            setState({ preOrder: null, invoiceId: displayingId });
            setIsShowModalResult(true);
        } else {
            const error = find(Error, { code: result?.code });
            console.error('Error when confirm order: ', error);
            setSwapTimer(null);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsShowPoppup((prev) => !prev)}
                className={`bg-gray-10 dark:bg-dark-2 flex items-center justify-between text-txtTabHover dark:text-white 
           text-sm gap-3 rounded-md px-4 py-3 cursor-pointer ${className}`}
            >
                <LogoIcon />
                <div className="flex items-center gap-3">
                    {width >= 640 ? t('wallet:convert_small', { asset: 'NAMI' }) : t('wallet:convert_small_mobile', { asset: 'NAMI' })}
                    <BxChevronDown size={24} />
                </div>
            </button>
            <ModalV2
                // isVisible={isShowPoppup}
                isVisible={true}
                onBackdropCb={() => setIsShowPoppup(false)}
                className="!max-w-[488px] !border-divider"
                wrapClassName="!py-[30px] px-0"
                btnCloseclassName="px-8 !pt-0"
            >
                <div className=" text-gray-15 dark:text-gray-4 tracking-normal text-base ">
                    <div className="txtPri-3 px-8">{t('wallet:convert_small_balance')}</div>
                    {listAsset ? (
                        <div className="mt-6 max-h-[332px] overflow-y-scroll px-8">
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
                                            <div className="w-[154px] text-right overflow-hidden">{namiValue}</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="mt-6 py-[72px] px-[53px] flex items-center flex-col justify-center">
                                    {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
                                    <span className="text-txtSecondary dark:text-darkBlue-5 text-base mt-3">{t('common:no_assets_available')}</span>
                                </div>
                            )}
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
                            <span className="text-gray-15 dark:text-gray-4 tracking-normal text-[18px] leading-[26px] font-semibold">{getTotalGet()}</span>
                        </div>
                        <ButtonV2
                            disabled={!namiRate || listAsset.length === 0 || Object.values(listCheck).every((item) => !item)}
                            className="px-6 !text-sm w-full mt-10"
                            onClick={handleBtnConvert}
                        >
                            {t('common:convert')}
                        </ButtonV2>
                    </div>
                </div>
            </ModalV2>

            {/* Modal Confirm */}
            <ModalConfirm
                isVisible={isShowModalConfirm}
                onBackdropCb={() => {
                    setIsShowModalConfirm(false);
                    setState({ preOrder: null });
                    setSwapTimer(null);
                }}
                t={t}
                key="modal_confirm"
                onConfirm={() => {
                    swapTimer ? onConfirmOrder(state.preOrder?.preOrderId) : !state.loadingPreOrder && fetchPreSwapOrder();
                }}
                data={state.preOrder}
                swapTimer={swapTimer}
            />

            {/* Modal Result */}
            <ModalResult isVisible={isShowModalResult} onBackdropCb={() => setIsShowModalResult(false)} t={t} key="modal_result" />
        </>
    );
};

const ModalConfirm = ({ isVisible, onBackdropCb, t, onConfirm, data, swapTimer }) => {
    if (!isVisible) return null;
    const positiveLabel = swapTimer <= 0 ? t('common:refresh') : `${t('common:confirm')} (${swapTimer})`;

    return (
        <ModalV2 isVisible={isVisible} onBackdropCb={onBackdropCb} className="!max-w-[488px]" wrapClassName="!py-[30px] px-0" btnCloseclassName="px-8 !pt-0">
            <div className="text-gray-1 dark:text-gray-7 tracking-normal text-base font-normal flex items-center justify-between w-full flex-col px-8">
                <NamiCircle size={68} />
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

const ModalResult = ({ isVisible, onBackdropCb, t }) => {
    return (
        <ModalV2 isVisible={isVisible} onBackdropCb={onBackdropCb} className="!max-w-[488px]" wrapClassName="!py-[30px] px-0" btnCloseclassName="px-8 !pt-0">
            <div className="text-gray-1 dark:text-gray-7 tracking-normal text-base font-normal flex items-center justify-between w-full flex-col px-8">
                <NamiCircle size={68} />
                <span className="mt-6 mb-4">{t('wallet:convert_small_balance')}</span>
                <span className="txtPri-3">{t('common:convert_success')}</span>
                <TagV2 className="whitespace-nowrap mt-4 mb-8" type="success">
                    {t('common:success')}
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
                <ButtonV2 className="mt-10" onClick={() => console.info('view_detail')}>
                    {t('common:view_detail')}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

export default TransferSmallBalanceToNami;

const NoDataLightIcon = () => (
    <svg width="125" height="124" viewBox="0 0 125 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M100.582 93.544 14.945 98.42l-2.051-50.127-.342-8.131v-.194c0-.044-.021-.108-.021-.173l-.257-6.04c-.064-1.293.94-2.393 2.223-2.437l36.002-1.51a2.34 2.34 0 0 1 2.414 2.244l.172 4.098 24.87-1.035v8.692h20.79l.192 6.104 1.645 43.634z"
            fill="#E9EEF4"
        />
        <path
            d="m113.663 51.697-12.82 44.433c-.235.798-1.026 1.359-1.945 1.402h-.021L62.618 98.89l-1.602.064-30.02 1.122-13.632.517c-1.282.044-2.35-.84-2.415-1.984v-.172l13.867-43.29.406-1.272v-.022c.256-.755 1.026-1.294 1.902-1.337l.598-.022 67.198-2.61 12.585-.496c1.431-.064 2.5 1.1 2.158 2.308z"
            fill="url(#lsi0nluwsa)"
        />
        <path d="M98.747 43.77h-20.79v-8.693l18.098-.755c1.281-.064 2.35.95 2.414 2.222l.064 1.574.064 1.575.15 3.86v.217z" fill="url(#ysalzfvymb)" />
        <path d="M113.725 22.543v21.224H98.747v-.216l-.15-3.86-.064-1.575-.064-1.575a2.296 2.296 0 0 0-2.414-2.221l-18.098.755V22.543h35.768z" fill="#E9EEF4" />
        <path d="M99.945 25.288H82.19v.518h17.755v-.518zM94.603 27.529H82.19v.518h12.413v-.518zM94.603 29.796H82.19v.518h12.413v-.518z" fill="#fff" />
        <defs>
            <linearGradient id="lsi0nluwsa" x1="61.921" y1="78.919" x2="107.828" y2="22.297" gradientUnits="userSpaceOnUse">
                <stop offset=".008" stop-color="#C6CEDE" />
                <stop offset=".22" stop-color="#D1D8E4" />
                <stop offset=".315" stop-color="#D8DEE8" />
                <stop offset=".852" stop-color="#F7F8FA" stop-opacity=".513" />
                <stop offset=".977" stop-color="#fff" stop-opacity=".4" />
            </linearGradient>
            <linearGradient id="ysalzfvymb" x1="77.201" y1="41.532" x2="109.379" y2="35.57" gradientUnits="userSpaceOnUse">
                <stop offset=".008" stop-color="#C6CEDE" />
                <stop offset=".017" stop-color="#C7CFDE" />
                <stop offset=".65" stop-color="#EFF2F6" />
                <stop offset=".977" stop-color="#fff" />
            </linearGradient>
        </defs>
    </svg>
);
