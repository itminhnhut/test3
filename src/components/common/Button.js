import { memo, useCallback, useMemo } from 'react'

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
        target = ''
    } = props

    const disabledStyle = useMemo(() => {
        if (type === 'disabled')
            return '!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3'
        return ''
    }, [type])

    const render = useCallback(() => {
        if (componentType === 'link') {
            return (
                <a
                    href={href}
                    style={{ ...style, display: 'block', background: color }}
                    target={target}
                    className={`mal-button ${
                        type === 'primary'
                            ? 'bg-bgBtnPrimary text-txtBtnPrimary'
                            : 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'
                    } ${disabledStyle}`}
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
                            ? 'bg-bgBtnPrimary text-txtBtnPrimary'
                            : 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'
                    } ${disabledStyle}`}
                    onClick={() => onClick && !disabled && onClick()}
                >
                    {title || 'TITLE_NOT_FOUND'}
                </button>
            )
        }

        return null
    }, [href, title, componentType, type, onClick, disabled, color, style, target])

    return render()
})

export default Button
