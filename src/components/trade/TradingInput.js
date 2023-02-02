import { useRef, useState } from 'react';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import ErrorTriggersIcon from 'components/svg/ErrorTriggers';

const INITIAL_STATE = {
    isFocus: false
};

const TradingInput = ({
    containerClassName,
    label,
    labelClassName,
    inputClassName,
    renderTail = null,
    tailContainerClassName,
    validator = {},
    onusMode = false,
    disabled = false,
    errorTooltip = true,
    onFocus,
    onBlur,
    ...inputProps
}) => {
    // ? Input state management
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // ? Helper
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
    const isError =
        (isNaN(inputProps?.value) ? inputProps?.value : inputProps?.value && inputProps?.value >= 0) && Object.keys(validator)?.length && !validator?.isValid
            ? true
            : false;

    return (
        <div className="flex flex-col w-full relative">
            <div
                className={classNames(
                    `relative flex items-center px-[12px] py-2.5 rounded-md  border border-transparent ${
                        onusMode ? 'hover:border-onus-green bg-onus-input' : 'hover:border-base bg-gray-5 dark:bg-darkBlue-3'
                    }`,
                    { 'border-dominant': !onusMode && state.isFocus },
                    { 'border-onus-green': onusMode && state.isFocus },
                    { '!border-red': !onusMode && isError },
                    { '!border-onus-red': onusMode && isError },
                    containerClassName
                )}
            >
                {/* Label */}
                <div
                    onClick={focusInput}
                    className={classNames('text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-default whitespace-nowrap', labelClassName)}
                >
                    {label || 'Label?'}
                </div>

                {isError && state?.isFocus && errorTooltip ? (
                    <div className="absolute right-0 -top-1 -translate-y-full z-50 flex flex-col items-center">
                        {validator?.msg && (
                            <>
                                <div className="px-2 py-1.5 sm:px-6 sm:py-[10px] rounded-md bg-gray-3 dark:bg-hover-dark text-xs sm:text-sm">
                                    {validator?.msg}
                                </div>
                                <div
                                    className="w-[8px] h-[6px] bg-gray-3 dark:bg-hover-dark"
                                    style={{
                                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                                    }}
                                />
                            </>
                        )}
                    </div>
                ) : null}

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
                        {...inputProps}
                    />
                )}
                {/* Tail */}
                <div className={classNames('', tailContainerClassName)}>{renderTail && renderTail()}</div>
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
