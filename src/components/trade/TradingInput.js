import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import ErrorTriggersIcon from 'components/svg/ErrorTriggers';
import { X } from 'react-feather';
import colors from 'styles/colors';
import { isFunction } from 'redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

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
    errorEmpty = false,
    onFocus,
    onBlur,
    clearAble = false,
    textDescription,
    descClassName = '',
    onValueChange,
    value,
    ...inputProps
}) => {
    const [currentTheme] = useDarkMode();
    const [isFocus, setIsFocus] = useState(false);
    const isDark = currentTheme === THEME_MODE.DARK;
    const inputRef = useRef();

    const focusInput = () => inputRef?.current?.focus();
    const _onFocus = () => {
        if (onFocus) onFocus();
        setIsFocus(true);
    };
    const _onBlur = () => {
        if (onBlur) onBlur();
        setIsFocus(false);
    };

    const onClear = () => {
        focusInput();
        setTimeout(() => {
            if (onValueChange) {
                onValueChange({
                    floatValue: '',
                    formattedValue: '',
                    value: ''
                });
            }
        }, 10);
    };

    const invalid = validator && Object.keys(validator)?.length && !validator?.isValid;
    const isError = errorEmpty ? !value || invalid : value > 0 && invalid;

    return (
        <div className="flex flex-col w-full relative">
            <div
                className={classNames(
                    `relative flex items-center px-[12px] py-2.5 rounded-md border border-transparent w-full ${
                        onusMode ? 'hover:border-teal bg-gray-12 dark:bg-dark-2' : 'bg-gray-10 dark:bg-darkBlue-3'
                    }`,
                    { '!border-teal': !onusMode && isFocus && !isError },
                    { 'border-green-2': onusMode && isFocus },
                    { '!border-red': !onusMode && isError },
                    { '!border-red-2': onusMode && isError },
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
                {isError && isFocus && errorTooltip ? (
                    <div
                        className={classNames('absolute right-0 -top-1 -translate-y-full z-50 flex flex-col items-center', {
                            '!left-1/2 !-translate-x-1/2 w-full min-w-[200px]': !onusMode
                        })}
                    >
                        {validator?.msg && (
                            <>
                                <div
                                    className={classNames('px-2 py-1.5 sm:px-6 sm:py-[10px] rounded-md  dark:bg-hover-dark text-xs sm:text-sm', {
                                        'bg-darkBlue text-white dark:text-gray-4': !onusMode,
                                        'bg-gray-15 dark:bg-dark-2 text-white dark:text-gray-4': onusMode
                                    })}
                                >
                                    {validator?.msg}
                                </div>
                                <div
                                    className={classNames('w-[8px] h-[6px] dark:bg-hover-dark', {
                                        'bg-darkBlue text-white dark:text-gray-4': !onusMode,
                                        'bg-gray-15 dark:bg-dark-2 text-white dark:text-gray-4': onusMode
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
                {renderHead && (
                    <div className={classNames('border-r pr-2 dark:border-divider-dark border-divider', headContainerClassName)}>
                        {renderHead && isFunction(renderHead) ? renderHead() : renderHead}
                    </div>
                )}
                {/* Input  */}
                {disabled ? (
                    <input
                        value={value}
                        disabled
                        className={classNames('ml-2 flex-grow text-right', { 'mr-2': !!renderTail, 'text-sm font-medium': onusMode }, inputClassName)}
                    />
                ) : (
                    <NumberFormat
                        thousandSeparator
                        getInputRef={(ref) => (inputRef.current = ref)}
                        type="text"
                        className={classNames('ml-2 flex-grow text-right', { 'mr-2': !!renderTail, 'text-sm font-medium': onusMode }, inputClassName)}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        autoComplete="off"
                        value={value}
                        onValueChange={onValueChange}
                        {...inputProps}
                    />
                )}
                {/* Tail */}
                {!!value && !disabled && clearAble && (
                    <div
                        className={classNames('relative z-10', {
                            'pr-2 mr-2 border-r border-divider dark:border-divider-dark': !!renderTail || isFunction(renderTail),
                            'pl-2': !renderTail
                        })}
                    >
                        <X onClick={onClear} size={16} className="cursor-pointer" color={isDark ? colors.darkBlue5 : colors.gray[1]} />
                    </div>
                )}
                <div className={classNames('', tailContainerClassName)}>{renderTail && isFunction(renderTail) ? renderTail() : renderTail}</div>
            </div>
            <div
                className={classNames(`text-xs text-red transition-all duration-200 max-h-[0px] overflow-hidden`, {
                    'max-h-[30px] mt-2': isFocus && isError && validator?.msg && !errorTooltip
                })}
            >
                <div className="flex items-center space-x-1 ">
                    <ErrorTriggersIcon />
                    <div dangerouslySetInnerHTML={{ __html: validator?.msg }} />
                </div>
            </div>
            <div
                className={classNames(
                    'text-xs text-txtSecondary dark:text-txtSecondary-dark transition-all duration-200 max-h-[0px] overflow-hidden',
                    { 'max-h-[30px] pt-2': isFocus && !isError && textDescription },
                    descClassName
                )}
            >
                {textDescription}
            </div>
        </div>
    );
};

export default TradingInput;
