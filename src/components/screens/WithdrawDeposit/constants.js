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

export const TranferreredType = {
    //user-to-partner
    U_P: {
        TAKE: 'TAKE_MONEY',
        TRANSFERRED: 'TRANSFERRED_MONEY'
    },

    //partner-to-user
    P_U: {
        TAKE: 'TAKE_MONEY',
        TRANSFERRED: 'TRANSFERRED_MONEY'
    }
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
    CHECK: <CheckCircleIcon size={80} color="currentColor" />,
    TIMELAPSE: <TimeLapseIcon size={80} />,
    ERROR: <BxsErrorIcon size={80} />,
    CANCEL: <CancelIcon size={80} />
};

export const ORDER_TYPES = {
    CONFIRM_TRANSFERRED: {
        icon: ICONS['INFO'],
        title: 'Xác nhận chuyển khoản',
        description: 'Nếu bạn đã chuyển đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận để đối tác thanh toán cho bạn nhanh nhất.',
        showConfirm: true
    },
    CONFIRM_TAKE_MONEY: {
        icon: ICONS['INFO'],
        title: 'Đã nhận tiền',
        description: 'Nếu bạn đã nhận đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận.',
        showConfirm: true
    },
    BUY_SUCCESS: {
        icon: ICONS['CHECK'],
        title: 'Xác nhận thành công',
        description: ({ token, amount, displayingId }) => `Bạn đã chuyển thành công +${amount} ${token} vào tài khoản đối tác cho giao dịch ${displayingId}`,
        showConfirm: false
    },
    CANCEL_SUCCESS: {
        icon: ICONS['CHECK'],
        title: 'Huỷ giao dịch thành công',
        description: (displayingId) => `Bạn đã hủy thành công giao dịch ${displayingId}`,
        showConfirm: (router) => (
            <ButtonV2 onClick={() => router.push(PATHS.WITHDRAW_DEPOSIT.DEFAULT)} className="transition-all mt-10">
                Rút lại
            </ButtonV2>
        )
    },
    REPORT_SUCCESS: {
        icon: ICONS['CHECK'],
        title: 'Khiếu nại giao dịch thành công',
        description: (displayingId) => `Bạn đã khiếu nại thành công giao dịch ${displayingId}`,
        showConfirm: false
    },
    TIMEOUT: {
        icon: ICONS['TIMELAPSE'],
        title: 'Thời gian xử lý giao dịch sắp kết thúc',
        description:
            'Nếu bạn đã chuyển đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận để đối tác thanh toán cho bạn nhanh nhất. Nếu không, lệnh mua VNDC của bạn sẽ bị huỷ.',
        showConfirm: true
    },
    CANCEL_ORDER: {
        icon: ICONS['ERROR'],
        title: 'Huỷ giao dịch',
        description: ({ side, token }) => `Bạn có chắc chắn huỷ lệnh ${side} ${token}?`,
        showConfirm: true
    },
    REPORT: {
        icon: ICONS['ERROR'],
        title: 'Khiếu nại',
        description: ({ displayingId }) =>
            `Khiếu nại sẽ chuyển trạng thái của lệnh #${displayingId} sang trạng thái Đang tranh chấp, người dùng bắt buộc phải cung cấp các bằng chứng liên quan đến giao dịch như hình ảnh, tin nhắn,... `,
        showConfirm: true
    },
    ERROR_MAXIMUM_LIMIT: {
        icon: ICONS['CANCEL'],
        title: 'Không thể thực hiện',
        description: ({ side, token }) => `Bạn đã đạt giới hạn ${side} ${token} trong ngày. Vui lòng thử lại vào ngày mai, xin cảm ơn.`,
        showConfirm: false
    },
    ERROR: {
        icon: ICONS['CANCEL'],
        title: 'Không thể thực hiện',
        description: ({ errMsg }) => errMsg,
        showConfirm: false
    }
};
