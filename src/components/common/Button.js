import { memo, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

const Button = memo((props) => {
    // Own Props
    const { title, style, color, href, componentType = 'link', type, onClick, disabled, target = '' } = props

    // Initial State
    const [state, set] = useState({
        style: {}
    })
    const setState = (_state) => set(prevState => ({...prevState, ..._state}))

    const disabledStyle = useMemo(() => {
        if (type === 'disabled') return '!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3'
        return ''
    }, [type])

    if (componentType === 'link') {
        return (
            <Link href={href || '#'}>
                <a style={{...style, display: 'block', background: color}}
                   target={target}
                   className={`mal-button ${type === 'primary' ? 'bg-bgBtnPrimary text-txtBtnPrimary'
                       : 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'} ${disabledStyle}`}
                   onClick={() => onClick && !disabled && onClick()}>
                    {title || 'TITLE_NOT_FOUND'}
                </a>
            </Link>
        )
    }

    if (componentType === 'button') {
        return (
            <button style={{...style, background: color}}
                    className={`mal-button ${type === 'primary' ? 'bg-bgBtnPrimary text-txtBtnPrimary'
                        : 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'} ${disabledStyle}`}
                    onClick={() => onClick && !disabled && onClick()}>
                {title || 'TITLE_NOT_FOUND'}
            </button>
        )
    }

    return null
})

export default Button
