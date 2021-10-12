import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const LANGUAGE_TAG = {
    VI: 'vi',
    EN: 'en'
}


const useLanguage = () => {
    const { locale: currentLocale, route, query, push } = useRouter()

    // Language toggle
    const onChangeLang = () => {
        const nextLang = currentLocale === LANGUAGE_TAG.VI ? LANGUAGE_TAG.EN : LANGUAGE_TAG.VI

        push(route, query, { locale: nextLang })
    }

    useEffect(() => {
        console.log('namidev-DEBUG: current Lang___ ', currentLocale)
    }, [currentLocale])

    return [currentLocale, onChangeLang]
}

export default useLanguage
