const FAQ = [
    {
        title: {
            vi: 'Khoản vay crypto có thể được sử dụng cho các chiến lược khác như giao dịch chênh lệch giá không?',
            en: 'Khoản vay crypto có thể được sử dụng cho các chiến lược khác như giao dịch chênh lệch giá không?'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    },
    {
        title: {
            vi: 'Cách sử dụng các khoản vay crypto',
            en: 'Cách sử dụng các khoản vay crypto'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    },
    {
        title: {
            vi: 'Lãi suất vay được tính như thế nào?',
            en: 'Lãi suất vay được tính như thế nào?'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    },
    {
        title: {
            vi: 'Tôi có thể trả trước toàn bộ hay một phần khoản vay không?',
            en: 'Tôi có thể trả trước toàn bộ hay một phần khoản vay không?'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    },
    {
        title: {
            vi: 'Tỷ lệ khoản vay trên giá trị (loan-to-value/LTV) là gì?',
            en: 'Tỷ lệ khoản vay trên giá trị (loan-to-value/LTV) là gì?'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    },
    {
        title: {
            vi: 'Làm cách nào để điều chỉnh số tiền đảm bảo?',
            en: 'Làm cách nào để điều chỉnh số tiền đảm bảo?'
        },
        content: {
            vi: 'Người dùng chỉ cần duy trì số dư VNDC và USDT đạt mức tối thiểu tại ví Spot và ví Futures là đủ điều kiện tham gia chương trình.',
            en: 'Users only need to maintain a minimum balance of VNDC and USDT at Spot and Futures wallets to be eligible to participate in the program.'
        }
    }
];

const TABS = [
    { label: { vi: 'Vay Crypto', en: 'Vay Crypto' }, value: 'lending' },
    { label: { vi: 'Khoản vay của tôi', en: 'Khoản vay của tôi' }, value: 'loan' },
    { label: { vi: 'Lịch sử khoản vay', en: 'Lịch sử khoản vay' }, value: 'history' }
];

const BORROWING_TERM = [
    { vi: '7 ngày', en: '7 days', key: 7 },
    { vi: '30 ngày', en: '30 days', key: 30 }
];

const PROFITS = [
    { title: { vi: 'Lãi suất theo năm', en: 'Lãi suất theo năm' }, asset: '%', key: 'profit_yearn' },
    { title: { vi: 'Lãi suất hằng ngày', en: 'Lãi suất hằng ngày' }, asset: '%', key: 'profit_daily' },
    { title: { vi: 'Lãi ước tính theo giờ', en: 'Lãi ước tính theo giờ' }, asset: 'VNDC', key: 'profit_hours' },
    { title: { vi: 'Lãi ước tính theo kỳ hạn', en: 'Lãi ước tính theo kỳ hạn' }, asset: 'VNDC', key: 'profit_term' }
];

const LTV = [
    { title: { vi: 'LTV Ban đầu', en: 'LTV Ban đầu' }, key: 'ltv_initial' },
    { title: { vi: 'LTV Gọi ký quỹ', en: 'LTV Gọi ký quỹ' }, key: 'ltv_margin' },
    { title: { vi: 'LTV Thanh lý', en: 'LTV Thanh lý' }, key: 'ltv_liquidate' }
];

export { FAQ, TABS, BORROWING_TERM, PROFITS, LTV };
