import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { Minus, Plus, X } from 'react-feather';
import { ScaleLoader } from 'react-spinners';
import SvgWarning from 'components/svg/SvgWarning';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Button from 'components/common/Button';

import Slider from 'components/trade/InputSlider';
import colors from 'styles/colors';
import axios from 'axios';
import { formatNumber, scrollFocusInput, emitWebViewEvent, getLoginUrl } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TradingInput from 'components/trade/TradingInput';
import WarningCircle from '../../svg/WarningCircle';
import ModalV2 from 'components/common/V2/ModalV2';
import Modal from 'components/common/ReModal';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { BxsInfoCircle } from 'components/svg/SvgIcon';

const FuturesLeverageSettings = ({
    pair,
    isVisible,
    onClose,
    leverage,
    setLeverage,
    pairConfig,
    leverageBracket,
    isAuth,
    isVndcFutures,
    dots,
    className,
    onusMode = false,
    containerStyle
}) => {
    const [currentTheme] = useDarkMode();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [_leverage, _setLeverage] = useState(leverage);
    const [_leverageBracket, _setLeverageBracket] = useState(pairConfig?.leverageBracket?.[0]);
    const isDark = currentTheme === THEME_MODE.DARK;

    // reset leverage on modal toggle
    useEffect(() => {
        _setLeverage(leverage);
    }, [isVisible, leverage]);

    const onSetLeverage = async (symbol, leverage) => {
        setLoading(true);
        try {
            const { data } = await axios.post(API_FUTURES_LEVERAGE, {
                symbol,
                leverage
            });
            if (data?.status === 'ok') {
                setLeverage(data?.data?.[symbol]);
            }
        } catch (error) {
            // console.log(`Can't set leverage `, e)
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const renderNotionalCap = useCallback(() => {
        return (
            <span className="text-txtPrimary dark:text-txtPrimary-dark">
                {formatNumber(_leverageBracket?.notionalCap, pairConfig?.quoteAssetPrecision)} {pairConfig?.quoteAsset}
            </span>
        );
    }, [_leverageBracket, pairConfig]);

    const getValidator = useMemo(() => {
        let isValid = true;
        let msg = null;
        const min = pairConfig?.leverageConfig?.min ?? 0;
        const max = pairConfig?.leverageConfig?.max ?? 0;
        if (min > _leverage) {
            msg = t('common:min_leverage') + ` ${min}`;
            isValid = false;
        }
        if (max < _leverage) {
            msg = t('common:max_leverage') + ` ${max}`;
            isValid = false;
        }
        return { isValid, msg, isError: !isValid };
    }, [_leverage]);

    const textDescription = (key, data) => {
        let rs = {};
        switch (key) {
            case 'leverage':
                rs = {
                    min: `${t('common:min')}: ${formatNumber(data?.min, 0)}`,
                    max: `${t('common:max')}: ${data?.max ? formatNumber(data?.max, 0) : '-'}`
                };
                return `${rs.min}. ${rs.max}.`;
            default:
                break;
        }
        return '';
    };

    const renderConfirmButton = useCallback(
        () =>
            onusMode ? (
                <Button
                    title={loading ? <ScaleLoader color={colors.white} width={2} height={12} /> : t('futures:leverage:confirm')}
                    onusMode={true}
                    componentType="button"
                    className={`!text-[16px] !font-semibold !h-[48px]`}
                    type="primary"
                    disabled={loading || getValidator?.isError}
                    onClick={() => !loading && onSetLeverage(pair, _leverage)}
                />
            ) : (
                <ButtonV2
                    className={`${onusMode ? '!text-[16px] !font-semibold !h-[48px]' : '!h-[48px]'} ${
                        !onusMode && getValidator?.isError ? '!bg-gray-3 dark:!bg-darkBlue-4 text-gray-1 dark:text-darkBlue-2 cursor-not-allowed' : ''
                    }`}
                    disabled={loading || getValidator?.isError}
                    onClick={() => !loading && onSetLeverage(pair, _leverage)}
                >
                    {loading ? <ScaleLoader color={colors.white} width={2} height={12} /> : t('futures:leverage:confirm')}
                </ButtonV2>
            ),
        [_leverage, pair, loading, onusMode]
    );

    useEffect(() => {
        if (_leverage && pairConfig) {
            _setLeverageBracket(pairConfig?.leverageBracket?.find((o) => _leverage >= o?.initialLeverage));
        }
    }, [_leverage, pairConfig]);

    const onLogin = () => {
        emitWebViewEvent('login');
    };

    const changeClass = `w-5 h-5 flex items-center justify-center rounded-md  ${
        onusMode ? 'hover:bg-gray-11 dark:hover:bg-dark-1' : 'hover:bg-bgHover dark:hover:bg-bgHover-dark'
    }`;

    const onusModal = useCallback(
        () => (
            <Modal
                onusMode={true}
                isVisible={isVisible}
                onBackdropCb={onClose}
                containerClassName={`max-w-[306px] select-none ${className}`}
                containerStyle={{ ...containerStyle }}
            >
                <div className={`mb-6 text-lg font-bold`}>
                    <div className="text-[22px] dark:text-txtPrimary-dark font-semibold">{t('futures:leverage:title')}</div>
                </div>

                <div className={`mb-1.5 font-medium text-txtSecondary dark:text-txtSecondary-dark uppercase text-xs`}>{t('futures:leverage:leverage')}</div>
                <div className={`px-2 flex items-center bg-gray-12 dark:bg-dark-2  mb-6 h-[44px] rounded-[4px]`}>
                    <div className={`${changeClass}`}>
                        <Minus
                            size={20}
                            className={`text-txtPrimary dark:text-txtPrimary-dark w-5 cursor-pointer`}
                            onClick={() => _leverage > 1 && _setLeverage((prevState) => Number(prevState) - 1)}
                        />
                    </div>

                    <TradingInput
                        onusMode={true}
                        label=" "
                        value={_leverage}
                        suffix={'x'}
                        decimalScale={0}
                        containerClassName={`min-w-[200px] px-2.5 flex-grow text-sm font-medium border-none !bg-gray-12 dark:!bg-dark-2 h-[44px]`}
                        inputClassName="!text-center"
                        onValueChange={({ value }) => _setLeverage(value)}
                        validator={getValidator}
                        inputMode="decimal"
                        allowedDecimalSeparators={[',', '.']}
                        onFocus={scrollFocusInput}
                    />

                    <div className={`${changeClass} `}>
                        <Plus
                            size={20}
                            className={`text-txtPrimary dark:text-txtPrimary-dark w-5 cursor-pointer`}
                            onClick={() => _leverage < pairConfig?.leverageConfig?.max && _setLeverage((prevState) => Number(prevState) + 1)}
                        />
                    </div>
                </div>
                <div className={`mb-6`}>
                    <Slider
                        onusMode={true}
                        useLabel
                        positionLabel={'top'}
                        labelSuffix="x"
                        x={_leverage}
                        bgColorSlide={onusMode ? colors.teal : "#418FFF"}
                        bgColorActive={onusMode ? colors.teal : "#418FFF"}
                        BgColorLine={onusMode ? (isDark ? colors.dark[2] : colors.gray[12]) : ''}
                        axis="x"
                        xmax={pairConfig?.leverageConfig?.max}
                        onChange={({ x }) => (+x === 0 ? _setLeverage(1) : _setLeverage(x))}
                        dots={dots}
                    />
                    {/* useLabel axis='x' x={percent.sl} xmax={100}
                        labelSuffix='%'
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                        bgColorSlide={colors.onus.red}
                        bgColorActive={colors.onus.red}
                        xStart={50}
                        reload={tab}
                        onChange={({ x }) => onChangePercent(x, 100, 'sl')} /> */}
                </div>
                {!isVndcFutures && (
                    <>
                        <div className="mb-1 text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark select-none">
                            *{t('futures:calulator:max_position_leverage')}: {renderNotionalCap()}
                        </div>
                        <span className="block mb-1 font-medium text-xs text-dominant">{t('futures:leverage:check_leverage')}</span>
                        <span className="block mb-1 font-medium text-xs text-dominant">{t('futures:leverage:position_limit_enlarge')}</span>
                    </>
                )}
                <div className="mt-2.5 flex">
                    <div className="pt-1">
                        <WarningCircle size={16} fill={colors.yellow[2]} className="mt-[-2px]" />
                    </div>
                    <div className={`pl-2.5 font-medium text-xs text-yellow-2 `}>{t('futures:leverage:description')}</div>
                </div>
                {isAuth ? (
                    <div className="mt-8">{renderConfirmButton()}</div>
                ) : (
                    <div className={`mt-8 mb-2 cursor-pointer flex items-center justify-center `}>
                        <div className={`w-[200px] bg-bgBtnPrimary text-white text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80`} onClick={onLogin}>
                            {t('futures:mobile:login_short')}
                        </div>
                    </div>
                )}
            </Modal>
        ),
        [
            isVisible,
            onClose,
            containerStyle,
            changeClass,
            _leverage,
            getValidator,
            scrollFocusInput,
            pairConfig,
            dots,
            isVndcFutures,
            renderNotionalCap,
            isAuth,
            renderConfirmButton,
            onLogin,
            t
        ]
    );

    return onusMode ? (
        onusModal()
    ) : (
        <ModalV2
            isVisible={isVisible}
            wrapClassName="!p-6"
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] select-none ${className}`}
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </div>
                </div>
            )}
        >
            <div className={`mb-6 text-sm font-bold`}>
                <div className="text-2xl dark:text-txtPrimary-dark font-semibold">{t('futures:leverage:title')}</div>
            </div>

            <div className={`mb-1.5 font-medium text-txtSecondary dark:text-txtSecondary-dark text-sm`}>{t('futures:leverage:leverage')}</div>
            <div className={`px-0 flex items-center relative mb-3`}>
                <TradingInput
                    value={_leverage}
                    suffix={'x'}
                    decimalScale={0}
                    containerClassName="px-2.5 dark:!bg-dark-2 w-full"
                    inputClassName="!text-center !text-base"
                    onValueChange={({ value }) => _setLeverage(value)}
                    validator={getValidator}
                    textDescription={textDescription('leverage', { min: pairConfig?.leverageConfig?.min ?? 0, max: pairConfig?.leverageConfig?.max ?? 0 })}
                    errorTooltip={false}
                    inputMode="decimal"
                    allowedDecimalSeparators={[',', '.']}
                    clearAble
                    renderTail={
                        <Plus
                            size={17}
                            className={`text-txtSecondary dark:text-txtSecondary-dark cursor-pointer`}
                            onClick={() => _leverage < pairConfig?.leverageConfig?.max && _setLeverage((prevState) => Number(prevState) + 1)}
                        />
                    }
                    renderHead={
                        <Minus
                            size={17}
                            className={`text-txtSecondary dark:text-txtSecondary-dark cursor-pointer`}
                            onClick={() => _leverage > 1 && _setLeverage((prevState) => Number(prevState) - 1)}
                        />
                    }
                />
            </div>
            <div className="mb-6">
                <Slider
                    onusMode={false}
                    useLabel
                    positionLabel={'top'}
                    labelSuffix="x"
                    x={_leverage}
                    axis="x"
                    xmax={pairConfig?.leverageConfig?.max}
                    onChange={({ x }) => (+x === 0 ? _setLeverage(1) : _setLeverage(x))}
                    dots={dots}
                />
                {/* useLabel axis='x' x={percent.sl} xmax={100}
                        labelSuffix='%'
                        customDotAndLabel={(xmax, pos) => customDotAndLabel(xmax, pos, 'sl')}
                        bgColorSlide={colors.onus.red}
                        bgColorActive={colors.onus.red}
                        xStart={50}
                        reload={tab}
                        onChange={({ x }) => onChangePercent(x, 100, 'sl')} /> */}
            </div>
            {!isVndcFutures && (
                <>
                    <div className="mb-1 text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark select-none">
                        *{t('futures:calulator:max_position_leverage')}: {renderNotionalCap()}
                    </div>
                    <span className="block mb-1 font-medium text-xs text-dominant">{t('futures:leverage:check_leverage')}</span>
                    <span className="block mb-1 font-medium text-xs text-dominant">{t('futures:leverage:position_limit_enlarge')}</span>
                </>
            )}

            <div className="mt-2.5 flex bg-hover-1 dark:bg-darkBlue-3 px-6 py-4 rounded-md">
                <BxsInfoCircle size={24} fill={isDark ? colors.darkBlue5 : colors.gray[1]} fillInside={'currentColor'} />
                <div className={`pl-4 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark`}>{t('futures:leverage:description')}</div>
            </div>

            {isAuth ? (
                <div className={`mt-10 mb-2`}>{renderConfirmButton()}</div>
            ) : (
                <div className={`mt-10 h-full mb-2 cursor-pointer flex items-center justify-center w-full`}>
                    <a href={getLoginUrl('sso')} className="w-full">
                        <ButtonV2>{t('common:sign_in')}</ButtonV2>
                    </a>
                </div>
            )}
        </ModalV2>
    );
};

export default FuturesLeverageSettings;
