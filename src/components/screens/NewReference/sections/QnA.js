import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import { Line } from '..'
import CollapsibleRefCard from '../CollapsibleRefCard'

const QnAData = [{
    q: {
        vi: '1. Chương trình giới thiệu là gì? Khi nào tôi nhận được hoa hồng thưởng?',
        en: ''
    },
    a: {
        vi: 'Với mỗi người dùng mới được giới thiệu thành công và sử dụng các sản phẩm của Nami, người giới thiệu sẽ nhận được phần thưởng từ phí giao dịch của các sản phẩm Futures, Spot, Swap và lãi Staking khi người được giới thiệu phát sinh giao dịch. Hoa hồng sẽ được cộng gộp mỗi giờ một lần và chuyển trực tiếp vào ví người dùng.',
        en: ''
    }
}, {
    q: {
        vi: '2. Liệu tôi có thể thay đổi / chỉnh sửa  mã giới thiệu không?',
        en: ''
    },
    a: {
        vi: 'Không, bạn không thể thay đổi, xóa mã giới thiệu hoặc đường dẫn giới thiệu sau khi đã thiết lập quan hệ giới thiệu. Thay vào đó, người dùng có thể tạo mới Mã giới thiệu với tuỳ chọn tỷ lệ phần thưởng nhận và chia sẻ. Mỗi người dùng được thiết lập tối đa 20 mã giới thiệu.',
        en: ''
    }
}, {
    q: {
        vi: '3. Tài sản thanh toán của hoa hồng giới thiệu là gì?',
        en: ''
    },
    a: {
        vi: `Người giới thiệu nhận phần thưởng dựa trên đơn vị tính phí của giao dịch phát sinh.
        Ví dụ: Người được giới thiệu dùng VNDC làm phí giao dịch Futures, với mỗi giao dịch phát sinh, người giới thiệu nhận được phần trăm hoa hồng tương ứng bằng VNDC.Trong trường hợp giao dịch mua spot, phí giao dịch sẽ được mặc định tính bằng tài sản mua về, người giới thiệu sẽ nhận được hoa hồng tương ứng bằng chính loại tài sản đó`,
        en: ''
    }
}, {
    q: {
        vi: '4. Tôi có thể chia sẻ hoa hồng cho bạn bè gắn mã giới thiệu của mình không?',
        en: 'Người được giới thiệu quên sử dụng mã/liên kết giới thiệu của tôi. Tôi vẫn được nhận thưởng chứ?'
    },
    a: {
        vi: 'Có, bạn có thể chia sẻ hoa hồng của mình cho bạn bè bằng cách thiết lập tỷ lệ chia sẻ khi tạo mã giới thiệu, bạn không thể thay đổi tỷ lệ này sau khi đã thiết lập mã giới thiệu, nhưng luôn có thể tạo các mã giới thiệu mới, tối đa lên tới 20 mã giới thiệu cùng lúc',
        en: ''
    }
}, {
    q: {
        vi: '5. Làm sao để đủ điều kiện nhận hoa hồng?',
        en: 'Người được giới thiệu quên sử dụng mã/liên kết giới thiệu của tôi. Tôi vẫn được nhận thưởng chứ?'
    },
    a: {
        vi: 'Chỉ cần bạn bè gắn mã giới thiệu của mình và sử dụng sản phẩm của Nami thì bạn đã có thể nhận hoa hồng từ phí giao dịch của bạn bè. Tuy nhiên, để nhận được tỷ lệ hoa hồng cao hơn, bạn cần đăng ký trở thành đối tác kinh doanh chính thức của Nami.',
        en: ''
    }
},]

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
                    {doShow ? <div className='text-gray-1 font-medium mt-1 text-justify' style={{ whiteSpace: "pre-line" }}>
                        {data.a[language]}
                    </div> : null}
                </div>
                {QnAData.length === index + 1 ? null : <Line className='my-4' />}
            </div>, [doShow])
        })
    }
    return (
        <div className='px-4 w-screen'  >
            <CollapsibleRefCard title={t('reference:referral.faq')}>
                <div className='w-auto'>
                    {renderData()}
                    <div className='text-teal underline font-medium text-sm text-center mt-6'>
                        <a href='#' target='_blank'>Xem thêm: Chính sách đối tác kinh doanh Nami Exchange</a>
                    </div>
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

export default QnA