import React, { useState, useCallback, useMemo, useRef, useContext } from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { getS3Url, formatNumber, formatTime } from 'redux/actions/utils';
import { BackgroundHeader, CardNao, ButtonNao, Tooltip } from 'components/screens/Nao/NaoStyle';
import Slider from 'components/trade/InputSlider';
import colors from 'styles/colors';
import { ThumbLabel } from 'components/trade/StyleInputSlider';
import ceil from 'lodash/ceil';
import fetchApi from 'utils/fetch-api';
import { API_POOL_STAKE, API_POOL_UN_STAKE } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import TradingInput from 'components/trade/TradingInput';
import { useTranslation } from 'next-i18next';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import ModalV2 from 'components/common/V2/ModalV2';
import CheckBox from 'components/common/CheckBox';
import { useEffect } from 'react';
import { addDays } from 'date-fns';
import { floor } from 'lodash';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import SvgCross from 'components/svg/Cross';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
import { ChevronLeft } from 'react-feather';

const StateLockModal = ({ visible = true, onClose, isLock, onConfirm, assetNao, data, balance = 0 }) => {
    const context = useContext(AlertContext);
    const [percent, setPercent] = useState(0);
    const { t } = useTranslation();
    const arrPercent = ['25', '50', '75', '100'];
    const [amount, setAmount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const isChangeSlide = useRef(false);
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const onChangePercent = (x) => {
        isChangeSlide.current = true;
        const _amount = floor((balance * x) / 100, assetNao?.assetDigit ?? 8);
        setAmount(_amount);
        setPercent(x);
    };

    const customPercentLabel = useCallback((pos) => {
        return (
            <ThumbLabel
                isZero={pos.left === 0}
                isDark
                onusMode
                className={`left-1/2 translate-x-[-50%] w-max !text-sm !font-medium text-txtPrimary dark:text-txtPrimary-dark`}
            >
                {ceil(pos.left, 0)}%
            </ThumbLabel>
        );
    }, []);

    const onChangeAmount = (e) => {
        if (isChangeSlide.current) {
            isChangeSlide.current = false;
            return;
        }
        const _amount = e.floatValue ?? '';
        setAmount(_amount);
        const per = balance ? +(!_amount ? 0 : (_amount * 100) / balance).toFixed(0) : 0;
        setPercent(per);
    };

    const onSave = async () => {
        if (!amount || loading || !validator().isValid) return;
        let isAlert = localStorage.getItem('hidden_alert');
        if (isAlert) {
            isAlert = JSON.parse(isAlert);
        }
        if (!showAlert && !isAlert?.hidden) {
            setShowAlert(true);
            return;
        }
        setLoading(true);
        try {
            const { data, status, message } = await fetchApi({
                url: isLock ? API_POOL_STAKE : API_POOL_UN_STAKE,
                options: {
                    method: 'POST'
                },
                params: { amount: Number(amount) }
            });
            if (status === ApiStatus.SUCCESS) {
                context.alert.show(
                    'success',
                    t(`nao:pool:${isLock ? 'stake' : 'unstake'}_success`),
                    t(`nao:pool:${isLock ? 'stake' : 'unstake'}_message`),
                    null,
                    null,
                    () => {
                        if (onConfirm) onConfirm();
                    }
                );
            } else {
                context.alert.show('error', t('common:failed'), t(`error:${status || 'UNKNOWN'}`));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const validator = () => {
        if (amount > balance) {
            return { msg: `${t('nao:maximum_amount')} ${formatNumber(balance, assetNao?.assetDigit)}`, isValid: false };
        }
        if (amount < 1000 && isLock) {
            return { msg: `${t('nao:minimum_amount')} ${formatNumber(1000)}`, isValid: false };
        }
        return { isValid: true };
    };

    // const overview = useMemo(() => {
    //     const available = (data?.availableStaked ?? 0) + amount;
    //     return {
    //         available: available,
    //         estimate:
    //     }
    // }, [amount, data])
    // console.log(overview)
    return (
        <Portal portalId="PORTAL_MODAL">
            <AlertModal
                visible={showAlert}
                onConfirm={onSave}
                onClose={() => setShowAlert(false)}
                t={t}
                isLock={isLock}
                amount={amount}
                decimal={assetNao?.assetDigit ?? 8}
                data={data}
                loading={loading}
            />
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-bgPrimary dark:bg-bgPrimary-dark disabled-zoom',
                    { invisible: !visible },
                    { visible: visible }
                )}
            >
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="flex items-center px-4 pb-4 pt-6 space-x-2">
                        <ChevronLeft size={20} onClick={onClose} />
                        <label onClick={onClose} className="font-semibold">
                            {t(`nao:pool:${isLock ? 'lock' : 'unlock'}`)} NAO
                        </label>
                    </div>
                    <div className="px-4 py-6">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs mb-2">{t('nao:pool:input_lock')}</div>
                        <TradingInput
                            validator={validator()}
                            thousandSeparator
                            allowNegative={false}
                            labelClassName="hidden"
                            className={`flex-grow text-txtSecondary dark:text-txtSecondary-dark w-full !text-sm`}
                            containerClassName={`w-full dark:bg-dark-2 text-sm`}
                            value={amount}
                            decimalScale={assetNao?.assetDigit}
                            onValueChange={onChangeAmount}
                            renderTail={() => <div className="text-txtSecondary-dark dark:text-txtSecondary-dark text-sm">NAO</div>}
                            inputMode="decimal"
                            allowedDecimalSeparators={[',', '.']}
                            errorTooltip={false}
                            // renderText={(e) => console.log(e)}
                        />
                        <div className="my-6 -mx-2">
                            <Slider
                                useLabel
                                positionLabel="top"
                                labelSuffix="%"
                                x={percent}
                                axis="x"
                                xStart={0}
                                xmax={100}
                                onChange={({ x }) => onChangePercent(x)}
                            />
                        </div>
                        <div className="text-sm space-y-2 mb-12">
                            {isLock && (
                                <div className="flex justify-between">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:minimun', { value: '' })}</div>&nbsp;
                                    <div className="font-semibold">1,000 NAO</div>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:available')}</div>&nbsp;
                                <div className="font-semibold">{formatNumber(balance, assetNao?.assetDigit ?? 0)} NAO</div>
                            </div>
                        </div>
                        {isLock && (
                            <div>
                                <Tooltip
                                    id="tooltip-profit-est"
                                    className="w-full sm_only:!max-w-[calc(100%-2rem)] sm_only:!mx-4 sm_only:after:!left-10 sm_only:after:translate-x-[-50%]"
                                    overridePosition={({ top, left }) => {
                                        if (window?.innerWidth < 640) {
                                            // 640 is the breakpoint of small devices
                                            return {
                                                top,
                                                left: 0
                                            };
                                        }

                                        return { top, left };
                                    }}
                                />
                                <label className="text-sm text-txtPrimary dark:text-txtPrimary-dark leading-6 font-semibold">
                                    {t('nao:pool:lock_overview')}
                                </label>
                                <CardNao className="mt-2 !p-4 space-y-2 !bg-gray-13 dark:!bg-dark-4">
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:pool:qty_lock')}</div>
                                        <span className="font-semibold">{formatNumber(data?.availableStaked, assetNao?.assetDigit ?? 8)} NAO</span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:pool:est_apy_2')}</div>
                                        <span className="font-semibold">{formatNumber(data?.apy, 2)}%</span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                        <div
                                            className="text-txtSecondary dark:text-txtSecondary-dark border-gray-1 dark:border-gray-7 border-b border-dashed"
                                            data-tip={t('nao:pool:tooltip_profit_est')}
                                            data-for="tooltip-profit-est"
                                        >
                                            {t('nao:pool:est_profit')}
                                        </div>
                                        <span className="font-semibold">~{formatNumber(data?.profitEstimated, 0) + ' VNDC'} </span>
                                    </div>
                                    <div className="text-sm flex justify-between items-center">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:pool:lock_duration')}</div>
                                        <span className="font-semibold">
                                            {data?.duration ?? 7} {t('nao:pool:days')}
                                        </span>
                                    </div>
                                </CardNao>
                            </div>
                        )}
                        <CardNao className="mt-3 text-xs p-4 !bg-gray-13 dark:!bg-dark-4 mb-[7rem]">
                            <div className="flex items-center space-x-2">
                                <BxsInfoCircle size={16} color={colors.gray[7]} />
                                <span className="font-semibold text-sm">{t('nao:note')}</span>
                            </div>
                            <div className="text-txtSecondary dark:text-txtSecondary-dark mt-2">{t(`nao:pool:description_${isLock ? 'lock' : 'unlock'}`)}</div>
                        </CardNao>
                        <div className="fixed left-0 bottom-0 w-full pb-12 pt-8 px-4 border-t border-divider dark:border-divider-dark bg-white dark:bg-dark">
                            <ButtonNao
                                onClick={onSave}
                                className={`py-3 font-semibold ${
                                    !Number(amount) || !validator()?.isValid ? '!bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark' : ''
                                }`}
                            >
                                {t('common:confirm')}
                            </ButtonNao>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

const AlertModal = ({ visible, onConfirm, onClose, t, isLock, amount, decimal, data, loading }) => {
    const [checked, setChecked] = useState(false);

    const onHandleChecked = () => {
        localStorage.setItem('hidden_alert', JSON.stringify({ hidden: !checked }));
        setChecked(!checked);
    };

    const timeTogetBack = useMemo(() => {
        const now = new Date();
        return addDays(now, Number(data?.duration ?? 7));
    }, [data]);

    const revenue = useMemo(() => {
        if (!data) return 0;
        const _amount = isLock ? amount : -amount;
        const availableStaked = data?.availableStaked ?? 0;
        const totalStaked = data?.totalStaked ?? 0;
        const ratio = (availableStaked + _amount) / (totalStaked + _amount);
        return (data?.poolRevenueThisWeek ?? 0) * ratio;
    }, [data]);

    return (
        <ModalV2 isMobile isVisible={visible} onBackdropCb={onClose} wrapClassName="pb-12">
            <label className="text-[20px] font-semibold leading-6">{t(`nao:pool:confirm_${isLock ? 'lock' : 'unlock'}`)}</label>
            <div className="text-sm mt-8 bg-gray-13 dark:bg-dark-4 p-4 rounded-xl flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t(`nao:pool:amount_${isLock ? 'lock' : 'unlock'}`)}</label>
                    <span className="font-semibold">{formatNumber(amount, decimal)} NAO</span>
                </div>
                {/* <div className="flex items-center justify-between py-3">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:pool:est_revenue')}</label>
                    <span>{formatNumber(revenue, decimal)} NAO</span>
                </div> */}
                <div className="flex items-center justify-between">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark">
                        {isLock ? t('nao:pool:lock_duration') : t('nao:pool:time_to_get_back')}
                    </label>
                    <span className="font-semibold">
                        {isLock ? `${data?.duration ?? 7} ${t('nao:pool:days')}` : formatTime(timeTogetBack, 'HH:mm:ss dd/MM/yyyy')}{' '}
                    </span>
                </div>
            </div>
            {/* <div className="flex items-center mt-6" onClick={onHandleChecked}>
                <CheckBox onusMode={true} active={checked}
                    boxContainerClassName={`rounded-[2px] ${checked ? '' : '!bg-gray-12 dark:!bg-dark-2'}`} />
                <span className="ml-3 whitespace-nowrap text-txtSecondary dark:text-txtSecondary-dark text-xs">
                    {t('nao:pool:not_show_message')}
                </span>
            </div> */}
            <ButtonNao onClick={onConfirm} className={`h-11 mt-8 w-full flex items-center justify-center rounded-md`}>
                {t('common:confirm')}
            </ButtonNao>
        </ModalV2>
    );
};

export default StateLockModal;
