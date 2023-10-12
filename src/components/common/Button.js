import { memo, useCallback, useMemo } from 'react';

const Button = memo((props) => {
    // Own Props
    const {
        title,
        style,
        color,
        href = '/',
        componentType = 'link',
        type,
        onClick,
        disabled,
        className = '',
        target = '',
        onusMode = false,
    } = props

    const disabledStyle = useMemo(() => {
        if ((type === 'disabled' || disabled) && !onusMode)
            return '!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3'
        return ''
    }, [type, disabled])

    const render = useCallback(() => {
        if (componentType === 'link') {
            return (
                <a
                    href={href}
                    style={{ ...style, display: 'block', background: color }}
                    target={target}
                    className={`mal-button ${
                        type === 'primary'
                            ? `${onusMode ? 'bg-bgBtnPrimary text-txtBtnPrimary active:bg-bgBtnV2-pressed': 'bg-bgBtnPrimary text-txtBtnPrimary'}`
                            : `${onusMode ? 'bg-gray-12 dark:bg-dark-2 text-gray-15 dark:text-gray-7': 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'}`
                    } ${disabledStyle} ${className}`}
                >
                    {title || 'TITLE_NOT_FOUND'}
                </a>
            )
        }

        if (componentType === 'button') {
            return (
                <button
                    style={{ ...style, background: color }}
                    className={`mal-button ${
                        type === 'primary'
                            ? `${onusMode ? 'bg-bgBtnPrimary text-txtBtnPrimary active:bg-bgBtnV2-pressed': 'bg-bgBtnPrimary text-txtBtnPrimary'}`
                            : `${onusMode ? 'bg-gray-12 dark:bg-dark-2 text-gray-15 dark:text-gray-7': 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'}`
                    } ${disabledStyle} ${className}
                    ${disabled && onusMode ? '!bg-gray-12 dark:!bg-dark-2 !text-txtDisabled dark:!text-txtDisabled-dark' : ''}
                    `}
                    onClick={() => onClick && !disabled && onClick()}
                >
                    {title || 'TITLE_NOT_FOUND'}
                </button>
            )
        }

        return null
    }, [href, title, componentType, type, onClick, disabled, color, style, target, className])

    return render()
})

export default Button
