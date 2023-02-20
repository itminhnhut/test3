import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import { Minus, Plus, X } from 'react-feather';
import { ScaleLoader } from 'react-spinners';
import SvgWarning from 'components/svg/SvgWarning';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Slider from 'components/trade/InputSlider';
import colors from 'styles/colors';
import axios from 'axios';
import { formatNumber, scrollFocusInput, emitWebViewEvent } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TradingInput from 'components/trade/TradingInput';
import WarningCircle from '../../svg/WarningCircle';
import ModalV2 from 'components/common/V2/ModalV2';
import InputV2 from 'components/common/V2/InputV2';

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
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [_leverage, _setLeverage] = useState(leverage);
    const [_leverageBracket, _setLeverageBracket] = useState(pairConfig?.leverageBracket?.[0]);

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
            msg = `Minimum Qty is ${min}`;
            isValid = false;
        }
        if (max < _leverage) {
            msg = `Maximum Qty is ${max}`;
            isValid = false;
        }
        return { isValid, msg, isError: !isValid };
    }, [_leverage]);

    const renderConfirmButton = useCallback(
        () => (
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
        onusMode ? 'hover:bg-onus-bg2 dark:hover:bg-onus-bg2' : 'hover:bg-bgHover dark:hover:bg-bgHover-dark'
    }`;

    return (
        // <Modal
        //     onusMode={onusMode}
        //     isVisible={isVisible}
        //     onBackdropCb={onClose}
        //     containerClassName={`w-[90%] max-w-[488px] dark:bg-bgPrimary-dark p-6 dark:border-divider-dark select-none ${className}`}
        //     containerStyle={{ ...containerStyle }}
        // >
        <ModalV2
            isVisible={isVisible}
            wrapClassName="!p-6"
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] select-none ${className}`}
            customHeader={() =>
                !onusMode && (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={onClose}
                        >
                            <X size={24} />
                        </div>
                    </div>
                )
            }
        >
            <div className={` ${onusMode ? 'mb-6 text-lg' : 'mb-6 text-sm'} font-bold`}>
                <div className="text-[22px] dark:text-txtPrimary-dark font-semibold">{t('futures:leverage:title')}</div>
            </div>

            <div className={`mb-1.5 font-medium text-txtSecondary dark:text-txtSecondary-dark ${onusMode ? 'uppercase text-xs' : 'text-sm'}`}>
                {t('futures:leverage:leverage')}
            </div>
            <div
                className={`px-2 flex items-center relative ${
                    onusMode ? 'bg-onus-bg2 dark:bg-onus-bg2 mb-6 h-[44px]' : 'bg-gray-10 dark:bg-dark-2 mb-4 h-[48px] px-0 '
                } rounded-[4px]`}
            >
                {/* <div className={`${changeClass} absolute left-2`}>
                    <Minus
                        size={onusMode ? 20 : 17}
                        className={`${onusMode ? 'text-onus-white w-5' : 'text-txtSecondary dark:text-txtSecondary-dark'} cursor-pointer`}
                        onClick={() => _leverage > 1 && _setLeverage((prevState) => Number(prevState) - 1)}
                    />
                </div> */}

                <TradingInput
                    onusMode={onusMode}
                    label=" "
                    value={_leverage}
                    suffix={'x'}
                    decimalScale={0}
                    containerClassName={`min-w-[200px] px-2.5 flex-grow text-sm font-medium  ${
                        onusMode ? '!bg-onus-bg2 h-[44px]' : '!bg-transparent h-[48px] w-full'
                    }`}
                    inputClassName="!text-center !text-base"
                    onValueChange={({ value }) => _setLeverage(value)}
                    validator={getValidator}
                    inputMode="decimal"
                    allowedDecimalSeparators={[',', '.']}
                    onFocus={onusMode && scrollFocusInput}
                    clearAble
                    renderTail={
                        <Plus
                            size={onusMode ? 20 : 17}
                            className={`${onusMode ? 'text-onus-white w-5' : 'text-txtSecondary dark:text-txtSecondary-dark'} cursor-pointer`}
                            onClick={() => _leverage < pairConfig?.leverageConfig?.max && _setLeverage((prevState) => Number(prevState) + 1)}
                        />
                    }
                    renderHead={
                        <Minus
                            size={onusMode ? 20 : 17}
                            className={`${onusMode ? 'text-onus-white w-5' : 'text-txtSecondary dark:text-txtSecondary-dark'} cursor-pointer`}
                            onClick={() => _leverage > 1 && _setLeverage((prevState) => Number(prevState) - 1)}
                        />
                    }
                />
                {/* <div className={`${changeClass} absolute right-2`}>
                    <Plus
                        size={onusMode ? 20 : 17}
                        className={`${onusMode ? 'text-onus-white w-5' : 'text-txtSecondary dark:text-txtSecondary-dark'} cursor-pointer`}
                        onClick={() => _leverage < pairConfig?.leverageConfig?.max && _setLeverage((prevState) => Number(prevState) + 1)}
                    />
                </div> */}
            </div>
            <div className={`${onusMode ? 'mb-6' : 'mb-6'}`}>
                <Slider
                    onusMode={onusMode}
                    useLabel
                    positionLabel={onusMode ? 'top' : 'top'}
                    labelSuffix="x"
                    x={_leverage}
                    bgColorSlide={onusMode ? '#418FFF' : undefined}
                    bgColorActive={onusMode ? '#418FFF' : undefined}
                    // BgColorLine={onusMode ? colors.onus.bg2 : ''}
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
                </>
            )}
            {/* {isAuth && ( */}
            <>
                {!isVndcFutures && <span className="block mb-1 font-medium text-xs text-dominant">{t('futures:leverage:position_limit_enlarge')}</span>}
                <div className="mt-2.5 flex items-center bg-hover-1 dark:bg-darkBlue-3 px-6 py-4 rounded-md">
                    <div className="pt-1">
                        {onusMode ? (
                            <WarningCircle size={16} fill={colors.onus.orange} className="mt-[-2px]" />
                        ) : (
                            <SvgWarning size={24} fill={colors.darkBlue5} fillInside={'currentColor'} />
                        )}
                    </div>
                    <div className={`pl-4 font-medium text-sm ${onusMode ? 'text-onus-orange' : 'text-txtSecondary'} `}>
                        {t('futures:leverage:description')}
                    </div>
                </div>
            </>
            {/* // )} */}
            {isAuth ? (
                <div className={`${onusMode ? 'mt-8' : 'mt-10 mb-2'}`}>{renderConfirmButton()}</div>
            ) : (
                <div className={`${onusMode ? 'mt-8' : 'mt-10 h-full'} mb-2 cursor-pointer flex items-center justify-center `}>
                    <div
                        className={`w-[200px] ${
                            onusMode ? 'bg-onus-base' : 'bg-dominant font-medium !w-full'
                        } text-white text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80`}
                        onClick={onLogin}
                    >
                        {onusMode ? t('futures:mobile:login_short') : t('futures:order_table:login_to_continue')}
                    </div>
                </div>
            )}
        </ModalV2>

        // </Modal>
    );
};

export default FuturesLeverageSettings;
