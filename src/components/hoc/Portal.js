import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const Portal = ({ portalId, children }) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])
    return mounted ? createPortal(children, document.querySelector(`#${portalId}`)) : null
}

export default Portal
