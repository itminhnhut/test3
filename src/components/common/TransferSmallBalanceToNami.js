import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect } from 'react';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, setTransferModal, walletLinkBuilder, CopyText } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import { TabItemNao } from 'components/screens/Nao/NaoStyle';
import { isEmpty, isNumber } from 'lodash';
import NamiCircle from 'components/svg/NamiCircle';
import TagV2 from 'components/common/V2/TagV2';

const TransferSmallBalanceToNami = ({ width, className, allAssets, usdRate }) => {
    const { t } = useTranslation();
    const [isShowPoppup, setIsShowPoppup] = useState(false);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [currentTheme] = useDarkMode();
    const [listCheck, setListCheck] = useState([]);
    const [listAsset, setListAsset] = useState([]);
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
    const [isShowModalResult, setIsShowModalResult] = useState(false);
    const isDark = currentTheme === THEME_MODE.DARK;
    const namiUsdRate = usdRate?.['1'] || 0.4;

    useEffect(() => {
        if (allAssets) {
            if (!namiUsdRate) setListAsset([]);
            else {
                let _listAsset = [];
                allAssets.forEach((item) => {
                    const { assetCode, assetDigit, assetName, id, status, wallet, walletTypes, available } = item;

                    const assetUsdRate = usdRate?.[item?.id] || 0;
                    const totalUsd = available * assetUsdRate;
                    const totalNami = totalUsd / namiUsdRate;
                    const namiValue = formatWallet(totalNami, 1);

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
    }, [usdRate, allAssets]);

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
    };
    const listChecked = _.keys(_.pickBy(listCheck));
    const totalGet = listAsset.reduce((sum, item) => (listChecked.includes(item?.id + '') ? sum + parseFloat(item?.namiValue) : sum), 0);

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
                className="!max-w-[488px]"
                wrapClassName="!py-[30px] px-0"
                btnCloseclassName="px-8 !pt-0"
            >
                <div className=" text-gray-15 dark:text-gray-4 tracking-normal text-base">
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
                                <div className="mt-6 py-[80px] px-[53px] flex items-center flex-col justify-center">
                                    {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
                                    <span className={'text-txtSecondary dark:text-darkBlue-5 text-base'}>{t('common:no_assets_available')}</span>
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
                                isDisable={!namiUsdRate || listAsset.length === 0}
                            />
                            <span className="flex-auto text-right">
                                {Object.values(listCheck).reduce((a, item) => a + (item === true ? 1 : 0), 0) + ' ' + t('wallet:selected')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-base text-gray-1 dark:text-gray-7">{t('convert:you_will_get')}</span>
                            <span className="text-gray-15 dark:text-gray-4 tracking-normal text-[18px] leading-[26px] font-semibold">{totalGet}</span>
                        </div>
                        <ButtonV2
                            disabled={!namiUsdRate || listAsset.length === 0 || Object.values(listCheck).every((item) => !item)}
                            className="px-6 !text-sm w-full mt-10"
                            onClick={handleBtnConvert}
                        >
                            {t('common:convert')}
                        </ButtonV2>
                    </div>
                </div>
            </ModalV2>
            {/* Modal Confirm */}
            <ModalConfirm isVisible={isShowModalConfirm} onBackdropCb={() => setIsShowModalConfirm(false)} t={t} key="modal_confirm" />
            {/* Modal Result */}
            <ModalResult isVisible={isShowModalResult} onBackdropCb={() => setIsShowModalResult(false)} t={t} key="modal_result" />
        </>
    );
};

const ModalConfirm = ({ isVisible, onBackdropCb, t }) => {
    const [swapTimer, setSwapTimer] = useState(null);

    const positiveLabel = swapTimer <= 0 ? t('common:refresh') : `${t('common:confirm')} (${swapTimer})`;

    const onConfirmOrder = () => {
        console.log('confirm order');
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
                        <span className="font-semibold text-gray-15 dark:text-gray-4">6</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>{t('common:amount_of_estimate_nami')}</span>
                        <span className="font-semibold text-gray-15 dark:text-gray-4">6</span>
                    </div>
                </div>
                <ButtonV2 className="mt-10" onClick={() => (swapTimer ? onConfirmOrder(state.preOrder?.preOrderId) : setSwapTimer(6))}>
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
                <ButtonV2
                    className="mt-10"
                    onClick={() => console.log('view_detail')}
                    // onClick={() =>
                    //     swapTimer
                    //         ? onConfirmOrder(state.preOrder?.preOrderId)
                    //         : !state.loadingPreOrder && fetchPreSwapOrder(state.fromAsset, state.toAsset, +state.fromAmount)
                    // }
                >
                    {t('common:view_detail')}
                </ButtonV2>
            </div>
        </ModalV2>
    );
};

export default TransferSmallBalanceToNami;
