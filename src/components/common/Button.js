import { memo, useEffect, useState } from 'react'
import Link from 'next/link'

const Button = memo((props) => {
    // Own Props
    const { title, style, color, href, componentType = 'link', type, onClick, disabled } = props

    // Initial State
    const [state, set] = useState({
        style: {}
    })
    const setState = (_state) => set(prevState => ({...prevState, ..._state}))

    if (componentType === 'link') {
        return (
            <Link href={href || '#'}>
                <a style={{...style, display: 'block', backgroundColor: color}}
                   className={`mal-button ${type === 'primary' ? 'bg-btnPrimary text-btnTxtPrimary'
                       : 'bg-btnSecondary text-btnTxtSecondary dark:bg-btnSecondary-dark dark:text-btnTxtSecondary-dark'}`}
                   onClick={() => onClick && !disabled && onClick()}>
                    {title || 'TITLE_NOT_FOUND'}
                </a>
            </Link>
        )
    }

    if (componentType === 'button') {
        return (
            <button style={{...style, backgroundColor: color}}
                    className={`mal-button ${type === 'primary' ? 'bg-btnPrimary text-btnTxtPrimary'
                        : 'bg-btnSecondary text-btnTxtSecondary dark:bg-btnSecondary-dark dark:text-btnTxtSecondary-dark'}`}
                    onClick={() => onClick && !disabled && onClick()}>
                {title || 'TITLE_NOT_FOUND'}
            </button>
        )
    }

    return null
})

export default Button
