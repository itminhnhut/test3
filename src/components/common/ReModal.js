import { useEffect, useMemo } from 'react'
import { log } from 'utils'


const ReModal = (
    {
        children,
        isVisible,
        useOverlay = false,
        onBackdropCb,
        style = {},
        className = '',
        position = REMODAL_POSITION.BOTTOM,
        debug = false,
    }
) => {

    // Re-MODAL

    const memmoizedStyles = useMemo(() => {
        let _className = DEFAULT_CLASS
        let _active

        switch (position) {
            case REMODAL_POSITION.TOP:
                _className += 'left-0 top-0 -translate-y-full rounded-br-[16px] rounded-bl-[16px]'
                _active = '!translate-y-0'
                break
            case REMODAL_POSITION.LEFT:
                _className += 'right-0 top-0 w-[80%] h-full translate-x-full rounded-tl-[16px] rounded-bl-[16px]'
                _active = '!translate-x-0'
                break
            case REMODAL_POSITION.RIGHT:
                _className += 'left-0 top-0 w-[80%] h-full -translate-x-full rounded-tr-[16px] rounded-br-[16px]'
                _active = '!translate-x-0'
                break
            case REMODAL_POSITION.BOTTOM:
                _className += 'left-0 bottom-0 translate-y-full rounded-tr-[16px] rounded-tl-[16px]'
                _active = '!translate-y-0'
                break
            case REMODAL_POSITION.CENTER:
                _className += '!transition-none left-1/2 top-1/2 w-[85%] rounded-xl -translate-x-1/2 -translate-y-1/2 invisible'
                _active = '!visible'
                break
        }

        if (position?.mode === REMODAL_POSITION.FULLSCREEN.MODE) {
            if (position?.from === REMODAL_POSITION.FULLSCREEN.FROM.LEFT) {
                _className += 'left-0 top-0 w-screen h-screen -translate-x-full'
                _active = '!translate-x-0'
            }

            if (position?.from === REMODAL_POSITION.FULLSCREEN.FROM.RIGHT) {
                _className += 'right-0 top-0 w-screen h-screen translate-x-full'
                _active = '!translate-x-0'
            }
        }

        return {
            className: _className + ` ${className}`,
            active: _active
        }
    }, [className, position])

    useEffect(() => {
        debug && log.d('[ReModal] isVisible => ', isVisible)
    }, [isVisible, debug])

    return (
        <>
            {useOverlay && position !== REMODAL_POSITION.FULLSCREEN.MODE &&
            <div className={`mal-overlay ${isVisible ? 'mal-overlay__active' : ''}`}
                 onClick={() => {
                     debug && log.d('[ReModal] onBackdropCb triggered!')
                     onBackdropCb && onBackdropCb()
                 }}/>}

            <div style={style || {}} className={isVisible ? `${memmoizedStyles.className} ${memmoizedStyles.active}` :  memmoizedStyles?.className}>
                {isVisible && children}
            </div>
        </>
    )
}

const DEFAULT_CLASS = 'p-4 fixed z-[9999999999] min-w-[282px] w-full bg-bgContainer dark:bg-darkBlue-2 transition-all duration-200 ease-in-out '

export const REMODAL_POSITION = {
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    CENTER: 'center',
    FULLSCREEN: {
        MODE: 'full-screen',
        FROM: {
            LEFT: 'left',
            RIGHT: 'right'
        }
    }
}

export default ReModal
