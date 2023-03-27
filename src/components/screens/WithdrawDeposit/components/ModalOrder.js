import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { isFunction } from 'redux/actions/utils';
import { BxsInfoCircle, TimeLapseIcon, BxsErrorIcon, CancelIcon, CheckCircleIcon } from 'components/svg/SvgIcon';
import classNames from 'classnames';

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
        description: ({displayingId}) =>
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

const ModalOrder = ({ isVisible, onClose, loading, type = ORDER_TYPES.CONFIRM, additionalData, onConfirm }) => {
    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            {type && (
                <div className="text-center ">
                    <div className="text-dominant flex justify-center mb-6">{type.icon}</div>
                    <div className="txtPri-3 mb-4">{type.title}</div>
                    <div className="txtSecond-2 ">{isFunction(type.description) ? additionalData && type.description(additionalData) : type.description}</div>
                    {type.showConfirm && isFunction(type.showConfirm) ? (
                        type.showConfirm()
                    ) : (
                        <ButtonV2 loading={loading} disabled={loading} onClick={!onConfirm ? onClose : () => onConfirm?.()} className="transition-all mt-10">
                            Xác nhận
                        </ButtonV2>
                    )}
                </div>
            )}
        </ModalV2>
    );
};

export default ModalOrder;
