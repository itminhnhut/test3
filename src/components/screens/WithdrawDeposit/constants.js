import { TYPES } from 'components/common/V2/TagV2';
import { PartnerOrderStatus } from 'redux/actions/const';
import { BxsInfoCircle, TimeLapseIcon, BxsErrorIcon, CancelIcon, CheckCircleIcon } from 'components/svg/SvgIcon';
import { PATHS } from 'constants/paths';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { SIDE } from 'redux/reducers/withdrawDeposit';

// time in seconds
export const REPORT_ABLE_TIME = 5 * 60 * 1000;

export const DisputedType = {
    REJECTED: 1,
    REPORT: 2,
    RESOLVE_DISPUTE: 3
};

export const MODE = {
    USER: 'user',
    PARTNER: 'partner'
};

export const TYPE_DW = {
    PARTNER: 'partner',
    CRYPTO: 'crypto'
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
        localized: 'common:processing',
        status: PartnerOrderStatus.PENDING,
        type: TYPES.WARNING
    },
    {
        key: 2,
        localized: 'transaction-history:completed',
        status: PartnerOrderStatus.SUCCESS,
        type: TYPES.SUCCESS
    },
    
    {
        key: 3,
        localized: 'common:denined',
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

export const ICONS = {
    INFO: <BxsInfoCircle size={80} color="currentColor" />,
    SUCCESS: <CheckCircleIcon size={80} color="currentColor" />,
    TIMEOUT: <TimeLapseIcon size={80} />,
    WARNING: <BxsErrorIcon size={80} />,
    ERROR: <CancelIcon size={80} />
};

export const ORDER_TYPES = {
    ACCEPT_ORDER: {
        icon: ICONS['INFO'],
        title: (t, mode = MODE.USER) => t('common:confirm'),
        description: ({ mode = MODE.USER, t }) => t(`dw_partner:transfer_confirm_description.${mode}`),
        showConfirm: true
    },
    RESOLVE_DISPUTE: {
        icon: ICONS['INFO'],
        title: (t, mode = MODE.USER) => t('dw_partner:resolve_dispute_title'),
        description: ({ mode = MODE.USER, t }) => t(`dw_partner:resolve_dispute_description`),
        showConfirm: true
    },

    CONFIRM_TRANSFERRED: {
        icon: ICONS['INFO'],
        title: (t, mode = MODE.USER) => t('common:confirm'),
        description: ({ mode = MODE.USER, t }) => t(`dw_partner:transfer_confirm_description.${mode}`),
        showConfirm: true
    },
    CONFIRM_TAKE_MONEY: {
        icon: ICONS['INFO'],
        title: (t) => t('common:confirm'),
        description: ({ mode = MODE.USER, t }) => t(`dw_partner:take_money_confirm_description.${mode}`),
        showConfirm: true
    },
    TRANSFERRED_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: (t) => t('common:success'),
        description: ({ t }) => t('dw_partner:confirm_transfer_success')
    },
    CANCEL_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: (t, mode = MODE.USER) => t('common:success'),
        description: ({ displayingId, amount, asset, side, t }) =>
            t('dw_partner:cancel_order_success', { orderId: displayingId, amount, asset, side: t(`common:${side.toLowerCase()}`) }),
        showConfirm: ({ router, t, assetId, side, mode, resetModalState }) => {
            return mode === MODE.PARTNER ? (
                <></>
            ) : (
                <ButtonV2
                    onClick={() => {
                        router.push(`${PATHS.WITHDRAW_DEPOSIT.PARTNER}?side=${side}&assetId=${assetId}`);
                        resetModalState();
                    }}
                    className="transition-all mt-10"
                >
                    {t('dw_partner:create_new_transaction')}
                </ButtonV2>
            );
        }
    },
    REPORT_SUCCESS: {
        icon: ICONS['SUCCESS'],
        title: (t) => t('common:success'),
        description: ({ displayingId, t }) => t('dw_partner:disputed_success', { orderId: displayingId }),
        showConfirm: false
    },
    CANCEL_ORDER: {
        icon: ICONS['WARNING'],
        title: (t, mode = MODE.USER) => t('dw_partner:cancel_transaction'),
        description: ({ side, token, mode = MODE.USER, id, amount, t }) => {
            if (side === 'BUY')
                return t('dw_partner:cancel_order_buy_description', {
                    orderId: id,
                    amount: amount,
                    asset: token,
                    note: mode === MODE.USER ? t('dw_partner:cancel_order_note') : ''
                });
            return t('dw_partner:cancel_order_sell_description', {
                orderId: id,
                amount: amount,
                asset: token,
                note: mode === MODE.PARTNER ? t('dw_partner:cancel_order_note') : ''
            });
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

export const TIME_FILTER = [
    {
        localized: 'common:all',
        value: 'all'
    },
    {
        localized: 'dw_partner:filter.a_day',
        value: 'd',
        format: 'hh:mm',
        interval: '1h'
    },
    {
        localized: 'dw_partner:filter.a_week',
        value: 'w',
        format: 'dd/MM',
        interval: '1d'
    },
    {
        localized: 'dw_partner:filter.a_month',
        value: 'm',
        format: 'dd/MM',
        interval: '1d'
    }
    // {
    //     localized: 'dw_partner:filter.custom',
    //     value: 'custom'
    // }
];

export const fiatFilter = [
    {
        key: null,
        localized: null
    },
    {
        key: 72,
        localized: ALLOWED_ASSET['72']
    },
    {
        key: 22,
        localized: ALLOWED_ASSET['22']
    }
];

export const sideFilter = [
    {
        key: null,
        localized: null
    },
    {
        key: SIDE.BUY,
        localized: 'common:BUY'
    },
    {
        key: SIDE.SELL,
        localized: 'common:SELL'
    }
];

export const statusFilter = [
    {
        key: null,
        localized: null
    },
    {
        key: PartnerOrderStatus.SUCCESS,
        localized: 'dw_partner:complete'
    },
    {
        key: PartnerOrderStatus.PENDING,
        localized: 'common:pending'
    },
    {
        key: PartnerOrderStatus.REJECTED,
        localized: 'common:denined'
    },
    {
        key: PartnerOrderStatus.DISPUTED,
        localized: 'common:disputing'
    }
];
