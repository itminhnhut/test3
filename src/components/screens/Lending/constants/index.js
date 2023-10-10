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
    }
];

const TABS = [
    { label: { vi: 'Vay Crypto', en: 'Vay Crypto' }, value: 'lending' },
    { label: { vi: 'Khoản vay của tôi', en: 'Khoản vay của tôi' }, value: 'loan' },
    { label: { vi: 'Lịch sử khoản vay', en: 'Lịch sử khoản vay' }, value: 'history' }
];

const BORROWING_TERM = [
    { vi: '7 ngày', en: '7 days', day: 7 },
    { vi: '30 ngày', en: '30 days', day: 30 }
];

const INTEREST = [
    { title: { vi: 'Lãi vay (năm)', en: 'Annual interest rate' }, asset: '%', key: 'interest_year' },
    { title: { vi: 'Lãi vay (ngày)', en: 'Daily interest rate' }, asset: '%', key: 'interest_daily' },
    { title: { vi: 'Lãi ước tính theo giờ', en: 'Est. Hourly interest' }, asset: 'VNDC', key: 'interest_hours' },
    { title: { vi: 'Tổng lãi ước tính', en: 'Est. Total interest' }, asset: 'VNDC', key: 'interest_term' }
];

const LTV = [
    { title: { vi: 'LTV ban đầu', en: 'Initial LTV' }, key: 'initial_ltv' },
    { title: { vi: 'LTV gọi ký quỹ', en: 'Margin call LTV' }, key: 'margin_ltv' },
    { title: { vi: 'LTV thanh lý', en: 'Liquidation LTV' }, key: 'liquidate_ltv' }
];

const HISTORY_TAB = [
    { title: { vi: 'Vay', en: 'Vay' }, key: 'loan' },
    { title: { vi: 'Thanh toán', en: 'Thanh toán' }, key: 'repay' },
    { title: { vi: 'Điều chỉnh ký quỹ', en: 'Điều chỉnh ký quỹ' }, key: 'adjust' },
    { title: { vi: 'Thanh lý', en: 'Thanh lý' }, key: 'reject' }
];

const STATUS_VI = [
    { title: 'Tất cả', value: 'CLOSED' },
    { title: 'Thanh lý', value: 'LIQUIDATED' },
    { title: 'Đã thanh toán', value: 'REPAID' }
];
const STATUS_EN = [
    { title: 'All', value: 'CLOSED' },
    { title: 'Thanh lý', value: 'LIQUIDATED' },
    { title: 'Đã thanh toán', value: 'REPAID' }
];

const HOUR = 24;
const LIMIT = 10;
const YEAR = 365;
const PERCENT = 100;
const MILLISECOND = 1;
const STATUS_CODE = 200;
const LOANABLE = 'loanable';
const COLLATERAL = 'collateral';
const DEFAULT_LOANABLE_ASSET = 'VNST';
const DEFAULT_COLLATERAL_ASSET = 'BNB';
const FORMAT_HH_MM_SS = 'HH:mm:ss dd/MM/yyyy';
const ALLOW_LTV_TOOLTIP = ['ltv_initial', 'ltv_margin', 'ltv_liquidate'];
const ALLOW_ADJUST = ['adjust', 'repay'];

const LOAN_HISTORY_STATUS = {
    ONGOING: { vi: 'Đang tính lãi', en: 'Đang tính lãi', contentTooltip: { vi: 'Đang tính lãi', en: 'Đang tính lãi' } },
    OVERDUE: { vi: 'Quá kì hạn', en: 'Quá kì hạn', contentTooltip: { vi: 'Quá kì hạn', en: 'Quá kì hạn' } },
    LTV_LIQUIDATED: { vi: 'chạm ltv thanh lý', en: 'chạm ltv thanh lý', contentTooltip: { vi: 'chạm ltv thanh lý', en: 'chạm ltv thanh lý' } },
    DEADLINE_LIQUIDATED: { vi: 'Hết hạn', en: 'Hết hạn', contentTooltip: { vi: 'Hết hạn', en: 'Hết hạn' } },
    REPAID: { vi: 'Đã trả', en: 'Đã trả', contentTooltip: { vi: 'Đã trả', en: 'Đã trả' } },
    ACCRUING_INTEREST: { vi: 'Đang tính lãi', en: 'Đang tính lãi', contentTooltip: { vi: 'Đang tính lãi', en: 'Đang tính lãi' } },
    MARGIN_CALL: { vi: 'Gọi ký quỹ', en: 'Gọi ký quỹ', contentTooltip: { vi: 'Gọi ký quỹ', en: 'Gọi ký quỹ' } }
};

const REGISTER_HANDLE_TYPE = {
    FROM_MAIN_MODAL: 'fromMainModal',
    FROM_CONFIRM_MODAL: 'fromConfirmModal'
};

export {
    FAQ,
    LTV,
    HOUR,
    YEAR,
    LIMIT,
    TABS,
    PERCENT,
    INTEREST,
    ALLOW_ADJUST,
    LOANABLE,
    STATUS_VI,
    STATUS_EN,
    COLLATERAL,
    MILLISECOND,
    STATUS_CODE,
    HISTORY_TAB,
    BORROWING_TERM,
    FORMAT_HH_MM_SS,
    LOAN_HISTORY_STATUS,
    REGISTER_HANDLE_TYPE,
    DEFAULT_LOANABLE_ASSET,
    DEFAULT_COLLATERAL_ASSET
};
