import { useState, useEffect } from 'react'

const useApp = () => {
    const [isApp, setApp] = useState(false)

    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        search.get('source') === 'app' && setApp(true)
    }, [])

    return isApp
}

export default useApp
