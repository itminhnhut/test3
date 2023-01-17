import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { Line } from '..';
import CollapsibleRefCard from '../../CollapsibleRefCard';

const QnAData = [
    {
        q: {
            vi: '1. Chương trình giới thiệu là gì? Khi nào tôi nhận được hoa hồng thưởng?',
            en: '1. What is the referral program? When do I receive the reward of commission?'
        },
        a: {
            vi: 'Với mỗi người dùng mới được giới thiệu thành công và sử dụng các sản phẩm của Nami, người giới thiệu sẽ nhận được phần thưởng từ phí giao dịch của các sản phẩm Futures, Spot, Swap và lãi Staking khi người được giới thiệu phát sinh giao dịch. Hoa hồng sẽ được cộng gộp mỗi giờ một lần và chuyển trực tiếp vào ví người dùng.',
            en: "For each new user successfully referred and using Nami products, the referrer will get a reward from the transaction fees of Futures, Spot, and Swap products, as well as Staking interest when the new user conducts a transaction. Once each hour, the commission will be calculated and deposited directly to the user's wallet."
        }
    },
    {
        q: {
            vi: '2. Liệu tôi có thể thay đổi / chỉnh sửa  mã giới thiệu không?',
            en: '2. Can I alter the referral code?'
        },
        a: {
            vi: 'Không, bạn không thể thay đổi, xóa mã giới thiệu hoặc đường dẫn giới thiệu sau khi đã thiết lập quan hệ giới thiệu. Thay vào đó, người dùng có thể tạo mới Mã giới thiệu với tuỳ chọn tỷ lệ phần thưởng nhận và chia sẻ. Mỗi người dùng được thiết lập tối đa 20 mã giới thiệu.',
            en: 'Once a referral has been established, it is not possible to modify or delete a referral code or referral link.'
        }
    },
    {
        q: {
            vi: '3. Tài sản thanh toán của hoa hồng giới thiệu là gì?',
            en: '3. What is the unit of the payment for the referral commission?'
        },
        a: {
            vi: `Người giới thiệu nhận phần thưởng dựa trên đơn vị tính phí của giao dịch phát sinh.
        Ví dụ: Người được giới thiệu dùng VNDC làm phí giao dịch Futures, với mỗi giao dịch phát sinh, người giới thiệu nhận được phần trăm hoa hồng tương ứng bằng VNDC.Trong trường hợp giao dịch mua spot, phí giao dịch sẽ được mặc định tính bằng tài sản mua về, người giới thiệu sẽ nhận được hoa hồng tương ứng bằng chính loại tài sản đó`,
            en: `The referrer gets a reward based on the fee unit of the transaction.
        Referrer uses VNDC as a Futures transaction fee. For each transaction, the referrer gets a commission in VNDC based on the percentage of the transaction fee. When a Exchange purchase is made, the transaction fee will be added to the asset that was bought, and the referrer will get a commission in the same asset.`
        }
    },
    {
        q: {
            vi: '4. Tôi có thể chia sẻ hoa hồng cho bạn bè gắn mã giới thiệu của mình không?',
            en: '4. Can I share the commission with my friends who use my referral code?'
        },
        a: {
            vi: 'Có, bạn có thể chia sẻ hoa hồng của mình cho bạn bè bằng cách thiết lập tỷ lệ chia sẻ khi tạo mã giới thiệu, bạn không thể thay đổi tỷ lệ này sau khi đã thiết lập mã giới thiệu, nhưng luôn có thể tạo các mã giới thiệu mới, tối đa lên tới 20 mã giới thiệu cùng lúc',
            en: `Yes, you can share your commission with your friends by setting up the share rate when you create the referral code. You can't change this rate once you've set up the referral code, but you can always create new referral codes up to 20 at a time`
        }
    },
    {
        q: {
            vi: '5. Làm sao để đủ điều kiện nhận hoa hồng?',
            en: '5. What do I need to do to get a commission?'
        },
        a: {
            vi: 'Chỉ cần bạn bè gắn mã giới thiệu của mình và sử dụng sản phẩm của Nami thì bạn đã có thể nhận hoa hồng từ phí giao dịch của bạn bè. Tuy nhiên, để nhận được tỷ lệ hoa hồng cao hơn, bạn cần đăng ký trở thành đối tác kinh doanh chính thức của Nami.',
            en: `As long as your friends use Nami's products and include their referral code, you can obtain commissions from their transaction fees. But if you want a higher commission rate, you need to sign up as an official Nami business partner.`
        }
    }
];

const QnA = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const renderData = () => {
        return QnAData.map((data, index) => {
            const [doShow, setDoShow] = useState(false);
            return useMemo(
                () => (
                    <div key={index}>
                        <div className="text-sm leading-6">
                            <div className="text-gray-6 font-semibold cursor-pointer" onClick={() => setDoShow(!doShow)}>
                                {data.q[language]}
                            </div>
                            {doShow ? (
                                <div className="text-gray-7 font-medium mt-1 text-justify" style={{ whiteSpace: 'pre-line' }}>
                                    {data.a[language]}
                                </div>
                            ) : null}
                        </div>
                        {QnAData.length === index + 1 ? null : <Line className="my-4" />}
                    </div>
                ),
                [doShow]
            );
        });
    };

    const policyLink =
        language === 'vi'
            ? 'https://nami.exchange/vi/support/announcement/tin-tuc-ve-nami/ra-mat-chuong-trinh-doi-tac-phat-trien-cong-dong-nami'
            : 'https://nami.exchange/support/announcement/nami-news/official-launching-of-nami-community-development-partnership-program';
    return (
        <div className="px-4 w-screen">
            <CollapsibleRefCard title={t('reference:referral.faq')} isBlack>
                <div className="w-auto">
                    {renderData()}
                    <div className="text-namiapp-green-1 underline font-medium text-sm text-center mt-6">
                        <a href={policyLink} target="_blank">
                            {language === 'vi'
                                ? 'Xem thêm: Chính sách đối tác kinh doanh Nami Exchange'
                                : "Read more: Nami Exchange's policy on business partners"}
                        </a>
                    </div>
                </div>
            </CollapsibleRefCard>
        </div>
    );
};

export default QnA;
