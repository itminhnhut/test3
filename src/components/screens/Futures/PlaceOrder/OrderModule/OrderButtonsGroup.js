import { useTranslation } from 'next-i18next'

const FuturesOrderButtonsGroup = () => {
    const { t } = useTranslation()

    return (
        <div className='flex items-center justify-between font-bold text-sm text-white select-none'>
            <div className='w-[48%] bg-dominant text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                {t('common:buy')}/Long
            </div>
            <div className='w-[48%] bg-red text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                {t('common:sell')}/Short
            </div>
        </div>
    )
}

export default FuturesOrderButtonsGroup
