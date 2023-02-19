import { useRef, useState } from 'react';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import ErrorTriggersIcon from 'components/svg/ErrorTriggers';
import { X } from 'react-feather';
import colors from 'styles/colors';
import { isFunction } from 'redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const INITIAL_STATE = {
    isFocus: false
};

const TradingInput = ({
    containerClassName,
    label,
    labelClassName,
    inputClassName,
    renderTail = null,
    renderHead = null,
    tailContainerClassName,
    headContainerClassName,
    validator = {},
    onusMode = false,
    disabled = false,
    errorTooltip = true,
    onFocus,
    onBlur,
    clearAble = false,
    ...inputProps
}) => {
    const [currentTheme] = useDarkMode();
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const isDark = currentTheme === THEME_MODE.DARK;
    const inputRef = useRef();

    const focusInput = () => inputRef?.current?.focus();
    const _onFocus = () => {
        if (onFocus) onFocus();
        setState({ isFocus: true });
    };
    const _onBlur = () => {
        if (onBlur) onBlur();
        setState({ isFocus: false });
    };

    const onClear = () => {
        focusInput();
        setTimeout(() => {
            if (inputProps?.onValueChange) {
                inputProps?.onValueChange({
                    floatValue: '',
                    formattedValue: '',
                    value: ''
                });
            }
        }, 10);
    };

    const isError =
        (isNaN(inputProps?.value) ? inputProps?.value : inputProps?.value && inputProps?.value >= 0) && Object.keys(validator)?.length && !validator?.isValid
            ? true
            : false;

    return (
        <div className="flex flex-col w-full relative">
            <div
                className={classNames(
                    `relative flex items-center px-[12px] py-2.5 rounded-md  border border-transparent ${
                        onusMode ? 'hover:border-onus-green bg-onus-input' : 'bg-gray-10 dark:bg-darkBlue-3'
                    }`,
                    { '!border-dominant': !onusMode && state.isFocus && !isError },
                    { 'border-onus-green': onusMode && state.isFocus },
                    { '!border-red': !onusMode && isError },
                    { '!border-onus-red': onusMode && isError },
                    { 'h-11 sm:h-12': !onusMode },
                    containerClassName
                )}
            >
                {/* Label */}
                {label && (
                    <div
                        onClick={focusInput}
                        className={classNames(
                            'text-txtSecondary dark:text-txtSecondary-dark text-sm cursor-default whitespace-nowrap',
                            { 'font-medium !text-xs': onusMode },
                            labelClassName
                        )}
                    >
                        {label || 'Label?'}
                    </div>
                )}
                {isError && state?.isFocus && errorTooltip ? (
                    <div
                        className={classNames('absolute right-0 -top-1 -translate-y-full z-50 flex flex-col items-center', {
                            '!left-1/2 !-translate-x-1/2 w-full': !onusMode
                        })}
                    >
                        {validator?.msg && (
                            <>
                                <div
                                    className={classNames('px-2 py-1.5 sm:px-6 sm:py-[10px] rounded-md  dark:bg-hover-dark text-xs sm:text-sm', {
                                        'bg-darkBlue text-white dark:text-gray-4': !onusMode,
                                        'bg-gray-3': onusMode
                                    })}
                                >
                                    {validator?.msg}
                                </div>
                                <div
                                    className={classNames('w-[8px] h-[6px] dark:bg-hover-dark', {
                                        'bg-darkBlue text-white dark:text-gray-4': !onusMode,
                                        'bg-gray-3': onusMode
                                    })}
                                    style={{
                                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                                    }}
                                />
                            </>
                        )}
                    </div>
                ) : null}
                {/* head  */}
                <div className={classNames('border-r pr-2 dark:border-divider-dark border-divider', headContainerClassName)}>
                    {renderHead && isFunction(renderHead) ? renderHead() : renderHead}
                </div>

                {/* Input  */}
                {disabled ? (
                    <input
                        value={inputProps?.value}
                        disabled
                        className={classNames('ml-2 flex-grow text-sm font-medium text-right', { 'mr-2': !!renderTail }, inputClassName)}
                    />
                ) : (
                    <NumberFormat
                        thousandSeparator
                        getInputRef={(ref) => (inputRef.current = ref)}
                        type="text"
                        className={classNames('ml-2 flex-grow text-sm font-medium text-right', { 'mr-2': !!renderTail }, inputClassName)}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        autoComplete="off"
                        {...inputProps}
                    />
                )}
                {/* Tail */}
                {!!inputProps?.value && !disabled && clearAble && (
                    <div
                        className={classNames('relative z-10', {
                            'pr-2 mr-2 border-r border-divider dark:border-divider-dark': !!renderTail,
                            'pl-2': !renderTail
                        })}
                    >
                        <X onClick={onClear} size={16} className="cursor-pointer" color={isDark ? colors.darkBlue5 : colors.gray[1]} />
                    </div>
                )}
                <div className={classNames('', tailContainerClassName)}>{renderTail && isFunction(renderTail) ? renderTail() : renderTail}</div>
            </div>
            {isError && validator?.msg && !errorTooltip && (
                <div className={`text-xs mt-3 text-red`}>
                    <div className="flex items-center space-x-1">
                        <ErrorTriggersIcon />
                        <div dangerouslySetInnerHTML={{ __html: validator?.msg }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradingInput;
