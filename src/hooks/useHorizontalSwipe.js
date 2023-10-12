import { useEffect, useState } from 'react'

const useHorizontalSwipe = (ref) => {
    const [startPoint, setStartPoint] = useState(null)
    const [endPoint, setEndPoint] = useState(null)
    const [direction, setDirection] = useState(null)

    useEffect(() => {
        const handleTouchStart = function (e) {
            setStartPoint(e.touches[0])
            setEndPoint(null)
        }
        const handleTouchMove = function (e) {
            setEndPoint(e.touches[0])
        }

        const target = ref?.current
        if (!target) return
        target.addEventListener('touchstart', handleTouchStart)
        target.addEventListener('touchmove', handleTouchMove)

        return () => {
            target.removeEventListener('touchstart', handleTouchStart)
            target.removeEventListener('touchmove', handleTouchMove)
        }
    }, [ref])

    useEffect(() => {
        if (startPoint && endPoint) {
            const diffX = startPoint.clientX - endPoint.clientX
            const diffY = startPoint.clientY - endPoint.clientY

            let dir
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    dir = 'left'
                } else {
                    dir = 'right'
                }
            } else {
                if (diffY > 0) {
                    dir = 'top'
                } else {
                    dir = 'bottom'
                }
            }
            setDirection(dir)
        } else {
            setDirection(null)
        }
    }, [startPoint, endPoint])

    return direction
}

export default useHorizontalSwipe