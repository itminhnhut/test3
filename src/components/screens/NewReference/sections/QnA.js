import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import { Line } from '..'
import CollapsibleRefCard from '../CollapsibleRefCard'

const QnAData = [{
    q: {
        vi: 'Cơ chế chương trình giới thiệu Referral là bao lâu?',
        en: ''
    },
    a: {
        vi: 'Chương trình giới thiệu Referral của Nami bắt đầu lúc 10:00 ngày 17/06/2022 (giờ UTC) và là một sự kiện dài hạn. Người được bạn giới thiệu phải đăng ký và.',
        en: ''
    }
}, {
    q: {
        vi: 'Chương trình giới thiệu Referral là gì?',
        en: ''
    },
    a: {
        vi: 'Chương trình giới thiệu Referral của Nami bắt đầu lúc 10:00 ngày 17/06/2022 (giờ UTC) và là một sự kiện dài hạn. Người được bạn giới thiệu phải đăng ký và.',
        en: ''
    }
}, {
    q: {
        vi: 'Thế nào là người giới thiệu đủ điều kiện?',
        en: ''
    },
    a: {
        vi: 'Chương trình giới thiệu Referral của Nami bắt đầu lúc 10:00 ngày 17/06/2022 (giờ UTC) và là một sự kiện dài hạn. Người được bạn giới thiệu phải đăng ký và.',
        en: ''
    }
}, {
    q: {
        vi: 'Người được giới thiệu quên sử dụng mã/liên kết giới thiệu của tôi. Tôi vẫn được nhận thưởng chứ?',
        en: ''
    },
    a: {
        vi: 'Chương trình giới thiệu Referral của Nami bắt đầu lúc 10:00 ngày 17/06/2022 (giờ UTC) và là một sự kiện dài hạn. Người được bạn giới thiệu phải đăng ký và.',
        en: ''
    }
},]

const title = {
    en: 'Common questions',
    vi: 'Các câu hỏi thường gặp'
}
const QnA = () => {
    const { t, i18n: { language } } = useTranslation()
    const renderData = () => {
        return QnAData.map((data, index) => {
            const [doShow, setDoShow] = useState(false)
            return useMemo(() => <div key={index}>
                <div className='text-sm leading-6' >
                    <div className='text-darkBlue font-semibold cursor-pointer' onClick={() => setDoShow(!doShow)}>
                        {data.q[language]}
                    </div>
                    {doShow ? <div className='text-gray-1 font-medium mt-1'>
                        {data.a[language]}
                    </div> : null}
                </div>
                {QnAData.length === index + 1 ? null : <Line className='my-4' />}
            </div>, [doShow])
        })
    }
    return (
        <div className='px-4'>
            <CollapsibleRefCard title={title[language]} hide={true} >
                <div className='w-auto'>
                    {renderData()}
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

export default QnA