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
        localized: 'common:all'
    },
    {
        key: 1,
        localized: 'common:completed',
        status: PartnerOrderStatus.SUCCESS,
        type: TYPES.SUCCESS
    },
    {
        key: 2,
        localized: 'common:pending',
        status: PartnerOrderStatus.PENDING,
        type: TYPES.WARNING
    },
    {
        key: 3,
        localized: 'common:declined',
        status: PartnerOrderStatus.REJECTED,
        type: TYPES.FAILED
    },
    {
        key: 4,
        localized: 'common:disputing',
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
        title: (t, mode = MODE.USER) => (mode === MODE.USER ? t('common:confirm') : 'Xác nhận giao dịch'),
        description: ({ mode = MODE.USER, t }) =>
            mode === MODE.USER
                ? t('dw_partner:transfer_confirm_description')
                : 'Khi ấn vào nút xác nhận, bạn sẽ chuyển tiền cho người mua, vui lòng kiểm tra kĩ số tiền nhận được và nội dung chuyển khoản trước khi thực hiện.',
        showConfirm: true
    },
    CONFIRM_TAKE_MONEY: {
        icon: ICONS['INFO'],
        title: (t) => t('common:confirm'),
        description: ({ mode = MODE.USER, t }) =>
            mode === MODE.USER
                ? t('dw_partner:take_money_confirm_description')
                : 'Khi ấn vào nút xác nhận, bạn đã nhận được tiền từ người mua, vui lòng kiểm tra kĩ số tiền nhận được và nội dung chuyển khoản trước khi xác nhận.',
        showConfirm: true
    },
    TRANSFERRED_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: (t) => t('common:success'),
        description: ({ token, amount, displayingId, mode = MODE.USER, t }) =>
            mode === MODE.USER ? t('dw_partner:confirm_transfer_success') : 'Bạn vừa xác nhận thanh toán thành công',
        showConfirm: false
    },
    CANCEL_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: (t, mode = MODE.USER) => (mode === MODE.USER ? t('common:success') : 'Từ chối giao dịch thành công'),
        description: ({ displayingId, amount, asset, t }) => t('dw_partner:cancel_order_success', { orderId: displayingId, amount: amount, asset: asset }),
        showConfirm: ({ router, t, assetId, side }) => {
            return (
                <ButtonV2 onClick={() => router.push(`${PATHS.WITHDRAW_DEPOSIT.DEFAULT}?side=${side}&assetId=${assetId}`)} className="transition-all mt-10">
                    {t('dw_partner:create_new_transaction')}
                </ButtonV2>
            );
        }
    },
    REPORT_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: (t) => t('common:success'),
        description: ({ displayingId }) => `Bạn đã khiếu nại thành công giao dịch ${displayingId}`,
        showConfirm: false
    },

    CANCEL_ORDER: {
        icon: ICONS['WARNING'],
        title: (t, mode = MODE.USER) => (mode === MODE.USER ? t('common:cancel_order') : 'Từ chối giao dịch'),
        description: ({ side, token, mode = MODE.USER, id, amount, t }) => {
            if (mode === MODE.USER) {
                if (side === 'BUY')
                    return t('dw_partner:cancel_order_buy_description', {
                        orderId: id,
                        amount: amount,
                        asset: token
                    });
                return t('dw_partner:cancel_order_sell_description', {
                    orderId: id,
                    amount: amount,
                    asset: token
                });
            }
            return `Bạn có chắc chắn từ chối giao dịch ${id}?`;
        },
        showConfirm: true
    },
    REPORT: {
        icon: ICONS['WARNING'],
        title: (t) => t('dw_partner:appeal'),
        description: ({ displayingId, t }) => t('dw_partner:appeal_description', { orderId: displayingId }),
        showConfirm: true
    },
    ERROR_MAXIMUM_LIMIT: {
        icon: ICONS['ERROR'],
        title: (t) => t('common:failure'),
        description: ({ side, token, t }) => t('dw_partner:error.reach_limit_withdraw', { asset: token }),
        showConfirm: false
    },
    ERROR: {
        icon: ICONS['ERROR'],
        title: () => 'Không thể thực hiện',
        description: ({ errMsg }) => errMsg,
        showConfirm: false
    }
};
