import React from 'react';
import RefCard from 'components/screens/NewReference/RefCard';

import classNames from 'classnames';

const title = {
    en: 'FAQ',
    vi: 'Câu hỏi thường gặp'
};

const Terms = {
    en: 'Terms and condition',
    vi: 'Điều khoản và điều kiện'
};

const QnAData = [
    {
        q: {
            vi: 'Chương trình giới thiệu là gì? Khi nào tôi nhận được hoa hồng thưởng?',
            en: 'What is the referral program? When do I receive the reward of commission?'
        },
        a: {
            vi: 'Với mỗi người dùng mới được giới thiệu thành công và sử dụng các sản phẩm của Nami, người giới thiệu sẽ nhận được phần thưởng từ phí giao dịch của các sản phẩm Futures, Spot, Swap và lãi Staking khi người được giới thiệu phát sinh giao dịch. Hoa hồng sẽ được cộng gộp mỗi giờ một lần và chuyển trực tiếp vào ví người dùng.',
            en: "For each new user successfully referred and using Nami products, the referrer will get a reward from the transaction fees of Futures, Spot, and Swap products, as well as Staking interest when the new user conducts a transaction. Once each hour, the commission will be calculated and deposited directly to the user's wallet."
        }
    },
    {
        q: {
            vi: 'Liệu tôi có thể thay đổi / chỉnh sửa  mã giới thiệu không?',
            en: 'Can I alter the referral code?'
        },
        a: {
            vi: 'Không, bạn không thể thay đổi, xóa mã giới thiệu hoặc đường dẫn giới thiệu sau khi đã thiết lập quan hệ giới thiệu. Thay vào đó, người dùng có thể tạo mới Mã giới thiệu với tuỳ chọn tỷ lệ phần thưởng nhận và chia sẻ. Mỗi người dùng được thiết lập tối đa 20 mã giới thiệu.',
            en: 'Once a referral has been established, it is not possible to modify or delete a referral code or referral link.'
        }
    },
    {
        q: {
            vi: 'Tài sản thanh toán của hoa hồng giới thiệu là gì?',
            en: 'What is the unit of the payment for the referral commission?'
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
            vi: 'Tôi có thể chia sẻ hoa hồng cho bạn bè gắn mã giới thiệu của mình không?',
            en: 'Can I share the commission with my friends who use my referral code?'
        },
        a: {
            vi: 'Có, bạn có thể chia sẻ hoa hồng của mình cho bạn bè bằng cách thiết lập tỷ lệ chia sẻ khi tạo mã giới thiệu, bạn không thể thay đổi tỷ lệ này sau khi đã thiết lập mã giới thiệu, nhưng luôn có thể tạo các mã giới thiệu mới, tối đa lên tới 20 mã giới thiệu cùng lúc',
            en: `Yes, you can share your commission with your friends by setting up the share rate when you create the referral code. You can't change this rate once you've set up the referral code, but you can always create new referral codes up to 20 at a time`
        }
    },
    {
        q: {
            vi: 'Làm sao để đủ điều kiện nhận hoa hồng?',
            en: 'What do I need to do to get a commission?'
        },
        a: {
            vi: 'Chỉ cần bạn bè gắn mã giới thiệu của mình và sử dụng sản phẩm của Nami thì bạn đã có thể nhận hoa hồng từ phí giao dịch của bạn bè. Tuy nhiên, để nhận được tỷ lệ hoa hồng cao hơn, bạn cần đăng ký trở thành đối tác kinh doanh chính thức của Nami.',
            en: `As long as your friends use Nami's products and include their referral code, you can obtain commissions from their transaction fees. But if you want a higher commission rate, you need to sign up as an official Nami business partner.`
        }
    }
];

const TermData = [
    {
        q: {
            vi: '1. Với mỗi lượt giới thiệu đủ điều kiện, bạn và người được giới thiệu sẽ nhận được bonus $20 bằng USDT. Lưu ý, không giới hạn số lượng bạn bè giới thiệu.',
            en: 'What is the referral program? When do I receive the reward of commission?'
        }
    },
    {
        q: {
            vi: '2. Với mỗi lượt giới thiệu đủ điều kiện, bạn và người được giới thiệu sẽ nhận được bonus $20 bằng USDT. Lưu ý, không giới hạn số lượng bạn bè giới thiệu.',
            en: 'What is the referral program? When do I receive the reward of commission?'
        }
    },
    {
        q: {
            vi: '3. Với mỗi lượt giới thiệu đủ điều kiện, bạn và người được giới thiệu sẽ nhận được bonus $20 bằng USDT. Lưu ý, không giới hạn số lượng bạn bè giới thiệu.',
            en: 'What is the referral program? When do I receive the reward of commission?'
        }
    }
];

const QnA = ({ id, t, language }) => {
    const policyLink =
        language === 'vi'
            ? 'https://nami.exchange/vi/support/announcement/tin-tuc-ve-nami/ra-mat-chuong-trinh-doi-tac-phat-trien-cong-dong-nami'
            : 'https://nami.exchange/support/announcement/nami-news/official-launching-of-nami-community-development-partnership-program';

    const renderData = (dataSource, type = '') => {
        const isBold = type === 'tern' || false;
        return (
            <div className="space-y-2">
                {dataSource?.map((data, index) => {
                    return (
                        <div key={index} className="group leading-6 py-2 last:pb-0">
                            <p className={classNames(' cursor-pointer mb-3', { 'font-semibold': !isBold, 'group-last:mb-0': isBold })}>{data.q[language]}</p>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark text-justify" style={{ whiteSpace: 'pre-line' }}>
                                {data?.a?.[language]}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };
    return (
        <>
            <div className="flex w-full gap-8" id={id}>
                <RefCard wrapperClassName="w-full bg-light dark:bg-darkBlue-3">
                    <div className="font-semibold text-2xl leading-6 mb-4">{title[language]}</div>
                    {renderData(QnAData)}
                    {/* <div className="text-teal underline font-medium text-center mt-8">
                    <Link href={policyLink}>
                        <a target="_blank">
                            {language === 'vi'
                                ? 'Xem thêm: Chính sách đối tác kinh doanh Nami Exchange'
                                : "Read more: Nami Exchange's policy on business partners"}
                        </a>
                    </Link>
                </div> */}
                </RefCard>
            </div>
            <div className="flex w-full gap-8 mt-[46px]" id={id}>
                <RefCard wrapperClassName="w-full bg-light dark:bg-darkBlue-3">
                    <div className="font-semibold text-2xl leading-6 mb-4">{Terms[language]}</div>
                    {renderData(TermData, 'tern')}
                </RefCard>
            </div>
        </>
    );
};

export default QnA;
