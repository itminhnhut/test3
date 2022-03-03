import { useRef } from 'react'
import ceil from 'lodash/ceil'
import {
    Active,
    Dot,
    DotContainer,
    SliderBackground,
    Thumb,
    ThumbLabel,
    Track,
} from './StyleInputSlider'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'

function getClientPosition(e) {
    const { touches } = e

    if (touches && touches.length) {
        const finger = touches[0]
        return {
            x: finger.clientX,
            y: finger.clientY,
        }
    }

    return {
        x: e.clientX,
        y: e.clientY,
    }
}

const Slider = ({
    disabled,
    axis,
    x,
    y,
    xmin,
    xmax,
    ymin,
    ymax,
    xstep,
    ystep,
    onChange,
    onDragStart,
    onDragEnd,
    xreverse,
    yreverse,
    styles: customStyles,
    ...props
}) => {
    const container = useRef(null)
    const handle = useRef(null)
    const start = useRef({})
    const offset = useRef({})
    const BIAS = 8

    const [currentTheme] = useDarkMode()

    function getPosition() {
        let top = ((y - ymin) / (ymax - ymin)) * 100
        let left = ((x - xmin) / (xmax - xmin)) * 100

        if (top > 100) top = 100
        if (top < 0) top = 0
        if (axis === 'x') top = 0

        if (left > 100) left = 100
        if (left < 0) left = 0
        if (axis === 'y') left = 0

        return { top, left }
    }

    function change({ top, left }) {
        if (!onChange) return

        const { width, height } = container.current.getBoundingClientRect()
        let dx = 0
        let dy = 0

        if (left < 0) left = 0
        if (left > width) left = width
        if (top < 0) top = 0
        if (top > height) top = height

        // Lam tron voi cac gia tri %25

        const largeStep = Math.round(left / (width / 4))
        const bias = Math.abs((width * largeStep) / 4 - left)

        if (axis === 'x' || axis === 'xy') {
            dx = (left / width) * (xmax - xmin)
        }

        if (axis === 'y' || axis === 'xy') {
            dy = (top / height) * (ymax - ymin)
        }

        let x = (dx !== 0 ? parseInt(dx / xstep, 10) * xstep : 0) + xmin
        const y = (dy !== 0 ? parseInt(dy / ystep, 10) * ystep : 0) + ymin

        if (bias < BIAS) {
            x = largeStep * 25
        }

        onChange({
            x: xreverse ? xmax - x + xmin : x,
            y: yreverse ? ymax - y + ymin : y,
        })
    }

    function handleMouseDown(e) {
        if (disabled) return

        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        const dom = handle.current
        const clientPos = getClientPosition(e)

        start.current = {
            x: dom.offsetLeft,
            y: dom.offsetTop,
        }

        offset.current = {
            x: clientPos.x,
            y: clientPos.y,
        }

        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
        document.addEventListener('touchmove', handleDrag, { passive: false })
        document.addEventListener('touchend', handleDragEnd)
        document.addEventListener('touchcancel', handleDragEnd)

        if (onDragStart) {
            onDragStart(e)
        }
    }

    function getPos(e) {
        const clientPos = getClientPosition(e)
        const left = clientPos.x + start.current.x - offset.current.x
        const top = clientPos.y + start.current.y - offset.current.y

        return { left, top }
    }

    function handleDrag(e) {
        if (disabled) return

        e.preventDefault()
        change(getPos(e))
    }

    function handleDragEnd(e) {
        if (disabled) return

        e.preventDefault()
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)

        document.removeEventListener('touchmove', handleDrag, {
            passive: false,
        })
        document.removeEventListener('touchend', handleDragEnd)
        document.removeEventListener('touchcancel', handleDragEnd)

        if (onDragEnd) {
            onDragEnd(e)
        }
    }

    function handleTrackMouseDown(e) {
        if (disabled) return

        e.preventDefault()
        const clientPos = getClientPosition(e)
        const rect = container.current.getBoundingClientRect()

        start.current = {
            x: clientPos.x - rect.left,
            y: clientPos.y - rect.top,
        }

        offset.current = {
            x: clientPos.x,
            y: clientPos.y,
        }

        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
        document.addEventListener('touchmove', handleDrag, { passive: false })
        document.addEventListener('touchend', handleDragEnd)
        document.addEventListener('touchcancel', handleDragEnd)

        change({
            left: clientPos.x - rect.left,
            top: clientPos.y - rect.top,
        })

        if (onDragStart) {
            onDragStart(e)
        }
    }

    const pos = getPosition()
    const valueStyle = {}
    if (axis === 'x') valueStyle.width = pos.left + '%'
    if (axis === 'y') valueStyle.height = pos.top + '%'
    if (xreverse) valueStyle.left = 100 - pos.left + '%'
    if (yreverse) valueStyle.top = 100 - pos.top + '%'

    const handleStyle = {
        borderRadius: '50%',
        zIndex: 20,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: xreverse ? 100 - pos.left + '%' : pos.left + '%',
        top: yreverse ? 100 - pos.top + '%' : pos.top + '%',
    }

    if (axis === 'x') {
        handleStyle.top = '50%'
    } else if (axis === 'y') {
        handleStyle.left = '50%'
    }

    return (
        <Track
            {...props}
            ref={container}
            onTouchStart={handleTrackMouseDown}
            onMouseDown={handleTrackMouseDown}
        >
            <Active style={valueStyle} />
            <SliderBackground isDark={currentTheme === THEME_MODE.DARK} />
            <DotContainer>
                <Dot
                    active={pos.left >= 0}
                    percentage={0}
                    isDark={currentTheme === THEME_MODE.DARK}
                    onClick={() => {
                        console.log('click', 0)
                    }}
                />
                {/* <Dash /> */}
                <Dot
                    active={pos.left >= 25}
                    isDark={currentTheme === THEME_MODE.DARK}
                    percentage={25}
                />
                {/* <Dash /> */}
                <Dot
                    active={pos.left >= 50}
                    isDark={currentTheme === THEME_MODE.DARK}
                    percentage={50}
                />
                {/* <Dash /> */}
                <Dot
                    active={pos.left >= 75}
                    isDark={currentTheme === THEME_MODE.DARK}
                    percentage={75}
                />
                {/* <Dash /> */}
                <Dot
                    active={pos.left >= 100}
                    isDark={currentTheme === THEME_MODE.DARK}
                    percentage={100}
                />
            </DotContainer>
            <div
                ref={handle}
                style={handleStyle}
                onTouchStart={handleMouseDown}
                onMouseDown={handleMouseDown}
                onClick={function (e) {
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                }}
            >
                <Thumb
                    isZero={pos.left === 0}
                    isDark={currentTheme === THEME_MODE.DARK}
                >
                    <ThumbLabel
                        isZero={pos.left === 0}
                        isDark={currentTheme === THEME_MODE.DARK}
                    >
                        {ceil(pos.left, 0)}%
                    </ThumbLabel>
                </Thumb>
            </div>
        </Track>
    )
}

Slider.defaultProps = {
    disabled: false,
    axis: 'x',
    x: 50,
    xmin: 0,
    xmax: 100,
    y: 50,
    ymin: 0,
    ymax: 100,
    xstep: 1,
    ystep: 1,
    xreverse: false,
    yreverse: false,
    styles: {},
}

export default Slider
