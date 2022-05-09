import { useEffect, useMemo, useRef, useState } from 'react';
import ceil from 'lodash/ceil';
import { Active, Dot, DotContainer, SliderBackground, Thumb, ThumbLabel, Track, } from './StyleInputSlider';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import classNames from 'classnames';

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
    leverage = false,
    useLabel = false,
    labelSuffix = '',
    customDotAndLabel,
    bgColorSlide,
    bgColorActive,
    xStart = 0,
    reload,
    ...props
}) => {
    const container = useRef(null)
    const handle = useRef(null)
    const start = useRef({})
    const offset = useRef({})
    const BIAS = 8
    const _xStart = useRef(xStart);

    const [currentTheme] = useDarkMode()

    function getPosition() {
        let top = ((y - ymin) / (ymax - ymin)) * 100
        let left = ((x - xmin) / (xmax - xmin)) * 100 + _xStart.current;
        _xStart.current = 0;
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

        if (leverage && bias < BIAS) {
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

    const [flag, setFlag] = useState(false);

    useEffect(() => {
        _xStart.current = xStart;
        setFlag(!flag)
    }, [reload])

    const pos = useMemo(() => {
        return getPosition()
    }, [x, flag])

    const valueStyle = {}
    if (axis === 'x') {
        if (customDotAndLabel) {
            if (pos.left < 50) {
                valueStyle.width = 50 - pos.left + '%';
                valueStyle.right = 50 + '%';
            } else {
                valueStyle.width = pos.left - 50 + '%';
                valueStyle.left = 50 + '%';
            }
        } else {
            valueStyle.width = pos.left + '%';
        }
    }
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

    const renderDotAndLabel = () => {
        let dotStep = 15
        const dot = []
        const label = []

        if (xmax % 5 === 0) dotStep = 5
        if (xmax > 10 && xmax % 10 === 0) dotStep = 10
        if (xmax > 15 && xmax % 15 === 0) dotStep = 15
        if (xmax > 25 && xmax % 25 === 0) dotStep = 25

        const size = 100 / (xmax / dotStep)

        for (let i = 0; i <= xmax / dotStep; ++i) {
            dot.push(
                <Dot
                    key={`inputSlider_dot_${i}`}
                    active={pos.left >= i * size}
                    percentage={i * size}
                    isDark={currentTheme === THEME_MODE.DARK}
                />
            )
            label.push(
                <div className='relative' key={`inputSlider_label_${i}`}>
                    <span
                        onClick={() => {
                            onChange && onChange({ x: i * dotStep })
                        }}
                        className={classNames(
                            'block absolute font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark select-none cursor-pointer',
                            {
                                'left-1/2 -translate-x-1/2':
                                    i > 0 && i !== xmax / dotStep,
                                '-left-1/2 translate-x-[-80%]':
                                    i === xmax / dotStep,
                            }
                        )}
                    >
                        {i === 0 ? 1 : i * dotStep}
                        {labelSuffix}
                    </span>
                </div>
            )
        }

        return { dot, label }
    }

    return (
        <>
            <Track
                {...props}
                ref={container}
                onTouchStart={handleTrackMouseDown}
                onMouseDown={handleTrackMouseDown}
            >
                <Active style={valueStyle} bgColorSlide={bgColorSlide} />
                <SliderBackground isDark={currentTheme === THEME_MODE.DARK} />
                <DotContainer>
                    <Dot
                        active={pos.left >= 0}
                        percentage={0}
                        isDark={currentTheme === THEME_MODE.DARK}
                        bgColorActive={bgColorActive}
                    />
                    {customDotAndLabel ? customDotAndLabel(xmax, pos)?.dot : renderDotAndLabel()?.dot}
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
                        bgColorActive={bgColorActive}
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
            {useLabel && (
                <>
                    <div className='relative w-full flex items-center justify-between'>
                        {customDotAndLabel ? customDotAndLabel(xmax, pos)?.label : renderDotAndLabel()?.label}
                    </div>
                    <div className='h-[12px] w-full' />
                </>
            )}
        </>
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
