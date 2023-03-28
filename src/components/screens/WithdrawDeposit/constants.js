import { TYPES } from 'components/common/V2/TagV2';
import { PartnerOrderStatus } from 'redux/actions/const';
import { BxsInfoCircle, TimeLapseIcon, BxsErrorIcon, CancelIcon, CheckCircleIcon } from 'components/svg/SvgIcon';
import { PATHS } from 'constants/paths';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// time in seconds
export const REPORT_ABLE_TIME = 3 * 60;

export const DisputedType = {
    REJECTED: 1,
    REPORT: 2
};

export const MODE = {
    USER: 'user',
    PARTNER: 'partner'
};

export const TranferreredType = {
    //user-to-partner
    [MODE.USER]: {
        TAKE: 'TAKE_MONEY',
        TRANSFERRED: 'TRANSFERRED_MONEY'
    },

    //partner-to-user
    [MODE.PARTNER]: {
        TAKE: 'TAKE_MONEY',
        TRANSFERRED: 'TRANSFERRED_MONEY'
    }
};

export const ALLOWED_ASSET = {
    72: 'VNDC',
    22: 'USDT'
};

export const ALLOWED_ASSET_ID = {
    VNDC: 72,
    USDT: 22
};

export const TABS = [
    {
        key: 0,
        localized: 'Tất cả'
    },
    {
        key: 1,
        localized: 'Thành công',
        status: PartnerOrderStatus.SUCCESS,
        type: TYPES.SUCCESS
    },
    {
        key: 2,
        localized: 'Đang xử lý',
        status: PartnerOrderStatus.PENDING,
        type: TYPES.WARNING
    },
    {
        key: 3,
        localized: 'Đã từ chối',
        status: PartnerOrderStatus.REJECTED,
        type: TYPES.FAILED
    },
    {
        key: 4,
        localized: 'Đang tranh chấp',
        status: PartnerOrderStatus.DISPUTED,
        type: TYPES.FAILED
    }
];

export const MODAL_KEY = {
    CONFIRM: 'confirm',
    AFTER_CONFIRM: 'afterConfirm'
};

export const ICONS = {
    INFO: <BxsInfoCircle size={80} color="currentColor" />,
    SUCCESS: <CheckCircleIcon size={80} color="currentColor" />,
    TIMEOUT: <TimeLapseIcon size={80} />,
    WARNING: <BxsErrorIcon size={80} />,
    ERROR: <CancelIcon size={80} />
};

export const ORDER_TYPES = {
    CONFIRM_TRANSFERRED: {
        icon: ICONS['INFO'],
        title: ({ mode = MODE.USER }) => (mode === MODE.USER ? 'Xác nhận chuyển khoản' : 'Xác nhận giao dịch'),
        description: ({ mode = MODE.USER }) =>
            mode === MODE.USER
                ? 'Nếu bạn đã chuyển đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận để đối tác thanh toán cho bạn nhanh nhất.'
                : 'Khi ấn vào nút xác nhận, bạn sẽ chuyển tiền cho người mua, vui lòng kiểm tra kĩ số tiền nhận được và nội dung chuyển khoản trước khi thực hiện.',
        showConfirm: true
    },
    CONFIRM_TAKE_MONEY: {
        icon: ICONS['INFO'],
        title: () => 'Đã nhận tiền',
        description: ({ mode = MODE.USER }) =>
            mode === MODE.USER
                ? 'Nếu bạn đã nhận đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận.'
                : 'Khi ấn vào nút xác nhận, bạn đã nhận được tiền từ người mua, vui lòng kiểm tra kĩ số tiền nhận được và nội dung chuyển khoản trước khi xác nhận.',
        showConfirm: true
    },
    TRANSFERRED_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: () => 'Xác nhận thành công',
        description: ({ token, amount, displayingId, mode = MODE.USER }) =>
            mode === MODE.USER
                ? `Bạn đã chuyển thành công +${amount} ${token} vào tài khoản đối tác cho giao dịch ${displayingId}`
                : 'Bạn vừa xác nhận thanh toán thành công',
        showConfirm: false
    },
    CANCEL_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: ({ mode = MODE.USER }) => (mode === MODE.USER ? 'Huỷ giao dịch thành công' : 'Từ chối giao dịch thành công'),
        description: ({ displayingId }) => `Bạn đã hủy thành công giao dịch ${displayingId}`,
        showConfirm: (router) => (
            <ButtonV2 onClick={() => router.push(PATHS.WITHDRAW_DEPOSIT.DEFAULT)} className="transition-all mt-10">
                Rút lại
            </ButtonV2>
        )
    },
    REPORT_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: () => 'Khiếu nại giao dịch thành công',
        description: ({ displayingId }) => `Bạn đã khiếu nại thành công giao dịch ${displayingId}`,
        showConfirm: false
    },

    CANCEL_ORDER: {
        icon: ICONS['WARNING'],
        title: (mode = MODE.USER) => (mode === MODE.USER ? 'Huỷ giao dịch' : 'Từ chối giao dịch'),
        description: ({ side, token, mode = MODE.USER, id }) =>
            mode === MODE.USER ? `Bạn có chắc chắn huỷ lệnh ${side} ${token}?` : `Bạn có chắc chắn từ chối giao dịch ${id} ?`,
        showConfirm: true
    },
    REPORT: {
        icon: ICONS['WARNING'],
        title: () => 'Khiếu nại',
        description: ({ displayingId }) =>
            `Khiếu nại sẽ chuyển trạng thái của lệnh #${displayingId} sang trạng thái Đang tranh chấp, người dùng bắt buộc phải cung cấp các bằng chứng liên quan đến giao dịch như hình ảnh, tin nhắn,... `,
        showConfirm: true
    },
    ERROR_MAXIMUM_LIMIT: {
        icon: ICONS['ERROR'],
        title: () => 'Không thể thực hiện',
        description: ({ side, token }) => `Bạn đã đạt giới hạn ${side} ${token} trong ngày. Vui lòng thử lại vào ngày mai, xin cảm ơn.`,
        showConfirm: false
    },
    ERROR: {
        icon: ICONS['ERROR'],
        title: () => 'Không thể thực hiện',
        description: ({ errMsg }) => errMsg,
        showConfirm: false
    }
};
