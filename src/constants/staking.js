export const APY_PERCENT = {
    VNDC: 12.79,
    USDT: 6
};

export const STAKING_RANGE = {
    72: {
        min: 10e3, // 10k
        max: 2e9, // 2 tỷ,
        DEFAULT: 100e6
    },
    22: {
        DEFAULT: 5e3,
        min: 5,
        max: 20e3 // 20k
    }
};

export const STEP_STAKING = [
    {
        imgSrc: '/images/staking/ic_account.png',
        title: { vi: 'Tạo tài khoản', en: 'Create an account' },
        subText: {
            vi: 'Tạo tài khoản Nami Exchange và hoàn tất KYC',
            en: 'Register a Nami Exchange account and complete KYC'
        }
    },
    {
        isDivider: true
    },
    {
        imgSrc: '/images/staking/ic_asset_digital.png',
        title: { vi: 'Nạp tài sản số', en: 'Deposit assets' },
        subText: {
            vi: 'Nạp VNDC hoặc USDT qua các blockchain hoặc qua hệ thống đối tác của Nami',
            en: 'Deposit VNDC and USDT on-chain or via our Partners'
        }
    },
    {
        isDivider: true
    },
    {
        imgSrc: '/images/staking/ic_staking.png',
        title: { vi: 'Nhận lãi hàng ngày', en: 'Daily Staking' },
        subText: {
            vi: 'Nhận lãi hàng ngày theo số lượng tài sản số lưu trữ trong ví vào lúc 00:00 mỗi ngày (giờ Việt Nam)',
            en: 'Get daily interest according to the quantity of digital assets stored in the wallet at 17:00 every day (UTC)'
        }
    }
];

export const WHY_CHOOSE_NAMI = [
    {
        title: { vi: 'Thuận tiện, dễ dàng', en: 'Convenient, easy' },
        context: {
            vi: 'Tiết kiệm mọi lúc mọi nơi với ứng dụng di động và website Nami Exchange cùng hệ thống hỗ trợ người dùng hoạt động 24/7',
            en: 'Make your saving anytime, anywhere with Nami Exchange mobile app and website and 24/7 user support system'
        }
    },
    {
        title: { vi: 'Không kỳ hạn, không khóa', en: 'No term, no lock' },
        context: {
            vi: 'Nhận lãi liên tục, hàng ngày, không yêu cầu khóa tài sản, được gửi trực tiếp vào ví người dùng',
            en: 'Receive continuous, daily interest, no asset lock required, sent directly to user wallet'
        }
    },
    {
        title: { vi: 'Lãi suất hấp dẫn', en: 'Attractive APY' },
        context: {
            vi: 'Lãi suất hấp dẫn và cạnh tranh trên thị trường, được tính kép trên số lượng tài sản thực tế, mức lãi suất năm căn bản với VNDC là 12.79% và USDT là 6%',
            en: 'Attractive and competitive interest rates in the market, compounded on the actual quantity of assets, the base APY for VNDC is 12.79% and USDT is 6%'
        }
    }
];

export const ASSET_DIGITAL = [
    {
        imgSrc: '/images/staking/ic_VNDC.png',
        title: 'VNDC',
        subText: 'VNDC',
        content: { vi: 'Lãi suất năm căn bản', en: 'Base APY' },
        percent: 12.79,
        btn: { vi: 'Nạp VNDC', en: 'Deposit VNDC' },
        href: 'withdraw-deposit/crypto?side=BUY&assetId=VNDC'
    },
    {
        imgSrc: '/images/staking/ic_USDT.png',
        title: 'Tether',
        subText: 'USDT',
        content: { vi: 'Lãi suất năm căn bản', en: 'Base APY' },
        percent: 6,
        btn: { vi: 'Nạp USDT', en: 'Deposit USDT' },
        href: 'withdraw-deposit/crypto?side=BUY&assetId=USDT'
    }
];

export const FAQ = [
    {
        title: {
            vi: 'Làm thế nào để tham gia chương trình Nhận lãi ngày (Daily Staking)?',
            en: 'How to join the Daily Staking program?'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    },
    {
        title: {
            vi: 'Ai có thể tham gia Daily Staking trên sàn giao dịch Nami Exchange?',
            en: 'Who can participate in Daily Staking on Nami Exchange?'
        },
        content: {
            vi: 'Chương trình Daily Staking áp dụng cho người dùng tạo tài khoản và đã hoàn tất xác minh danh tính (KYC) trên sàn giao dịch Nami Exchange.',
            en: 'The Daily Staking program applies to users who create an account and have completed identity verification (KYC) on the Nami Exchange.'
        }
    },
    {
        title: {
            vi: 'Chương trình Daily Staking áp dụng với loại tài sản nào?',
            en: 'What kind of assets does the Daily Staking program apply to?'
        },
        content: {
            vi: 'Hiện tại Nami Exchange áp dụng chương trình Daily Staking với hai loại tài sản là VNDC và USDT.',
            en: 'Currently, Nami Exchange applies the Daily Staking program with two types of assets, VNDC and USDT.'
        }
    },
    {
        title: {
            vi: 'Mức lãi suất Daily Staking hiện tại trên sàn giao dịch Nami Exchange là bao nhiêu?',
            en: 'What is the current Daily Staking interest rate on Nami Exchange?'
        },
        content: {
            isHTMl: true,
            vi: '<ul class="list-disc pl-5"><li class="text-gray-1 dark:text-gray-7">Đối với VNDC: Mức lãi suất năm (APY) là 12.79%, tương đương 0.0350%/ngày.</li><li class="text-gray-1 dark:text-gray-7">Đối với USDT: Mức lãi suất năm (APY) với USDT là 6%, tương đương 0.0164%/ngày.</li></ul>',
            en: '<ul class="list-disc pl-5"><li class="text-gray-1 dark:text-gray-7">For VNDC: The annual interest rate (APY) is 12.79%, equivalent to 0.0350%/day.</li><li class="text-gray-1 dark:text-gray-7">For USDT: The annual interest rate (APY) for USDT is 6%, equivalent to 0.0164%/day.</li></ul>'
        }
    },
    {
        title: {
            vi: 'Lãi suất Daily Staking là lãi đơn hay lãi kép?',
            en: 'Daily Staking interest is simple interest or compound interest?'
        },
        content: {
            isHTMl: true,
            vi: '<ul class="list-disc pl-5"><li>Lãi suất áp dụng trong chương trình Daily Staking là lãi suất kép.</li></ul><p class="mt-2 ">Ví dụ: Anh Nam nạp vào sàn Nami Exchange 100,000,000 VNDC</p><ul class="list-disc pl-5"><li>Ngày đầu tiên anh Nam nhận được lãi suất 35,000 VNDC</li><li>Ngày thứ hai, hệ thống tính lãi suất dựa trên số dư cộng dồn với lãi thực nhận là: 100,000,000 + 35,000 = 100,035,000. Anh Nam sẽ nhận về lãi suất là 35,012 VNDC</li></ul>',
            en: '<ul class="list-disc pl-5"><li>The interest rate applied in the Daily Staking program is compound interest.</li></ul><p class="mt-2 ">For example: David stores into Nami Exchange 10,000 USDT</p><ul class="list-disc pl-5"><li>On the first day, David received an interest of 1.6438 USDT</li><li>On the second day, the system calculates interest based on the accumulated balance with the actual received interest: 10,000 + 1.6438 = 10,001.6438 USDT, David will receive an interest of 1.6441 USDT</li></ul>'
        }
    },
    {
        title: {
            vi: 'Tôi cần gửi bao nhiêu để đủ điều kiện tối thiểu nhận lãi Staking?',
            en: 'How much do I need to deposit to qualify for Staking interest?'
        },
        content: {
            vi: 'Hạn mức tài sản tối thiểu là 10,000 VNDC hoặc 5 USDT, hạn mức tài sản tối đa là 2,000,000,000 VNDC hoặc 20,000 USDT. Người dùng có số lượng tài sản nhỏ hơn hạn mức tối thiểu không được hưởng lãi hàng ngày, người dùng có số lượng tài sản lớn hơn hạn mức tối đa sẽ chỉ được hưởng lãi bằng với lãi của hạn mức tối đa. Hạn mức tài sản tối thiểu là 10,000 VNDC hoặc 5 USDT, hạn mức tài sản tối đa là 2,000,000,000 VNDC hoặc 20,000 USDT. Người dùng có số lượng tài sản nhỏ hơn hạn mức tối thiểu không được hưởng lãi hàng ngày, người dùng có số lượng tài sản lớn hơn hạn mức tối đa sẽ chỉ được hưởng lãi bằng với lãi của hạn mức tối đa.',
            en: 'Minimum asset limit is 10,000 VNDC or 5 USDT, maximum asset limit is 2,000,000,000 VNDC or 20,000 USDT. Users with less than the minimum amount of assets will not be entitled to daily interest, users with a larger amount of assets than the maximum limit will only receive interest equal to the maximum limit.'
        }
    },
    {
        title: {
            vi: 'Khi nào tôi nhận lãi Daily Staking?',
            en: 'When do I receive Daily Staking interest?'
        },
        content: {
            vi: 'Nami xác định số dư ví người dùng vào lúc 00:00 mỗi ngày (giờ Việt Nam) và tiến hành trả lãi tự động ngay sau đó.',
            en: 'Nami records user wallet balance at 17:00 every day (UTC) and proceeds to pay interest automatically right after that.'
        }
    },
    {
        title: {
            vi: 'Cơ chế hoa hồng khi tôi giới thiệu người dùng tham gia chương  Daily Staking là gì?',
            en: 'What is the commission mechanism when I refer users to the Daily Staking chapter?'
        },
        content: {
            isHTMl: true,
            vi: '<ul class="list-disc pl-5 "><li >Đối với VNDC: Hoa hồng giới thiệu là 20% trên lãi thực nhận của người được giới thiệu. Lãi suất được trả bằng VNDC.</li></ul><p class="my-2" >Ví dụ: Anh Nam giới thiệu chị Nhi thông qua tính năng “giới thiệu người dùng” của Nami. Khi chị Nhi gửi vào 100,000,000 VNDC và nhận được lãi suất 35,000 VNDC, anh Nam sẽ nhận được hoa hồng giới thiệu ở mức 20% của 35,000 VNDC tương đương 7,000 VNDC.</p><ul class="list-disc pl-5"><li >Đối với USDT: Hoa hồng giới thiệu là 20% trên lãi thực nhận của người được giới thiệu. Lãi suất được trả bằng USDT.</li></ul><p class="mt-2">Ví dụ: Anh Nam giới thiệu chị Nhi thông qua tính năng “giới thiệu người dùng” của Nami. Khi chị Nhi gửi vào 20,000 USDT và nhận được lãi suất 3.2876 USDT, anh Nam sẽ nhận được hoa hồng là 20% của 4.38 USDT tương đương 0.6575 USDT.</p>',
            en: '<ul class="list-disc pl-5 "><li>For VNDC: Referral commission is 20% on the actual profit received by the referrer. Interest is paid in VNDC.</li></ul><p class="my-2">Example: Mr. Nam introduced Ms. Nhi through referral code or link. When Ms. Nhi deposits 100,000,000 VNDC and receives an interest of 27,397 VNDC, Mr. Nam will receive a referral commission at 20% of 27,397 VNDC, equivalent to 5,479 VNDC.</p><ul class="list-disc pl-5 "><li>For USDT: Referral commission is 20% on the actual profit received by the referrer. Interest is paid in USDT.</li></ul><p class="mt-2">Example: David introduced Sam through referral code or link. When Sam deposits 20,000 USDT and receives interest of 3.2876 USDT, David will receive a commission of 20% of 4.38 USDT equivalent to 0.6575 USDT.</p>'
        }
    },
    {
        title: {
            vi: 'Tôi để tài sản trong ví Futures có nhận được lãi suất Daily Staking không?',
            en: 'Will I get Daily Staking interest if I store assets in Futures wallet?'
        },
        content: {
            vi: 'Có. Nami áp dụng trả lãi suất trên tổng số dư ví Spot và ví Futures với các tài sản VNDC và USDT.',
            en: 'Yes. Nami applies the program on the total balance of Spot and Futures wallets with VNDC and USDT assets.'
        }
    }
];
