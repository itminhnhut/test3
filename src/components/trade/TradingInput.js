import { memo, useRef, useState } from 'react'
import classNames from 'classnames'
import NumberFormat from 'react-number-format'

const INITIAL_STATE = {
    isFocus: false,
}

const TradingInput = ({
    containerClassName,
    label,
    labelClassName,
    inputClassName,
    renderTail = null,
    tailContainerClassName,
    ...inputProps
}) => {
    // ? Input state management
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    // ? Helper
    const inputRef = useRef()

    const focusInput = () => inputRef?.current?.focus()
    const onFocus = () => setState({ isFocus: true })
    const onInputBlur = () => setState({ isFocus: false })

    return (
        <div
            className={classNames(
                'relative flex items-center px-[12px] py-2.5 rounded-md bg-gray-5 dark:bg-darkBlue-3 border border-transparent hover:border-dominant',
                { 'border-dominant': state.isFocus },
                containerClassName
            )}
        >
            {/* Label */}
            <div
                onClick={focusInput}
                className={classNames(
                    'text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-default whitespace-nowrap',
                    labelClassName
                )}
            >
                {label || 'Label?'}
            </div>

            {/* Input  */}
            <NumberFormat
                thousandSeparator
                getInputRef={(ref) => (inputRef.current = ref)}
                type='text'
                className={classNames(
                    'ml-2 flex-grow text-sm font-medium text-right',
                    { 'mr-2': !!renderTail },
                    inputClassName
                )}
                onFocus={onFocus}
                onBlur={onInputBlur}
                {...inputProps}
            />

            {/* Tail */}
            <div className={classNames('', tailContainerClassName)}>
                {renderTail && renderTail()}
            </div>
        </div>
    )
}

export default TradingInput
