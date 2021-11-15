import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { LANGUAGE_TAG } from 'hooks/useLanguage'
import SvgLookup from 'components/svg/SvgLookup'

const Empty = ({ message, addClass }) => {
    const { i18n: { language } } = useTranslation()

    const _message = useMemo(() => {
        if (!message) {
            if (language === LANGUAGE_TAG.EN) {
                return 'No records to display'
            } else {
                return 'Không có dữ liệu'
            }
        }
        return message
    }, [message, language]);

    return (
        <div className={addClass ? 'relative w-full h-full ' + addClass : 'relative w-full h-full '}>
            <div className="flex flex-col items-center justify-center ">
                <SvgLookup size={120}/>
                <div className="mt-4 text-txtSecondary dark:text-txtSecondary-dark">{_message}</div>
            </div>
        </div>
    )
}

export default Empty
