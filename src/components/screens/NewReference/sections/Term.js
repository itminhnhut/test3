import { useTranslation } from 'next-i18next'
import React from 'react'
import { Line } from '..'
import CollapsibleRefCard from '../CollapsibleRefCard'

const title = {
    en: 'Term and Policy',
    vi: 'Điều khoản và điều kiện'
}

const Term = () => {
    const { t, i18n: { language } } = useTranslation()
    const renderData = () => {
        return (
            <div className='font-medium text-sm text-darkBlue text-justify'>
                1. Với mỗi lượt giới thiệu đủ điều kiện, bạn và người được giới thiệu sẽ nhận được bonus $20 bằng USDT. Lưu ý, không giới hạn số lượng bạn bè giới thiệu.
                <Line className='my-4' />
                2. Với mỗi lượt giới thiệu đủ điều kiện, bạn và người được giới thiệu sẽ nhận được bonus $20 bằng USDT. Lưu ý, không giới hạn số lượng bạn bè giới thiệu.
                <Line className='my-4' />
                3. Với mỗi lượt giới thiệu đủ điều kiện, bạn và người được giới thiệu sẽ nhận được bonus $20 bằng USDT. Lưu ý, không giới hạn số lượng bạn bè giới thiệu.
            </div>
        )
    }

    return (
        <div className='px-4'>
            <CollapsibleRefCard title={title[language]} hide={true}>
                <div className='w-auto'>
                    {renderData()}
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

export default Term